// Ported from paper-design/liquid-logo (PolyForm Shield 1.0.0)
// https://github.com/paper-design/liquid-logo — src/hero/parse-logo-image.ts
// Adapted: takes ImageData (the caller draws the shape) and returns the bevelled mask synchronously.

/**
 * Turns a shape (any non-transparent, non-white pixel) into the grey "distance from edge" map the
 * liquid shader samples: white outside, darkening toward the middle of each stroke.
 */
export function parseLogo(src: ImageData): ImageData {
  const { width, height, data } = src;
  const n = width * height;

  // 1) Inside/outside mask: pure white or fully transparent pixels are outside.
  const shape = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const p = i * 4;
    const a = data[p + 3];
    const white = data[p] === 255 && data[p + 1] === 255 && data[p + 2] === 255 && a === 255;
    shape[i] = a !== 0 && !white ? 1 : 0;
  }
  const inside = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height && shape[y * width + x] === 1;

  // 2) Boundary: shape pixels with at least one outside neighbour.
  const boundary = new Uint8Array(n);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!shape[y * width + x]) continue;
      outer: for (let ny = y - 1; ny <= y + 1; ny++) {
        for (let nx = x - 1; nx <= x + 1; nx++) {
          if (!inside(nx, ny)) {
            boundary[y * width + x] = 1;
            break outer;
          }
        }
      }
    }
  }

  // 3) Poisson solve: u_xx + u_yy = C, u = 0 on the boundary (Jacobi iterations).
  // Only interior pixels change; everything else stays 0. An interior pixel has all 8 neighbours inside the
  // image (else it would be boundary), so the 4-neighbour reads need no bounds checks.
  let count = 0;
  for (let i = 0; i < n; i++) if (shape[i] && !boundary[i]) count++;
  const interior = new Int32Array(count);
  for (let i = 0, k = 0; i < n; i++) if (shape[i] && !boundary[i]) interior[k++] = i;
  let u = new Float32Array(n);
  let next = new Float32Array(n);
  const C = 0.01;
  const ITERATIONS = 300;
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let k = 0; k < count; k++) {
      const idx = interior[k];
      next[idx] = (C + u[idx + 1] + u[idx - 1] + u[idx + width] + u[idx - width]) / 4;
    }
    [u, next] = [next, u];
  }

  // 4) Normalise and remap for contrast.
  let max = 0;
  for (let i = 0; i < n; i++) if (u[i] > max) max = u[i];
  const out = new ImageData(width, height);
  for (let i = 0; i < n; i++) {
    const p = i * 4;
    const gray = shape[i] && max > 0 ? 255 * (1 - Math.pow(u[i] / max, 2)) : 255;
    out.data[p] = out.data[p + 1] = out.data[p + 2] = gray;
    out.data[p + 3] = 255;
  }
  return out;
}
