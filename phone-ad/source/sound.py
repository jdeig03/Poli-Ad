# Sound design for the phone section, synced to timeline.json, then the end card's own audio
# from its 1.45 s hand-off point. Usage: python3 sound.py timeline.json endcard.wav out.wav
import json, sys, wave
import numpy as np
from scipy import signal

T = json.load(open(sys.argv[1]))
SR = 48000
EC_IN = 1.45                                   # end card time at the hand-off frame
ec = wave.open(sys.argv[2], 'rb'); ecn = ec.getnframes(); raw = ec.readframes(ecn); sw = ec.getsampwidth(); ec.close()
b = np.frombuffer(raw, np.uint8).reshape(-1, sw)
if sw == 3: pcm = (b[:, 0].astype(np.int32) | (b[:, 1].astype(np.int32) << 8) | (b[:, 2].astype(np.int32) << 16)); pcm = np.where(pcm & 0x800000, pcm - 0x1000000, pcm) / 8388608.0
else: pcm = np.frombuffer(raw, '<i2') / 32768.0
EC = pcm.reshape(-1, 2)
DUR = T['end'] + (len(EC) / SR - EC_IN)
N = int(DUR * SR); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(5)

def place(sig, t0, pan=0.0, gain=1.0):
    i0 = int(round(t0 * SR))
    if i0 >= N: return
    if i0 < 0: sig = sig[-i0:]; i0 = 0
    sig = sig[:N - i0] * gain
    L[i0:i0 + len(sig)] += sig * np.sqrt((1 - pan) / 2); R[i0:i0 + len(sig)] += sig * np.sqrt((1 + pan) / 2)
def bp(x, lo, hi): return signal.sosfilt(signal.butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, f): return signal.sosfilt(signal.butter(2, f, fs=SR, output='sos'), x)
def dec(n, tau): return np.exp(-np.arange(n) / (tau * SR))
def tone(f, d, tau, a=0.004):
    n = int(d * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * f * tt) * dec(n, tau) * np.clip(tt / a, 0, 1)

# ---- iPhone-style soft key tick (original synthesis) ----
def tick(p=1.0):
    n = int(0.05 * SR); x = rng.standard_normal(n)
    k = bp(x, 1800 * p, 6000) * dec(n, 0.0016) * 0.6 + tone(1150 * p, 0.05, 0.006, 0.0005) * 0.5 + bp(x, 300, 1200) * dec(n, 0.004) * 0.5
    return k / np.max(np.abs(k))
for key in ('ty1', 'ty2', 'ty3'):
    for i, tc in enumerate(T[key]):
        place(tick(rng.uniform(0.94, 1.06)), tc, pan=rng.uniform(-0.15, 0.15), gain=0.42)
for g in ('go1', 'go2', 'send'):
    place(tick(0.8), T[g], 0.1, 0.5)

# ---- soft taps on the address bar / input (finger on glass) ----
for k in ('tap1', 'tap2', 'tap3'):
    n = int(0.06 * SR); place(lp(rng.standard_normal(n), 900) * dec(n, 0.008) * 3, T[k], 0, 0.12)

# ---- page loads: a soft airy settle ----
def swish(d, f0, f1, g):
    n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n); zi = np.zeros((2, 2))
    for s0 in range(0, n, 256):
        fc = f0 * (f1 / f0) ** (s0 / n)
        sos = signal.butter(2, [fc * 0.7, fc * 1.4], btype='band', fs=SR, output='sos')
        y[s0:s0 + 256], zi = signal.sosfilt(sos, x[s0:s0 + 256], zi=zi)
    e = np.sin(np.pi * np.arange(n) / n) ** 2
    return y / np.max(np.abs(y)) * e * g
place(swish(0.45, 500, 1600, 0.12), T['serp'] - 0.15)
place(swish(0.45, 500, 1600, 0.12), T['site'] - 0.15)

# ---- the confusion beat: a muted, unresolved two-note "hmm" as the conflict appears ----
for f, dt in ((392.0, 0.0), (370.0, 0.22)):
    s = tone(f, 1.2, 0.35, 0.03) + 0.4 * tone(f * 2, 1.2, 0.2, 0.03)
    place(lp(s, 1800), T['hl'] + dt, -0.1, 0.11)

# ---- music bed: a calm pad, unresolved during the search, resolving when Poli answers ----
def pad(freqs, t0, t1, g, fade=0.6):
    n = int((t1 - t0) * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs: s += np.sin(2 * np.pi * f * tt + 2 * np.sin(2 * np.pi * 0.25 * tt)) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)
    s = lp(s, 1400) / len(freqs)
    e = np.clip(tt / fade, 0, 1) * np.clip((t1 - t0 - tt) / fade, 0, 1)
    place(s * e, t0, 0, g)
pad([220.0, 261.63, 329.63], 0.0, T['site'] + 0.4, 0.05)                 # A minor: searching
pad([174.61, 220.0, 261.63, 392.0], T['site'] - 0.2, T['stream'][0] + 0.4, 0.05)   # F add9: hope
pad([261.63, 329.63, 392.0, 493.88], T['stream'][0], T['end'] + 0.6, 0.06)          # C maj7: resolved

# ---- send: an original soft "whoop" ----
n = int(0.28 * SR); tt = np.arange(n) / SR; f = 420 * (880 / 420) ** np.clip(tt / 0.12, 0, 1)
place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.clip(tt / 0.01, 0, 1) * dec(n, 0.06), T['send'] + 0.05, 0.1, 0.16)
place(swish(0.35, 900, 2600, 0.08), T['send'] + 0.03, 0.2)

# ---- success: a warm rising chime with the badge and rings ----
for f, dt, g in ((523.25, 0.0, 0.09), (659.25, 0.09, 0.08), (783.99, 0.18, 0.075), (1046.5, 0.3, 0.045)):
    place(tone(f, 1.8, 0.5, 0.006) + 0.25 * tone(f * 2, 1.8, 0.25, 0.006), T['ok'] + dt, (dt - 0.15) * 2, g)

# ---- transition: a smooth rising swell carrying us into the end card ----
place(swish(1.1, 250, 2200, 0.16), T['fly'][0])
n = int(1.0 * SR); tt = np.arange(n) / SR
place(np.sin(2 * np.pi * np.cumsum(60 + 30 * tt) / SR) * np.sin(np.pi * tt / 1.0) ** 2, T['fly'][0] + 0.1, 0, 0.12)

# ---- master the phone section, then lay the end card audio from its hand-off point ----
mix = np.stack([L, R], 1)
rev = np.zeros_like(mix)
for c in range(2):
    ir = rng.standard_normal(int(0.9 * SR)) * np.exp(-np.arange(int(0.9 * SR)) / (0.22 * SR)); ir = lp(ir, 4000); ir /= np.sqrt(np.sum(ir ** 2))
    rev[:, c] = signal.fftconvolve(mix[:, c], ir)[:N]
mix = mix + rev * 0.22
mix = signal.sosfilt(signal.butter(2, 30, btype='high', fs=SR, output='sos'), mix, axis=0)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.6) / np.tanh(1.6) * 0.82   # gentle limiting, near the end card's level
pre = 0.3                                              # end card audio fades in during the cross-fade
s0 = int((EC_IN - pre) * SR); seg = EC[s0:].copy()
seg[:int(pre * SR)] *= np.linspace(0, 1, int(pre * SR))[:, None]
i0 = int((T['end'] - pre) * SR); m = min(len(seg), N - i0)
mix[i0:i0 + m] += seg[:m] * 0.95
mix[-int(0.25 * SR):] *= np.linspace(1, 0, int(0.25 * SR))[:, None]
mix *= 0.89 / np.max(np.abs(mix))
pcm = np.ascontiguousarray(np.round(mix * 8388607).astype('<i4'))
with wave.open(sys.argv[3], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR); w.writeframes(pcm.view(np.uint8).reshape(-1, 4)[:, :3].tobytes())
print('duration', round(DUR, 3))
