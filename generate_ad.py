"""
Poli Ad Video Generator — askpoli.us
Produces: poli-ad.mp4 (1080x1920, 21s, 30fps, no audio)
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# ─── Constants ────────────────────────────────────────────────────────────────
W, H   = 1080, 1920
FPS    = 30
BLACK  = (0, 0, 0)
NAVY   = (8, 12, 16)
WHITE  = (255, 255, 255)
RED    = (224, 43, 43)
TEAL   = (0, 245, 212)

FONT_DIR = "/usr/share/fonts/truetype/liberation"
FONT_BOLD   = os.path.join(FONT_DIR, "LiberationSans-Bold.ttf")
FONT_REG    = os.path.join(FONT_DIR, "LiberationSans-Regular.ttf")

# ─── Font loaders ─────────────────────────────────────────────────────────────
def font(path, size):
    return ImageFont.truetype(path, size)

# ─── Frame helpers ─────────────────────────────────────────────────────────────
def blank(bg=BLACK):
    return Image.new("RGB", (W, H), bg)

def to_array(img):
    return np.array(img)

def frames(img, n):
    """Repeat a single PIL image n times as numpy arrays."""
    arr = to_array(img)
    return [arr] * n

def lerp(a, b, t):
    return int(a + (b - a) * t)

# ─── Text drawing ─────────────────────────────────────────────────────────────
def text_size(draw, text, fnt):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]

def draw_centered_text(img, lines, fnt, color=WHITE, y_center=None, line_spacing=1.0):
    """Draw multi-line text centered horizontally. Returns new image."""
    img = img.copy()
    draw = ImageDraw.Draw(img)
    line_heights = []
    line_widths  = []
    for line in lines:
        w, h = text_size(draw, line, fnt)
        line_widths.append(w)
        line_heights.append(h)
    line_h = max(line_heights) if line_heights else 0
    gap    = int(line_h * line_spacing)
    total_h = gap * len(lines)
    if y_center is None:
        y_center = H // 2
    y_start = y_center - total_h // 2
    for i, line in enumerate(lines):
        x = (W - line_widths[i]) // 2
        y = y_start + i * gap
        draw.text((x, y), line, font=fnt, fill=color)
    return img

def draw_text_at(img, text, x, y, fnt, color=WHITE):
    img = img.copy()
    draw = ImageDraw.Draw(img)
    draw.text((x, y), text, font=fnt, fill=color)
    return img

def measure_line(text, fnt):
    tmp = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    w, h = text_size(tmp, text, fnt)
    return w, h

# ─── Effects ──────────────────────────────────────────────────────────────────
def apply_glow(img, color=TEAL, radius=28):
    """Add a coloured glow by blurring a tinted version and compositing."""
    glow_layer = Image.new("RGB", (W, H), (0, 0, 0))
    # Composite the original text regions tinted to colour, then blur
    tinted = Image.new("RGB", (W, H), color)
    mask   = img.convert("L")
    glow_layer.paste(tinted, mask=mask)
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=radius))
    return Image.composite(img, glow_layer, Image.new("L", (W, H), 180))

def apply_glitch(img, dx=12, dy=4):
    """Offset a copy of the image slightly for a glitch frame."""
    arr = np.array(img)
    out = np.zeros_like(arr)
    # Red channel shifted right
    out[:, dx:, 0]  = arr[:, :-dx, 0]
    # Green channel normal
    out[:, :, 1]    = arr[:, :, 1]
    # Blue channel shifted left
    out[:, :-dx, 2] = arr[:, dx:, 2]
    # Shift entire image down slightly
    if dy > 0:
        out[dy:, :, :] = out[:-dy, :, :]
    return Image.fromarray(out.astype(np.uint8))

def fade_in_image(img, alpha_frac):
    """Multiply all pixels by alpha_frac (0.0→1.0)."""
    arr = (np.array(img) * alpha_frac).astype(np.uint8)
    return Image.fromarray(arr)

def zoom_image(img, scale):
    """Centre-crop at scale > 1.0 (zoom in) or scale < 1.0 (zoom out)."""
    if abs(scale - 1.0) < 0.001:
        return img
    nw, nh = int(W / scale), int(H / scale)
    left   = (W - nw) // 2
    top    = (H - nh) // 2
    cropped = img.crop((left, top, left + nw, top + nh))
    return cropped.resize((W, H), Image.LANCZOS)

def draw_sonar(img, radius, opacity_frac, color=TEAL):
    """Draw an expanding ring on the image."""
    img = img.copy()
    draw = ImageDraw.Draw(img)
    cx, cy = W // 2, H // 2
    r = int(radius)
    alpha = int(255 * opacity_frac)
    # Approximate transparency by blending colour toward bg
    c = (
        lerp(NAVY[0], color[0], opacity_frac),
        lerp(NAVY[1], color[1], opacity_frac),
        lerp(NAVY[2], color[2], opacity_frac),
    )
    for thick in range(4):
        draw.ellipse(
            [cx - r - thick, cy - r - thick, cx + r + thick, cy + r + thick],
            outline=c
        )
    return img

# ─── Shot renderers ───────────────────────────────────────────────────────────

def shot_1():
    """0:00–0:02 | "THEY SAID ONE THING." slams in from left (60 frames)."""
    fnt   = font(FONT_BOLD, 160)
    text  = "THEY SAID\nONE THING."
    lines = text.split("\n")
    result = []
    total  = FPS * 2  # 60 frames

    # Measure total block size
    tmp_draw = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    lh = max(text_size(tmp_draw, l, fnt)[1] for l in lines)
    gap = int(lh * 1.1)
    block_h = gap * len(lines)
    y_start = H // 2 - block_h // 2

    # Slam: 8 frames to slide in from left, hold rest
    slam_frames = 8
    for f in range(total):
        img  = blank(BLACK)
        draw = ImageDraw.Draw(img)
        t    = min(f / slam_frames, 1.0)
        for i, line in enumerate(lines):
            lw, _ = text_size(draw, line, fnt)
            target_x = (W - lw) // 2
            start_x  = -lw - 60
            x = lerp(start_x, target_x, t ** 0.4)  # ease-out
            y = y_start + i * gap
            draw.text((x, y), line, font=fnt, fill=WHITE)
        result.append(to_array(img))
    return result


def shot_2():
    """0:02–0:04 | "THEN THEY DID / THE OPPOSITE." — OPPOSITE flashes red (60 frames)."""
    fnt_top  = font(FONT_BOLD, 150)
    fnt_bot  = font(FONT_BOLD, 180)
    total    = FPS * 2  # 60 frames
    red_start, red_end = 25, 33  # frames within this shot

    line1 = "THEN THEY DID"
    line2 = "THE OPPOSITE."

    tmp_draw = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    w1, h1 = text_size(tmp_draw, line1, fnt_top)
    w2, h2 = text_size(tmp_draw, line2, fnt_bot)
    gap    = int(h1 * 1.15)
    block_h = gap + h2
    y_start = H // 2 - block_h // 2

    result = []
    for f in range(total):
        img  = blank(BLACK)
        draw = ImageDraw.Draw(img)
        # line1 slams down from top (8 frames)
        t1   = min(f / 8, 1.0)
        x1   = (W - w1) // 2
        y1   = y_start
        start_y1 = -h1 - 60
        draw.text((x1, lerp(start_y1, y1, t1 ** 0.4)), line1, font=fnt_top, fill=WHITE)
        # line2 after 4 frames
        if f >= 4:
            t2   = min((f - 4) / 8, 1.0)
            x2   = (W - w2) // 2
            y2   = y_start + gap
            start_y2 = -h2 - 60
            col2 = RED if red_start <= f < red_end else WHITE
            draw.text((x2, lerp(start_y2, y2, t2 ** 0.4)), line2, font=fnt_bot, fill=col2)
        result.append(to_array(img))
    return result


def shot_3():
    """0:04–0:06 | "AND NOBODY / CALLED IT OUT." — glitch effect (60 frames)."""
    fnt   = font(FONT_BOLD, 160)
    lines = ["AND NOBODY", "CALLED IT OUT."]
    total = FPS * 2

    glitch_frames = {10, 11, 12, 22, 23, 35}

    result = []
    for f in range(total):
        img = blank((13, 13, 13))
        t   = min(f / 8, 1.0)
        # Slam in
        tmp_draw = ImageDraw.Draw(img)
        lh  = max(text_size(tmp_draw, l, fnt)[1] for l in lines)
        gap = int(lh * 1.1)
        block_h = gap * len(lines)
        y_start = H // 2 - block_h // 2
        for i, line in enumerate(lines):
            lw, _ = text_size(tmp_draw, line, fnt)
            tx   = (W - lw) // 2
            ty   = y_start + i * gap
            if f < 8:
                sx = -lw - 60
                tx = lerp(sx, tx, t ** 0.4)
            tmp_draw.text((tx, ty), line, font=fnt, fill=WHITE)

        if f in glitch_frames:
            img = apply_glitch(img, dx=14, dy=3)
        result.append(to_array(img))
    return result


def shot_4():
    """0:06–0:08 | "NOT THE MEDIA. / NOT THE PARTY. / NOT ANYONE." stagger + red flash (60 frames)."""
    fnt   = font(FONT_BOLD, 150)
    lines = ["NOT THE MEDIA.", "NOT THE PARTY.", "NOT ANYONE."]
    total = FPS * 2

    stagger = [0, 6, 12]     # frame each line enters
    red_start = 46            # red flash at ~frame 46

    result = []
    for f in range(total):
        img  = blank(BLACK)
        draw = ImageDraw.Draw(img)
        lh   = text_size(draw, lines[0], fnt)[1]
        gap  = int(lh * 1.15)
        block_h = gap * len(lines)
        y_start = H // 2 - block_h // 2

        for i, line in enumerate(lines):
            if f < stagger[i]:
                continue
            lw, _ = text_size(draw, line, fnt)
            tx    = (W - lw) // 2
            ty    = y_start + i * gap
            col   = RED if f >= red_start else WHITE
            draw.text((tx, ty), line, font=fnt, fill=col)
        result.append(to_array(img))
    return result


def shot_5():
    """0:08–0:10 | "YOU JUST HAD TO / FIGURE IT OUT / YOURSELF." — YOURSELF zooms in (60 frames)."""
    fnt_main  = font(FONT_BOLD, 150)
    fnt_big   = font(FONT_BOLD, 185)
    lines_top = ["YOU JUST HAD TO", "FIGURE IT OUT"]
    line_bot  = "YOURSELF."
    total     = FPS * 2

    result = []
    for f in range(total):
        img  = blank(BLACK)
        draw = ImageDraw.Draw(img)

        lh   = text_size(draw, lines_top[0], fnt_main)[1]
        lh_b = text_size(draw, line_bot, fnt_big)[1]
        gap  = int(lh * 1.12)
        block_h = gap * 2 + int(lh_b * 1.12)
        y_start = H // 2 - block_h // 2

        for i, line in enumerate(lines_top):
            lw, _ = text_size(draw, line, fnt_main)
            draw.text(((W - lw) // 2, y_start + i * gap), line, font=fnt_main, fill=WHITE)

        # YOURSELF enters at frame 20, zoom-in effect (3 frames)
        if f >= 20:
            lw, _ = text_size(draw, line_bot, fnt_big)
            tx = (W - lw) // 2
            ty = y_start + 2 * gap
            draw.text((tx, ty), line_bot, font=fnt_big, fill=WHITE)

            # Zoom via scale on first 3 frames
            zoom_f = f - 20
            if zoom_f < 3:
                scale = 1.2 - (0.2 * zoom_f / 3)
                img = zoom_image(img, scale)

        result.append(to_array(img))
    return result


def beat():
    """0:10–0:11.5 | Black silence (45 frames)."""
    b = blank(BLACK)
    return [to_array(b)] * 45


def shot_6():
    """0:11.5–0:14 | "POLI" teal fade-in + glow + subtitle (75 frames)."""
    fnt_poli = font(FONT_BOLD, 280)
    fnt_sub  = font(FONT_REG,  68)
    total    = 75

    sub_text = "political truth. ranked. sourced."

    result = []
    for f in range(total):
        img  = blank(NAVY)
        draw = ImageDraw.Draw(img)

        # POLI fades in over 12 frames
        alpha = min(f / 12, 1.0)
        pw, ph = text_size(draw, "POLI", fnt_poli)
        px = (W - pw) // 2
        py = H // 2 - ph // 2 - 60

        # Draw POLI in teal with fade
        col = (
            int(TEAL[0] * alpha),
            int(TEAL[1] * alpha),
            int(TEAL[2] * alpha),
        )
        draw.text((px, py), "POLI", font=fnt_poli, fill=col)

        # Glow after frame 8
        if f >= 8:
            glow_strength = min((f - 8) / 10, 0.7)
            glow = Image.new("RGB", (W, H), NAVY)
            gd   = ImageDraw.Draw(glow)
            gd.text((px, py), "POLI", font=fnt_poli, fill=TEAL)
            glow = glow.filter(ImageFilter.GaussianBlur(radius=30))
            img  = Image.fromarray(
                np.clip(
                    np.array(img).astype(int) + (np.array(glow).astype(int) * glow_strength).astype(int),
                    0, 255
                ).astype(np.uint8)
            )
            draw = ImageDraw.Draw(img)
            # Redraw POLI on top of glow
            draw.text((px, py), "POLI", font=fnt_poli, fill=col)

        # Subtitle fades in at frame 18
        if f >= 18:
            sub_alpha = min((f - 18) / 12, 1.0)
            sw, _ = text_size(draw, sub_text, fnt_sub)
            sx = (W - sw) // 2
            sy = py + ph + 30
            sc = (int(255 * sub_alpha),) * 3
            draw.text((sx, sy), sub_text, font=fnt_sub, fill=sc)

        result.append(to_array(img))
    return result


def shot_7():
    """0:14–0:17 | Main text letter-by-letter + teal checkmarks (90 frames)."""
    fnt_main  = font(FONT_BOLD, 140)
    fnt_check = font(FONT_REG,  70)
    main_lines = ["SEE EXACTLY WHERE", "THEY CONTRADICTED", "THEMSELVES."]
    check_lines = ["\u2713 Every contradiction.", "\u2713 Every source.", "\u2713 Every time."]
    total = 90

    # Letter-by-letter: 2 frames per letter
    all_chars = "".join(main_lines)
    letters_per_line = [len(l) for l in main_lines]

    result = []
    for f in range(total):
        img  = blank(NAVY)
        draw = ImageDraw.Draw(img)

        lh   = text_size(draw, main_lines[0], fnt_main)[1]
        gap  = int(lh * 1.12)
        block_h = gap * len(main_lines)
        y_start = H // 2 - block_h // 2 - 120

        # How many chars to show
        chars_shown = min(f // 2, len(all_chars))
        pos = 0
        for i, line in enumerate(main_lines):
            ll = letters_per_line[i]
            shown = max(0, min(chars_shown - pos, ll))
            partial = line[:shown]
            lw, _ = text_size(draw, partial or " ", fnt_main)
            draw.text(((W - text_size(draw, line, fnt_main)[0]) // 2, y_start + i * gap),
                      partial, font=fnt_main, fill=WHITE)
            pos += ll

        # Teal check lines stagger in
        check_y_start = y_start + block_h + 40
        check_gap     = 90
        for j, cl in enumerate(check_lines):
            appear_frame = 50 + j * 12
            if f >= appear_frame:
                alpha = min((f - appear_frame) / 8, 1.0)
                cw, _ = text_size(draw, cl, fnt_check)
                cx    = (W - cw) // 2
                cy    = check_y_start + j * check_gap
                col   = (int(TEAL[0]*alpha), int(TEAL[1]*alpha), int(TEAL[2]*alpha))
                draw.text((cx, cy), cl, font=fnt_check, fill=col)

        result.append(to_array(img))
    return result


def shot_8():
    """0:17–0:19 | "THE PROOF IS THERE..." + sonar ripple (60 frames)."""
    fnt  = font(FONT_BOLD, 145)
    lines = ["THE PROOF IS THERE.", "YOU JUST NEEDED", "A WAY TO SEE IT."]
    total = 60

    result = []
    for f in range(total):
        img  = blank(NAVY)
        draw = ImageDraw.Draw(img)

        lh   = text_size(draw, lines[0], fnt)[1]
        gap  = int(lh * 1.12)
        block_h = gap * len(lines)
        y_start = H // 2 - block_h // 2

        for i, line in enumerate(lines):
            lw, _ = text_size(draw, line, fnt)
            alpha = min(f / 12, 1.0)
            col = (int(255 * alpha),) * 3
            draw.text(((W - lw) // 2, y_start + i * gap), line, font=fnt, fill=col)

        # Sonar pulse: triggered at frame 28 (on word "see"), expands outward
        if f >= 28:
            sonar_f  = f - 28
            max_r    = max(W, H)
            radius   = (sonar_f / 32) * max_r
            opacity  = max(0.0, 1.0 - sonar_f / 32)
            if opacity > 0:
                img = draw_sonar(img, radius, opacity)

        result.append(to_array(img))
    return result


def end_card():
    """0:19–0:21 | Static: POLI + askpoli.us + tagline + handle (60 frames)."""
    fnt_logo    = font(FONT_BOLD, 260)
    fnt_url     = font(FONT_REG,  72)
    fnt_tagline = font(FONT_REG,  88)
    fnt_handle  = font(FONT_REG,  62)

    img  = blank(NAVY)
    draw = ImageDraw.Draw(img)

    # POLI centred, teal
    pw, ph = text_size(draw, "POLI", fnt_logo)
    px = (W - pw) // 2
    py = H // 2 - 320
    draw.text((px, py), "POLI", font=fnt_logo, fill=TEAL)

    # Glow
    glow = Image.new("RGB", (W, H), NAVY)
    gd   = ImageDraw.Draw(glow)
    gd.text((px, py), "POLI", font=fnt_logo, fill=TEAL)
    glow = glow.filter(ImageFilter.GaussianBlur(radius=28))
    img  = Image.fromarray(
        np.clip(np.array(img).astype(int) + (np.array(glow).astype(int) * 0.6).astype(int), 0, 255).astype(np.uint8)
    )
    draw = ImageDraw.Draw(img)
    draw.text((px, py), "POLI", font=fnt_logo, fill=TEAL)

    # Thin teal rule under logo
    rule_y = py + ph + 18
    draw.line([(px, rule_y), (px + pw, rule_y)], fill=TEAL, width=3)

    # URL
    url_text = "askpoli.us"
    uw, _ = text_size(draw, url_text, fnt_url)
    draw.text(((W - uw) // 2, rule_y + 28), url_text, font=fnt_url, fill=WHITE)

    # Tagline
    tag = "See through it."
    tw, _ = text_size(draw, tag, fnt_tagline)
    draw.text(((W - tw) // 2, rule_y + 120), tag, font=fnt_tagline, fill=WHITE)

    # Handle
    handle = "@askpoli"
    hw, _ = text_size(draw, handle, fnt_handle)
    draw.text(((W - hw) // 2, rule_y + 230), handle, font=fnt_handle, fill=TEAL)

    arr = to_array(img)
    return [arr] * 60


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("Rendering Poli ad (askpoli.us)...")
    print("  Shot 1...")
    all_frames = shot_1()
    print("  Shot 2...")
    all_frames += shot_2()
    print("  Shot 3...")
    all_frames += shot_3()
    print("  Shot 4...")
    all_frames += shot_4()
    print("  Shot 5...")
    all_frames += shot_5()
    print("  Beat (silence)...")
    all_frames += beat()
    print("  Shot 6 (POLI reveal)...")
    all_frames += shot_6()
    print("  Shot 7 (contradictions)...")
    all_frames += shot_7()
    print("  Shot 8 (proof)...")
    all_frames += shot_8()
    print("  End card...")
    all_frames += end_card()

    print(f"  Total frames: {len(all_frames)} ({len(all_frames)/FPS:.1f}s)")

    from moviepy import ImageSequenceClip
    clip = ImageSequenceClip(all_frames, fps=FPS)
    out_path = os.path.join(os.path.dirname(__file__), "poli-ad.mp4")
    clip.write_videofile(out_path, codec="libx264", audio=False, logger="bar")
    print(f"\nDone! Output: {out_path}")


if __name__ == "__main__":
    main()
