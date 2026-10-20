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
  const font = `700 ${size}px ${fontFamily}`;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font;
  probe.letterSpacing = `${LETTER_SPACING * size}px`;
  const m = probe.measureText(text);
  const pad = size * 0.2;
  const textW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const textH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  // Keep the long side at 1000px like the source, since the Poisson solve is O(pixels * 300).
  const scale = Math.min(1, 1000 / (textW + pad * 2));
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil((textW + pad * 2) * scale);
  canvas.height = Math.ceil((textH + pad * 2) * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.scale(scale, scale);
  ctx.font = font;
  ctx.letterSpacing = probe.letterSpacing;
  ctx.fillStyle = "#000";
  ctx.fillText(text, pad + m.actualBoundingBoxLeft, pad + m.actualBoundingBoxAscent);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("LiquidWordmark shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidWordmark({ text = "AMORA", className = "", speed = 0.25 }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const speedRef = useRef(speed);
  const label = text.toUpperCase();

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!wrap || !canvas || !fallback) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      await document.fonts.ready;
      // next/font generates the family name, so read it off the element that uses the class.
      const family = getComputedStyle(fallback).fontFamily || "system-ui, sans-serif";
      await document.fonts.load(`700 200px ${family}`, label).catch(() => {});
      if (disposed) return;

      const gl = canvas.getContext("webgl2", { antialias: true, alpha: true, premultipliedAlpha: true });
      if (!gl) return; // fallback stays

      const vs = compile(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fs = compile(gl, gl.FRAGMENT_SHADER, liquidFragSource);
      const program = gl.createProgram();
      if (!vs || !fs) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("LiquidWordmark program:", gl.getProgramInfoLog(program));
        return;
      }
      gl.useProgram(program);
      const loc = (name: string) => gl.getUniformLocation(program, name);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const image = parseLogo(rasterizeText(label, family));
      if (disposed) return;
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image.data);

      gl.uniform1i(loc("u_image_texture"), 0);
      gl.uniform1f(loc("u_img_ratio"), image.width / image.height);
      gl.uniform1f(loc("u_patternScale"), SHADER.patternScale);
      gl.uniform1f(loc("u_refraction"), SHADER.refraction);
      gl.uniform1f(loc("u_edge"), SHADER.edge);
      gl.uniform1f(loc("u_patternBlur"), SHADER.patternBlur);
      gl.uniform1f(loc("u_liquid"), SHADER.liquid);
      const uTime = loc("u_time");
      const uRatio = loc("u_ratio");

      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let time = 0;
      let last = 0;
      let raf = 0;
      let onScreen = true;

      const draw = () => {
        gl.uniform1f(uTime, time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      const frame = (now: number) => {
        time += (now - last) * speedRef.current;
        last = now;
        draw();
        raf = requestAnimationFrame(frame);
      };
      const sync = () => {
        const running = raf !== 0;
        const shouldRun = !reducedMotion && onScreen && !document.hidden;
        if (shouldRun && !running) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!shouldRun && running) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(wrap.clientWidth * dpr));
        const h = Math.max(1, Math.round(wrap.clientHeight * dpr));
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform1f(uRatio, w / h);
        draw(); // resizing clears the canvas; repaint even when paused
      };

      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      });
      io.observe(wrap);
      document.addEventListener("visibilitychange", sync);

      resize();
      sync();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", sync);
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
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
      <canvas
        key={label} // fresh element per label: cleanup loses the old GL context for good
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 block h-full w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}
