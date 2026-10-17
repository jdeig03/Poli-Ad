# Synthesizes the end-card sound design (48 kHz stereo WAV), synced to endcard.html timings.
import numpy as np, wave, sys
SR, DUR = 48000, 6.0
N = int(SR * DUR); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)

def env(t0, a, d, n):
    e = np.zeros(n); i0 = int(t0 * SR)
    ia, idd = int(a * SR), int(d * SR)
    seg = np.concatenate([np.linspace(0, 1, max(ia, 1)) ** 2, np.exp(-np.linspace(0, 11, max(idd, 1)))])
    e[i0:i0 + len(seg)] = seg[:max(0, n - i0)]
    return e

def lowpass(x, a):  # one-pole
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y

def add(sig, pan=0.0, g=1.0):
    global L, R
    L += sig * g * np.sqrt((1 - pan) / 2); R += sig * g * np.sqrt((1 + pan) / 2)

# 1) rising whoosh while the smile draws (pans left -> right like the blue -> red stroke)
noise = rng.standard_normal(N)
w_env = np.clip((t - 0.05) / 0.75, 0, 1) ** 2 * np.exp(-np.clip(t - 0.8, 0, None) * 9) * (t < 2.2)
cut = 0.02 + 0.25 * np.clip((t - 0.05) / 0.75, 0, 1)
y = np.zeros(N); s = 0.0
for i in range(int(2.2 * SR)): s += cut[i] * (noise[i] - s); y[i] = s
pan = np.clip((t - 0.12) / 0.7, 0, 1) * 1.6 - 0.8
sw = np.sin(2 * np.pi * np.cumsum(220 + 500 * np.clip((t - 0.1) / 0.7, 0, 1) ** 2) / SR) * 0.15
sig = (y * 2.2 + sw) * w_env
L += sig * np.sqrt((1 - pan) / 2) * 0.5; R += sig * np.sqrt((1 + pan) / 2) * 0.5

# 2) bloom: sub drop + soft impact at 0.80s
ib = t - 0.80; m = ib >= 0
sub = np.zeros(N); f = 70 * np.exp(-np.clip(ib, 0, None) * 3) + 42
sub[m] = np.sin(2 * np.pi * np.cumsum(f[m]) / SR) * np.exp(-ib[m] * 2.6)
add(sub, 0, 0.55)
add(lowpass(noise * env(0.80, 0.004, 0.25, N), 0.15), 0, 0.5)

# 3) shimmer pad (Cmaj9-ish, airy) from bloom to end
pad = np.zeros(N)
for fr, a in [(261.63, .5), (329.63, .35), (392.0, .35), (493.88, .25), (587.33, .2), (1046.5, .07)]:
    pad += a * np.sin(2 * np.pi * fr * t + 3 * np.sin(2 * np.pi * 0.3 * t)) * (1 + 0.3 * np.sin(2 * np.pi * (0.5 + fr / 2000) * t))
pad_env = np.clip((t - 0.8) / 1.2, 0, 1) ** 1.5 * np.clip((DUR - t) / 0.9, 0, 1)
pad = lowpass(pad, 0.12) * pad_env
add(pad, -0.25, 0.12); add(np.roll(pad, 480), 0.25, 0.12)

# 4) wordmark swell 1.72s and pill swoosh 2.22s
for t0, g, c in [(1.72, .22, .05), (2.22, .18, .12)]:
    e = env(t0, 0.18, 0.4, N)
    add(lowpass(noise * e, c) * 3, 0, g)

# 5) typing ticks (10 chars from 2.72s, 72ms apart)
for i in range(10):
    t0 = 2.72 + i * 0.072
    e = env(t0, 0.0008, 0.018, N)
    tick = noise * e + np.sin(2 * np.pi * (2200 + 150 * (i % 3)) * t) * e * 0.6
    add(tick, -0.3 + 0.06 * i, 0.16)

# 6) send chime at 3.58s — bright bell partials + echo tail
ic = t - 3.58; m = ic >= 0
chime = np.zeros(N)
for fr, a, dk in [(1046.5, .5, 2.2), (1568.0, .35, 2.8), (2093.0, .25, 3.5), (2637.0, .12, 4.5), (523.25, .3, 1.6)]:
    chime[m] += a * np.sin(2 * np.pi * fr * ic[m]) * np.exp(-ic[m] * dk) * np.clip(ic[m] / 0.004, 0, 1)
for d, g, p in [(0.19, .35, -0.6), (0.38, .22, 0.6), (0.57, .12, -0.4)]:
    add(np.roll(chime, int(d * SR)) * (t > 3.58 + d), p, g * 0.5)
add(chime, 0, 0.5)
add(sub * 0 + np.roll(sub, int(2.78 * SR)) * (t > 3.58), 0, 0.25)  # soft low thump under the chime

# master: fade-in guard, soft clip, normalize to -1 dBFS
for ch in (L, R):
    ch[:240] *= np.linspace(0, 1, 240)
mx = np.stack([L, R], 1)
mx = np.tanh(mx * 1.2)
mx *= 0.89 / np.max(np.abs(mx))
out = (mx * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes(out.tobytes())
