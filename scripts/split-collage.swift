// usage: swift split.swift <collage> <outPrefix>
// Splits a collage on its white gutters (recursive guillotine cuts) and writes each panel as JPEG.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: args[1]) as CFURL, nil)!
let img = CGImageSourceCreateImageAtIndex(src, 0, nil)!
let W = img.width, H = img.height
var px = [UInt8](repeating: 0, count: W * H * 4)
let ctx = CGContext(data: &px, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4,
                    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: W, height: H))

func white(_ x: Int, _ y: Int) -> Bool {
    let i = (y * W + x) * 4
    return px[i] > 232 && px[i + 1] > 232 && px[i + 2] > 232
}
// A gutter line is almost entirely white across the region.
// Gutters can be 1px and off-white, so test the mean of each pixel's darkest channel.
func lum(_ x: Int, _ y: Int) -> Int { let i = (y * W + x) * 4; return Int(min(px[i], px[i + 1], px[i + 2])) }
func colWhite(_ x: Int, _ r: (Int, Int, Int, Int)) -> Bool {
    var t = 0; for y in r.1..<r.3 { t += lum(x, y) }; return t / (r.3 - r.1) > 205
}
func rowWhite(_ y: Int, _ r: (Int, Int, Int, Int)) -> Bool {
    var t = 0; for x in r.0..<r.2 { t += lum(x, y) }; return t / (r.2 - r.0) > 205
}
// Interior white runs (not touching the region edges), as (start, end).
func runs(_ lo: Int, _ hi: Int, _ isW: (Int) -> Bool) -> [(Int, Int)] {
    var out: [(Int, Int)] = []; var s: Int? = nil
    for v in lo..<hi { if isW(v) { if s == nil { s = v } } else if let a = s { out.append((a, v)); s = nil } }
    return out.filter { $0.0 > lo + 40 && $0.1 < hi - 40 && $0.1 - $0.0 >= 1 }
}
var panels: [(Int, Int, Int, Int)] = []
func split(_ r: (Int, Int, Int, Int)) {
    if let g = runs(r.0, r.2, { colWhite($0, r) }).first {
        split((r.0, r.1, g.0, r.3)); split((g.1, r.1, r.2, r.3)); return
    }
    if let g = runs(r.1, r.3, { rowWhite($0, r) }).first {
        split((r.0, r.1, r.2, g.0)); split((r.0, g.1, r.2, r.3)); return
    }
    if r.2 - r.0 > 200 && r.3 - r.1 > 200 { panels.append(r) }
}
split((0, 0, W, H))
for (i, r) in panels.enumerated() {
    let inset = 3 // drop antialiased gutter edge
    let rect = CGRect(x: r.0 + inset, y: r.1 + inset, width: r.2 - r.0 - 2 * inset, height: r.3 - r.1 - 2 * inset)
    let crop = img.cropping(to: rect)!
    let url = URL(fileURLWithPath: "\(args[2])-\(i + 1).jpg")
    let dst = CGImageDestinationCreateWithURL(url as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(dst, crop, [kCGImageDestinationLossyCompressionQuality: 0.88] as CFDictionary)
    CGImageDestinationFinalize(dst)
    print("\(url.lastPathComponent) \(crop.width)x\(crop.height)")
}
