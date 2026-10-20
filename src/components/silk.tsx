"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

// three.js + R3F are heavy: load them only in the browser, only where the silk is shown.
const Gradient = dynamic(
  () =>
    import("@shadergradient/react").then(({ ShaderGradientCanvas, ShaderGradient }) => {
      function G({ animate }: { animate: boolean }) {
        return (
          <ShaderGradientCanvas style={{ position: "absolute", inset: 0 }} pixelDensity={1} fov={45} pointerEvents="none">
            <ShaderGradient
              control="props"
              type="waterPlane"
              animate={animate ? "on" : "off"}
              uTime={2}
              uSpeed={0.08}
              uStrength={3.2}
              uDensity={1.1}
              uFrequency={4}
              uAmplitude={0}
              positionX={0}
              positionY={0}
              positionZ={0}
              rotationX={0}
              rotationY={0}
              rotationZ={210}
              color1="#0a0a0a"
              color2="#9a1a33"
              color3="#ff6b7d"
              reflection={0.08}
              cAzimuthAngle={180}
              cPolarAngle={90}
              cDistance={3.4}
              cameraZoom={1}
              lightType="3d"
              brightness={1.25}
              envPreset="city"
              grain="on"
              grainBlending={0.25}
            />
          </ShaderGradientCanvas>
        );
      }
      return G;
    }),
  { ssr: false },
);

// Checked once per page: a probe canvas that can't give a WebGL context means three.js would throw on mount.
let webgl: boolean | undefined;
function hasWebGL() {
  if (webgl === undefined) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

/** If the shader still fails (context lost, driver refuses), render nothing: the ink ground is the fallback. */
class Quiet extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Dark silk in motion: the landing's one moving field (shadergradient). Fades in once WebGL is up; pauses offscreen. */
export function Silk({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(([e]) => {
      setVisible((v) => v || (e.isIntersecting && hasWebGL()));
      setAnimate(e.isIntersecting && !reduce.matches);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none overflow-hidden bg-ink ${className}`}>
      {visible && (
        <div className="absolute inset-0 animate-[silk-in_2.4s_var(--ease-out)_both]">
          <Quiet>
            <Gradient animate={animate} />
          </Quiet>
        </div>
      )}
    </div>
  );
}
