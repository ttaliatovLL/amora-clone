"use client";

// Ported from paper-design/liquid-logo (PolyForm Shield 1.0.0)
// https://github.com/paper-design/liquid-logo — WebGL setup and render loop from src/hero/canvas.tsx,
// defaults from src/hero/params.ts. Adapted to render a text wordmark with a static HTML fallback.

import { useEffect, useRef, useState } from "react";
import { liquidFragSource } from "./liquid-frag";
import { parseLogo } from "./parse-logo";

const vertexShaderSource = `#version 300 es
precision mediump float;
in vec2 a_position;
out vec2 vUv;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// params.ts defaults
const SHADER = { patternScale: 2, refraction: 0.015, edge: 0.4, patternBlur: 0.005, liquid: 0.07 };
const LETTER_SPACING = 0.08; // em

type Props = {
  text?: string;
  className?: string;
  /** Animation speed, 0..1 (source default 0.3). */
  speed?: number;
};

/** Draws `text` black-on-transparent with padding so the bevel never touches the image frame. */
function rasterizeText(text: string, fontFamily: string): ImageData {
  const size = 200;
  const spacing = LETTER_SPACING * size;
  const font = `700 ${size}px ${fontFamily}`;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font;
  // Canvas letterSpacing is missing on older Safari (iOS < 18.4): space the glyphs by hand there, or the canvas
  // letters come out tighter than the HTML fallback and jump at the crossfade.
  const native = typeof (probe as { letterSpacing?: unknown }).letterSpacing === "string";
  if (native) probe.letterSpacing = `${spacing}px`;
  const chars = [...text];
  const advances = chars.map((c) => probe.measureText(c).width + spacing);
  const m = probe.measureText(text);
  const left = native ? m.actualBoundingBoxLeft : probe.measureText(chars[0]).actualBoundingBoxLeft;
  const right = native
    ? m.actualBoundingBoxRight
    : advances.slice(0, -1).reduce((a, b) => a + b, 0) + probe.measureText(chars[chars.length - 1]).actualBoundingBoxRight;
  const pad = size * 0.2;
  const textW = left + right;
  const textH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  // Keep the long side at 1000px like the source, since the Poisson solve is O(pixels * 300).
  const scale = Math.min(1, 1000 / (textW + pad * 2));
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil((textW + pad * 2) * scale);
  canvas.height = Math.ceil((textH + pad * 2) * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.scale(scale, scale);
  ctx.font = font;
  ctx.fillStyle = "#000";
  const y = pad + m.actualBoundingBoxAscent;
  if (native) {
    ctx.letterSpacing = probe.letterSpacing;
    ctx.fillText(text, pad + left, y);
  } else {
    let x = pad + left;
    chars.forEach((c, i) => {
      ctx.fillText(c, x, y);
      x += advances[i];
    });
  }
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/** Which face the browser would draw `text` in right now: the advance width changes when the web font swaps in. */
function faceKey(text: string, fontFamily: string) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `700 200px ${fontFamily}`;
  return `${text}|${fontFamily}|${Math.round(ctx.measureText(text).width)}`;
}

// The Poisson solve costs ~50ms on a laptop and several times that on a phone: do it once per label and face.
const masks = new Map<string, ImageData>();
function getMask(key: string, label: string, family: string) {
  let mask = masks.get(key);
  if (!mask) {
    mask = parseLogo(rasterizeText(label, family));
    masks.set(key, mask);
  }
  return mask;
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (!gl.isContextLost()) console.error("LiquidWordmark shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidWordmark({ text = "AMORA", className = "", speed = 0.25 }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const fallbackRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const speedRef = useRef(speed);
  const label = text.toUpperCase();

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fallback = fallbackRef.current;
    if (!wrap || !fallback) return;

    // A fresh canvas per mount: a canvas whose context was lost on unmount (strict mode, Fast Refresh) hands the same
    // dead context back forever, so never reuse one.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 block h-full w-full opacity-0 transition-opacity duration-300";
    wrap.appendChild(canvas);

    let disposed = false;
    let cleanup = () => {};
    const show = (on: boolean) => {
      if (disposed) return;
      canvas.classList.toggle("opacity-0", !on);
      setReady(on);
    };

    (async () => {
      // next/font generates the family name, so read it off the element that uses the class.
      const family = getComputedStyle(fallback).fontFamily || "system-ui, sans-serif";
      await document.fonts.load(`700 200px ${family}`, label).catch(() => {});
      if (disposed) return;
      // Mounted but display:none (the age gate once the cookie is set): don't hold a GL context for nothing.
      if (!wrap.clientWidth) {
        await new Promise<void>((resolve) => {
          const ro = new ResizeObserver(() => wrap.clientWidth && resolve());
          ro.observe(wrap);
          cleanup = () => ro.disconnect();
        });
        cleanup();
      }

      const gl = canvas.getContext("webgl2", { antialias: true, alpha: true, premultipliedAlpha: true });
      if (!gl) return; // fallback stays

      let face = faceKey(label, family);
      let mask = getMask(face, label, family);
      let uTime: WebGLUniformLocation | null = null;
      let uRatio: WebGLUniformLocation | null = null;
      let uImgRatio: WebGLUniformLocation | null = null;
      let live = false; // GL resources exist on the current context

      const upload = () => {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mask.width, mask.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, mask.data);
        gl.uniform1f(uImgRatio, mask.width / mask.height);
      };

      // Everything that lives on the context; rerun after webglcontextrestored. Deleting is unnecessary: losing the
      // context frees it all.
      const init = () => {
        const vs = compile(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fs = compile(gl, gl.FRAGMENT_SHADER, liquidFragSource);
        const program = gl.createProgram();
        if (!vs || !fs || !program) return false;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          if (!gl.isContextLost()) console.error("LiquidWordmark program:", gl.getProgramInfoLog(program));
          return false;
        }
        gl.useProgram(program);
        const loc = (name: string) => gl.getUniformLocation(program, name);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        uTime = loc("u_time");
        uRatio = loc("u_ratio");
        uImgRatio = loc("u_img_ratio");
        upload();
        gl.uniform1f(uRatio, canvas.width / canvas.height); // until resize() has a real size (hidden at mount)
        gl.uniform1i(loc("u_image_texture"), 0);
        gl.uniform1f(loc("u_patternScale"), SHADER.patternScale);
        gl.uniform1f(loc("u_refraction"), SHADER.refraction);
        gl.uniform1f(loc("u_edge"), SHADER.edge);
        gl.uniform1f(loc("u_patternBlur"), SHADER.patternBlur);
        gl.uniform1f(loc("u_liquid"), SHADER.liquid);
        return true;
      };

      const motion = matchMedia("(prefers-reduced-motion: reduce)");
      let time = 0;
      let last = 0;
      let raf = 0;
      let onScreen = true;

      const draw = () => {
        if (!live) return;
        gl.uniform1f(uTime, time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      const frame = (now: number) => {
        // Clamp the step so a long stall doesn't jump the pattern; wrap so u_time stays precise (one seam per ~2h).
        time = (time + Math.min(now - last, 100) * speedRef.current) % 2e6;
        last = now;
        draw();
        raf = requestAnimationFrame(frame);
      };
      const sync = () => {
        const running = raf !== 0;
        const shouldRun = live && !motion.matches && onScreen && !document.hidden;
        if (shouldRun && !running) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!shouldRun && running) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };
      const resize = () => {
        if (!live || gl.isContextLost()) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const [maxW, maxH] = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;
        // Hidden or not laid out yet: keep the last good size instead of drawing into a 0-pixel canvas.
        if (!wrap.clientWidth || !wrap.clientHeight) return;
        const w = Math.min(maxW, Math.round(wrap.clientWidth * dpr));
        const h = Math.min(maxH, Math.round(wrap.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        gl.viewport(0, 0, w, h);
        gl.uniform1f(uRatio, w / h);
        draw(); // resizing clears the canvas; repaint even when paused
      };
      const start = () => {
        live = init();
        if (!live) return show(false); // fallback stays
        resize();
        sync();
        show(true);
      };

      // ResizeObserver misses devicePixelRatio changes (window dragged to another screen, zoom): watch them too.
      let dprQuery: MediaQueryList | null = null;
      const onDpr = () => {
        dprQuery?.removeEventListener("change", onDpr);
        dprQuery = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        dprQuery.addEventListener("change", onDpr);
        resize();
      };
      // Mobile Safari drops contexts in the background, and browsers evict the oldest when a page has too many.
      const onLost = (e: Event) => {
        e.preventDefault(); // allows webglcontextrestored
        live = false;
        sync();
        show(false);
      };
      // The web font may land after the first draw (slow network, swap): redraw the mask in the real face.
      const onFonts = () => {
        const now = faceKey(label, family);
        if (now === face) return;
        face = now;
        mask = getMask(face, label, family);
        if (!live) return;
        upload();
        draw();
      };

      const ro = new ResizeObserver(resize);
      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      });
      canvas.addEventListener("webglcontextlost", onLost);
      canvas.addEventListener("webglcontextrestored", start);
      document.addEventListener("visibilitychange", sync);
      document.fonts.addEventListener("loadingdone", onFonts);
      motion.addEventListener("change", sync);

      start();
      onDpr();
      ro.observe(wrap);
      io.observe(wrap);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        dprQuery?.removeEventListener("change", onDpr);
        canvas.removeEventListener("webglcontextlost", onLost);
        canvas.removeEventListener("webglcontextrestored", start);
        document.removeEventListener("visibilitychange", sync);
        document.fonts.removeEventListener("loadingdone", onFonts);
        motion.removeEventListener("change", sync);
        gl.getExtension("WEBGL_lose_context")?.loseContext(); // free the context now, not at GC
      };
    })();

    return () => {
      disposed = true;
      cleanup();
      canvas.remove();
      setReady(false);
    };
  }, [label]);

  return (
    <span
      ref={wrapRef}
      role="img"
      aria-label={text}
      className={`relative inline-block [container-type:size] ${className}`}
    >
      <span
        ref={fallbackRef}
        aria-hidden
        className={`font-display absolute inset-0 flex items-center justify-center uppercase leading-none whitespace-nowrap transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}
        // .font-display is unlayered CSS and would beat Tailwind weight/tracking utilities.
        style={{
          fontWeight: 700,
          letterSpacing: `${LETTER_SPACING}em`,
          // Matches the canvas contain-fit for Panchang "AMORA" (glyph box 6.26em x 0.71em + 0.2em padding each side).
          fontSize: "min(90cqh, 15cqw)",
          paddingLeft: `${LETTER_SPACING}em`, // balances the trailing letter-spacing
          color: "var(--color-paper, #F3F0EB)",
        }}
      >
        {label}
      </span>
    </span>
  );
}
