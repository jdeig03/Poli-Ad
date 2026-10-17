# Synthesizes the end-card sound design (48 kHz stereo WAV), synced to endcard.html timings.
# Usage: python3 sound.py out.wav
import sys, wave
import numpy as np
from scipy import signal

SR, DUR = 48000, 6.0
N = int(SR * DUR)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)

# timings shared with endcard.html
SMILE_T0, SMILE_T1 = 0.12, 0.82
BLOOM_T = 0.80
RISE_T0, RISE_T1 = 1.35, 2.15
WORD_T = 1.72
PILL_T = 2.22
TYPE_T0, TYPE_DT, NCHARS = 2.72, 0.072, 10
SEND_T = TYPE_T0 + NCHARS * TYPE_DT + 0.14   # 3.58s


def place(sig, t0, pan=0.0, gain=1.0):
    """Mix a mono clip into the stereo bus at time t0 (constant-power pan, -1..1)."""
    i0 = int(round(t0 * SR))
    if i0 >= N: return
    sig = sig[:N - i0] * gain
    pl, pr = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    L[i0:i0 + len(sig)] += sig * pl
    R[i0:i0 + len(sig)] += sig * pr


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype='band', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def swept_noise(dur, f_start, f_end, q=1.2, curve=1.0):
    """Noise through a band-pass whose centre sweeps f_start -> f_end (the 'whoosh')."""
    n = int(dur * SR); x = rng.standard_normal(n); y = np.zeros(n)
    blk = 128; zi = np.zeros((2, 2))
    for b in range(0, n, blk):
        k = (b / n) ** curve
        fc = f_start * (f_end / f_start) ** k
        bw = fc / q
        sos = signal.butter(2, [max(30, fc - bw / 2), min(SR / 2 - 100, fc + bw / 2)], btype='band', fs=SR, output='sos')
        y[b:b + blk], zi = signal.sosfilt(sos, x[b:b + blk], zi=zi)
    return y / (np.max(np.abs(y)) + 1e-9)


def shape(n, attack, release, peak=None):
    """Smooth swell envelope: raised-cosine attack to `peak` (fraction), then release."""
    e = np.zeros(n); p = int((peak if peak is not None else attack / (attack + release)) * n)
    e[:p] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, p))
    e[p:] = (0.5 + 0.5 * np.cos(np.linspace(0, np.pi, n - p))) ** 1.5
    return e


def whoosh(dur, f0, f1, peak=0.65, q=1.0, curve=1.0):
    n = int(dur * SR)
    return swept_noise(dur, f0, f1, q, curve) * shape(n, 0, 0, peak)


def place_panned(sig, t0, pan0, pan1, gain=1.0):
    i0 = int(round(t0 * SR)); sig = sig[:N - i0] * gain
    p = np.linspace(pan0, pan1, len(sig))
    L[i0:i0 + len(sig)] += sig * np.sqrt((1 - p) / 2)
    R[i0:i0 + len(sig)] += sig * np.sqrt((1 + p) / 2)


def decay(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


# ---------------------------------------------------------------- 1) smile draw: big swoosh L -> R
sw = whoosh(1.1, 220, 1600, peak=0.6, q=0.8, curve=1.4)
place_panned(sw, SMILE_T0 - 0.08, -0.7, 0.7, 1.3)
# airy top layer
sw2 = whoosh(0.95, 900, 2600, peak=0.65, q=1.2)
place_panned(sw2, SMILE_T0, -0.5, 0.6, 0.25)

# ---------------------------------------------------------------- 2) orb bloom: sub drop + soft impact
n = int(1.6 * SR); tt = np.arange(n) / SR
f = 42 + 60 * np.exp(-tt * 4)
sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * decay(n, 0.45) * np.clip(tt / 0.004, 0, 1)
tt_sub = tt
place(sub * np.clip(tt_sub / 0.03, 0, 1), BLOOM_T, 0, 0.32)
thud = bandpass(rng.standard_normal(int(0.4 * SR)), 80, 900) * decay(int(0.4 * SR), 0.06)
place(signal.sosfilt(signal.butter(2, 300, fs=SR, output='sos'), thud / np.max(np.abs(thud))), BLOOM_T, 0, 0.25)
# sparkle on the flash
n = int(1.2 * SR); tt = np.arange(n) / SR
spark = sum(a * np.sin(2 * np.pi * fr * tt) * decay(n, d) for fr, a, d in
            [(1046.5, .4, .45), (1568, .3, .35), (2093, .12, .25)])
place(spark * np.clip(tt / 0.03, 0, 1), BLOOM_T + 0.02, 0.1, 0.08)

# ---------------------------------------------------------------- 3) orb rises: soft upward riser
rise = whoosh(RISE_T1 - RISE_T0 + 0.2, 200, 1200, peak=0.7, q=1.2, curve=0.8)
place(rise, RISE_T0 - 0.05, 0, 0.5)

# ---------------------------------------------------------------- 4) wordmark: shimmer swell
n = int(1.4 * SR); tt = np.arange(n) / SR
shim = sum(a * np.sin(2 * np.pi * fr * tt + 2 * np.sin(2 * np.pi * 5 * tt)) for fr, a in
           [(659.25, .4), (987.77, .3), (1318.5, .15)]) * shape(n, 0, 0, 0.3)
place(shim, WORD_T - 0.05, -0.2, 0.06)

# ---------------------------------------------------------------- 5) chat bar opens: quick swoosh outward
op = whoosh(0.6, 350, 1800, peak=0.4, q=0.9, curve=0.7)
place_panned(op, PILL_T - 0.08, -0.3, 0.3, 0.9)

# ---------------------------------------------------------------- 6) keyboard clicks (one per character)
def keystroke(pitch=1.0, hard=1.0):
    n = int(0.14 * SR); tt = np.arange(n) / SR
    x = rng.standard_normal(n)
    tap = bandpass(x, 900, 2800) * decay(n, 0.0025)                 # soft fingertip tap
    thock = bandpass(x, 180 * pitch, 900 * pitch) * decay(n, 0.018)   # muted keycap body
    tone = np.sin(2 * np.pi * 640 * pitch * tt) * decay(n, 0.012)    # gentle wooden note
    k = (tap * 0.35 + thock * 1.6 + tone * 0.5) * np.clip(tt / 0.0015, 0, 1)
    k = np.tanh(k / (np.std(k[:int(0.02 * SR)]) * 3)) * hard   # even out random peaks
    return k / np.max(np.abs(k))

for i in range(NCHARS):
    jitter = rng.uniform(-0.004, 0.004)
    place(keystroke(pitch=rng.uniform(0.92, 1.1), hard=rng.uniform(0.85, 1.0)),
          TYPE_T0 + i * TYPE_DT + jitter, pan=-0.25 + 0.05 * i, gain=0.6)

# ---------------------------------------------------------------- 7) send: button click + "sent" swoop + chime
place(keystroke(pitch=0.8, hard=1.0), SEND_T - 0.01, 0.35, 0.5)        # pressing send
n = int(0.32 * SR); tt = np.arange(n) / SR
fsw = 380 * (900 / 380) ** np.clip(tt / 0.14, 0, 1)                      # upward pitch swoop
swoop = np.sin(2 * np.pi * np.cumsum(fsw) / SR)
swoop *= np.clip(tt / 0.02, 0, 1) * decay(n, 0.08)
place(swoop, SEND_T, 0.15, 0.5)
air = whoosh(0.5, 500, 2200, peak=0.35, q=1.0)                              # message floating off
place_panned(air, SEND_T - 0.02, 0.0, 0.7, 0.6)

n = int(2.6 * SR); tt = np.arange(n) / SR
chime = sum(a * np.sin(2 * np.pi * fr * tt) * decay(n, d) for fr, a, d in
            [(783.99, .5, .7), (1567.98, .12, .4), (1174.66, .0, .5)])
chime2 = sum(a * np.sin(2 * np.pi * fr * tt) * decay(n, d) for fr, a, d in [(1046.5, .45, .8), (2093.0, .08, .45)])
chime = (chime + np.concatenate([np.zeros(int(0.11 * SR)), chime2[:n - int(0.11 * SR)]])) * np.clip(tt / 0.012, 0, 1)
CH_T = SEND_T + 0.10
place(chime, CH_T, 0, 0.35)
for d, g, p in [(0.19, .32, -0.6), (0.38, .2, 0.6), (0.57, .11, -0.4)]:  # stereo echo tail
    place(chime, CH_T + d, p, 0.35 * g)
place(sub[:int(0.8 * SR)] * decay(int(0.8 * SR), 0.2) * np.clip(tt_sub[:int(0.8 * SR)] / 0.03, 0, 1), SEND_T, 0, 0.15)   # soft low thump

# ---------------------------------------------------------------- 8) ambient pad bed (quiet, under everything)
pad = np.zeros(N)
for fr, a in [(261.63, .5), (329.63, .35), (392.0, .35), (493.88, .25), (587.33, .2)]:
    pad += a * np.sin(2 * np.pi * fr * t + 3 * np.sin(2 * np.pi * 0.3 * t))
pad = signal.sosfilt(signal.butter(2, 1800, fs=SR, output='sos'), pad)
pad *= np.clip((t - BLOOM_T) / 1.2, 0, 1) ** 1.5 * np.clip((DUR - t) / 0.9, 0, 1)
L += pad * 0.05; R += np.roll(pad, 480) * 0.05

# ---------------------------------------------------------------- master
mx = np.stack([L, R], 1)
mx = signal.sosfilt(signal.butter(2, 30, btype='high', fs=SR, output='sos'), mx, axis=0)
# small soft room: decaying, low-passed noise impulse per channel
ir_n = int(1.2 * SR)
for c in range(2):
    ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / (0.32 * SR))
    ir = signal.sosfilt(signal.butter(2, 3500, fs=SR, output='sos'), ir); ir /= np.sqrt(np.sum(ir ** 2))
    wet = signal.fftconvolve(mx[:, c], ir)[:N]
    mx[:, c] = mx[:, c] * 0.82 + wet * 0.28
# warm top end: gentle low-pass to remove any remaining edge
mx = signal.sosfilt(signal.butter(2, 6500, fs=SR, output='sos'), mx, axis=0)
fade = np.clip((DUR - t) / 0.25, 0, 1)[:, None]   # avoid a click at the very end
mx *= fade
mx[:240] *= np.linspace(0, 1, 240)[:, None]
mx *= 0.85 / np.max(np.abs(mx))
with wave.open(sys.argv[1], 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
    wf.writeframes((mx * 32767).astype('<i2').tobytes())
