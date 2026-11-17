# iPhone-style sound for the group-chat Reel, synced to timeline.json. No music, no reverb:
# only what a phone actually makes in this scene (key clicks, message sent, message received).
# All sounds are original syntheses, not Apple's audio. Usage: python3 sound.py timeline.json out.wav
import json, sys, wave
import numpy as np
from scipy import signal

D = json.load(open(sys.argv[1])); T = D['T']; MSG = D['MSG']
SR = 48000; N = int((T['dur'] + 0.3) * SR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(4)

def put(sig, t0, pan=0.0, g=1.0):
    i0 = int(round(t0 * SR))
    if i0 < 0 or i0 >= N: return
    sig = sig[:N - i0] * g
    L[i0:i0 + len(sig)] += sig * np.sqrt((1 - pan) / 2); R[i0:i0 + len(sig)] += sig * np.sqrt((1 + pan) / 2)
bp = lambda x, lo, hi: signal.sosfilt(signal.butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
hp = lambda x, f: signal.sosfilt(signal.butter(2, f, btype='high', fs=SR, output='sos'), x)
dec = lambda n, tau: np.exp(-np.arange(n) / (tau * SR))
def edges(s, a=0.0015, r=0.004):
    na, nr = max(1, int(a * SR)), max(1, int(r * SR)); s[:na] *= np.linspace(0, 1, na); s[-nr:] *= np.linspace(1, 0, nr); return s

# ---- keyboard: tiny, dry, pitchless tick (space bar a little duller) ----
def click(space=False):
    n = int(0.012 * SR); x = rng.standard_normal(n)
    k = hp(x, 3000 if not space else 1800) * dec(n, 0.0008 if not space else 0.0011) + bp(x, 900, 3200) * dec(n, 0.0018) * (0.5 if not space else 0.8)
    return edges(k / np.max(np.abs(k)), 0.0003, 0.002)
texts = {'ty1': 'hold on', 'ty2': 'are you trying to close the library?', 'ty3': 'no. alex wants it open til 8 on weeknights'}
for key, txt in texts.items():
    for i, tc in enumerate(T[key]):
        put(click(txt[i] == ' '), tc, 0, rng.uniform(0.85, 1.0) * 0.75)

# ---- message sent: a quick, clean upward swoop ----
def sent():
    n = int(0.17 * SR); tt = np.arange(n) / SR
    f = 520 * (1700 / 520) ** np.clip(tt / 0.11, 0, 1)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.clip(tt / 0.006, 0, 1) * np.exp(-np.clip(tt - 0.07, 0, None) / 0.03)
    air = bp(rng.standard_normal(n), 2500, 7000) * np.sin(np.pi * np.clip(tt / 0.12, 0, 1)) * 0.12
    return edges(s * 0.9 + air)

# ---- message received (chat open): a soft, short two-step bloop ----
def received():
    n = int(0.16 * SR); tt = np.arange(n) / SR
    a = np.sin(2 * np.pi * 1320 * tt) * np.clip(tt / 0.003, 0, 1) * np.exp(-tt / 0.018) * (tt < 0.05)
    t2 = np.clip(tt - 0.055, 0, None)
    b = np.sin(2 * np.pi * 990 * t2) * np.clip(t2 / 0.003, 0, 1) * np.exp(-t2 / 0.03) * (tt >= 0.055)
    return edges(a * 0.7 + b)

# ---- tapback: a tiny soft tick ----
def tapback():
    n = int(0.06 * SR); tt = np.arange(n) / SR
    return edges(np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt / 0.012) * np.clip(tt / 0.002, 0, 1))

for kind, who, td, ts, tb in MSG:
    if ts is None or ts < 0: continue
    if kind == 'in': put(received(), ts, 0, 0.42)
    else: put(sent(), ts - 0.02, 0, 0.38)
    if tb: put(tapback(), tb, 0, 0.2)

# ---- master: dry, gentle level (a phone speaker, not a commercial) ----
mix = np.stack([L, R], 1)
mix = hp(mix.T, 60).T
mix *= 0.71 / np.max(np.abs(mix))                      # peaks at -3 dBFS
pcm = np.ascontiguousarray(np.round(mix * 8388607).astype('<i4'))
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR); w.writeframes(pcm.view(np.uint8).reshape(-1, 4)[:, :3].tobytes())
print('duration', round(N / SR, 2))
