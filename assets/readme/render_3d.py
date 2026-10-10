#!/usr/bin/env python3
"""Render original 3D README illustrations with Pillow."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent
BG_TOP = (11, 16, 27)
BG_BOTTOM = (8, 12, 20)
WHITE = (231, 238, 250)
MUTED = (141, 157, 180)
CYAN = (75, 212, 224)
BLUE = (99, 139, 255)
PURPLE = (168, 126, 255)
GREEN = (97, 218, 169)
SCALE_X = 74
SCALE_Y = 20
SCALE_Z = 66
CAMERA_Y = 790


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = (
        [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
        ]
        if bold
        else [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
        ]
    )
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


def project(x: float, y: float, z: float, size: tuple[int, int]) -> tuple[float, float]:
    return (
        size[0] / 2 + (x - y) * SCALE_X,
        CAMERA_Y + (x + y) * SCALE_Y - z * SCALE_Z,
    )


def gradient(size: tuple[int, int]) -> Image.Image:
    width, height = size
    image = Image.new("RGB", size)
    pixels = image.load()
    for y in range(height):
        t = y / max(height - 1, 1)
        color = tuple(round(a * (1 - t) + b * t) for a, b in zip(BG_TOP, BG_BOTTOM))
        for x in range(width):
            pixels[x, y] = color

    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.ellipse(
        (width * 0.18, height * 0.02, width * 0.83, height * 0.82),
        fill=(39, 72, 119, 68),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(width * 0.10))
    return Image.alpha_composite(image.convert("RGBA"), glow).convert("RGB")


def line(
    draw: ImageDraw.ImageDraw,
    points: list[tuple[float, float]],
    fill: tuple[int, int, int],
    width: int = 2,
) -> None:
    draw.line(points, fill=fill, width=width, joint="curve")


def polygon3d(
    draw: ImageDraw.ImageDraw,
    vertices: list[tuple[float, float, float]],
    size: tuple[int, int],
    fill: tuple[int, int, int],
    outline: tuple[int, int, int] | None = None,
    projector=None,
) -> list[tuple[float, float]]:
    if projector is None:
        projector = lambda x, y, z: project(x, y, z, size)
    projected = [projector(x, y, z) for x, y, z in vertices]
    draw.polygon(projected, fill=fill)
    if outline:
        line(draw, projected + [projected[0]], outline, 2)
    return projected


def box(
    draw: ImageDraw.ImageDraw,
    size: tuple[int, int],
    x: float,
    y: float,
    z: float,
    width: float,
    depth: float,
    height: float,
    front: tuple[int, int, int],
    side: tuple[int, int, int] | None = None,
    top: tuple[int, int, int] | None = None,
    projector=None,
) -> None:
    side = side or tuple(max(0, round(channel * 0.62)) for channel in front)
    top = top or tuple(min(255, round(channel * 1.22)) for channel in front)
    polygon3d(
        draw,
        [(x + width, y, z), (x + width, y + depth, z), (x + width, y + depth, z + height), (x + width, y, z + height)],
        size,
        side,
        projector=projector,
    )
    polygon3d(
        draw,
        [(x, y, z + height), (x + width, y, z + height), (x + width, y + depth, z + height), (x, y + depth, z + height)],
        size,
        top,
        projector=projector,
    )
    polygon3d(
        draw,
        [(x, y, z), (x + width, y, z), (x + width, y, z + height), (x, y, z + height)],
        size,
        front,
        tuple(min(255, channel + 27) for channel in front),
        projector,
    )


def text3d(
    draw: ImageDraw.ImageDraw,
    size: tuple[int, int],
    x: float,
    z: float,
    text: str,
    color: tuple[int, int, int] = WHITE,
    px: int = 17,
    bold: bool = False,
    y: float = -0.04,
) -> None:
    sx, sy = project(x, y, z, size)
    draw.text((round(sx), round(sy)), text, fill=color, font=font(px, bold))


def shadow(image: Image.Image, rect: tuple[int, int, int, int], alpha: int = 120, blur: int = 30) -> None:
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse(rect, fill=(0, 0, 0, alpha))
    image.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))


def dashboard(size: tuple[int, int] = (1440, 900), phase: float = 0.0) -> Image.Image:
    image = gradient(size).convert("RGBA")
    draw = ImageDraw.Draw(image)
    ox = size[0] / 2
    shadow(image, (round(ox - 540), 520, round(ox + 555), 870), 150, 34)

    # A perspective dashboard is built from extruded 3D panels and raised task cards.
    box(draw, size, -7, 0, 0, 14, 0.65, 8.2, (19, 27, 43), (14, 20, 34), (37, 50, 72))
    box(draw, size, -6.65, -0.08, 7.46, 0.38, 0.12, 0.38, (66, 119, 255))
    text3d(draw, size, -6.1, 7.52, "PROJECT SPACE", WHITE, 18, True)
    text3d(draw, size, 3.7, 7.48, "YOUR BOARD", MUTED, 13, True)
    line(
        draw,
        [project(-6.55, -0.10, 7.20, size), project(6.48, -0.10, 7.20, size)],
        (48, 62, 84),
        2,
    )

    columns = [
        ("TO DO", "02", -5.95, CYAN),
        ("IN PROGRESS", "02", -1.80, BLUE),
        ("REVIEW", "01", 2.35, PURPLE),
    ]
    for title, count, x, accent in columns:
        box(draw, size, x, -0.14, 0.70, 3.72, 0.24, 5.95, (24, 34, 52), (17, 25, 40), (32, 44, 65))
        text3d(draw, size, x + 0.18, 6.10, title, WHITE, 15, True, -0.18)
        text3d(draw, size, x + 3.05, 6.10, count, accent, 14, True, -0.18)

    cards = [
        (-5.72, 4.65, "Prepare launch brief", "Outline the project scope", CYAN),
        (-5.72, 3.25, "Review requirements", "Confirm the first milestone", GREEN),
        (-1.57, 4.65, "Build the workspace", "Bring the core pieces together", BLUE),
        (-1.57, 3.25, "Map the handoff", "Keep the next step visible", CYAN),
        (2.58, 4.65, "Check the details", "Review before moving forward", PURPLE),
    ]
    for index, (x, z, title, caption, accent) in enumerate(cards):
        bob = math.sin(phase + index * 0.6) * 0.035
        z += bob
        box(draw, size, x, -0.38, z, 3.25, 0.22, 1.12, (31, 43, 63), (20, 29, 45), (43, 57, 81))
        box(draw, size, x + 0.13, -0.44, z + 0.15, 0.075, 0.10, 0.72, accent)
        text3d(draw, size, x + 0.30, z + 0.79, title, WHITE, 13, True, -0.45)
        text3d(draw, size, x + 0.30, z + 0.44, caption, MUTED, 10, False, -0.45)

    # Small, restrained accent glows and a few background points add depth without clutter.
    for i, (x, y, r) in enumerate([(-580, 267, 3), (1190, 235, 2), (1275, 595, 2), (165, 670, 2)]):
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(CYAN, BLUE, PURPLE, GREEN)[i])
    return image.convert("RGB")


def architecture(size: tuple[int, int] = (1200, 760)) -> Image.Image:
    image = gradient(size).convert("RGBA")
    draw = ImageDraw.Draw(image)
    center_y = size[1] * 0.79

    def p(x: float, y: float, z: float) -> tuple[float, float]:
        return (size[0] / 2 + (x - y) * 59, center_y + (x + y) * 15 - z * 53)

    def node(x: float, y: float, z: float, w: float, h: float, title: str, sub: str, accent: tuple[int, int, int]) -> None:
        box(draw, size, x, y, z, w, 0.46, h, (23, 34, 53), (14, 23, 38), (42, 56, 79), p)
        tx, ty = p(x + 0.22, y - 0.06, z + h * 0.68)
        draw.text((round(tx), round(ty)), title, font=font(19, True), fill=WHITE)
        sx, sy = p(x + 0.22, y - 0.06, z + h * 0.39)
        draw.text((round(sx), round(sy)), sub, font=font(13), fill=MUTED)
        px, py = p(x + 0.21, y - 0.06, z + h - 0.20)
        draw.rounded_rectangle((px, py, px + 40, py + 5), 3, fill=accent)

    # Draw the connections first so the boxes sit naturally above them.
    connectors = [
        (p(-5.7, 0.2, 2.8), p(-2.0, 0.2, 2.8), CYAN),
        (p(-1.0, 0.2, 2.8), p(2.7, 0.2, 2.8), BLUE),
        (p(3.7, 0.2, 2.8), p(5.1, 1.0, 2.8), PURPLE),
    ]
    for start, end, color in connectors:
        line(draw, [start, end], color, 4)
        draw.ellipse((end[0] - 6, end[1] - 6, end[0] + 6, end[1] + 6), fill=color)

    node(-6.2, 0, 1.8, 3.1, 2.2, "React board", "UI + in-memory state", CYAN)
    node(-1.5, 0, 1.8, 3.1, 2.2, "Board fixture", "Seed data on first load", BLUE)
    node(3.2, 0, 1.8, 2.9, 2.2, "Browser storage", "localStorage", GREEN)
    return image.convert("RGB")


def workflow(size: tuple[int, int] = (1200, 760), active: int = -1, phase: float = 0.0) -> Image.Image:
    image = gradient(size).convert("RGBA")
    draw = ImageDraw.Draw(image)
    center_y = size[1] * 0.77

    def p(x: float, y: float, z: float) -> tuple[float, float]:
        return (size[0] / 2 + (x - y) * 51, center_y + (x + y) * 13 - z * 47)

    nodes = [
        (-8.6, "OPEN", "Load the board", CYAN),
        (-4.2, "ORGANIZE", "Add, edit or drag", BLUE),
        (0.2, "UPDATE", "React state changes", PURPLE),
        (4.6, "PERSIST", "Save to browser", GREEN),
    ]
    positions: list[tuple[float, float]] = []
    for index, (x, _, _, _) in enumerate(nodes):
        bob = math.sin(phase + index * 0.9) * 0.08
        positions.append(p(x + 1.2, 0.0, 3.0 + bob))

    for index in range(len(nodes) - 1):
        start, end = positions[index], positions[index + 1]
        color = CYAN if active == index else (43, 63, 91)
        line(draw, [start, end], color, 5)
        draw.ellipse((end[0] - 5, end[1] - 5, end[0] + 5, end[1] + 5), fill=color)

    for index, (x, title, subtitle, accent) in enumerate(nodes):
        bob = math.sin(phase + index * 0.9) * 0.08
        selected = active == index
        face = (33, 51, 77) if selected else (22, 33, 51)
        box(draw, size, x, 0, 2.1 + bob, 3.1, 0.42, 2.0, face, (14, 22, 36), (42, 57, 81), p)
        tx, ty = p(x + 0.20, -0.07, 3.25 + bob)
        draw.text((round(tx), round(ty)), title, font=font(16, True), fill=accent)
        sx, sy = p(x + 0.20, -0.07, 2.82 + bob)
        draw.text((round(sx), round(sy)), subtitle, font=font(12), fill=WHITE)
        if selected:
            radius = 8 + round(2 * math.sin(phase * 2) ** 2)
            cx, cy = positions[index]
            draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=accent)
    return image.convert("RGB")


def save_assets() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    dashboard().save(ROOT / "hero-3d.png", optimize=True)
    architecture().save(ROOT / "architecture-3d.png", optimize=True)
    workflow().save(ROOT / "workflow-3d.png", optimize=True)

    frames = [
        workflow((960, 608), active=index % 4, phase=index * math.tau / 12)
        for index in range(12)
    ]
    palette_frames = [frame.quantize(colors=128, method=Image.Quantize.FASTOCTREE) for frame in frames]
    palette_frames[0].save(
        ROOT / "workflow-animation.gif",
        save_all=True,
        append_images=palette_frames[1:],
        duration=115,
        loop=0,
        optimize=True,
        disposal=2,
    )


if __name__ == "__main__":
    save_assets()
