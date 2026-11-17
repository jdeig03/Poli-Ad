# Original sound design for the group-chat Reel, synced to timeline.json.
# Usage: python3 sound.py timeline.json out.wav
import json, sys, wave
import numpy as np
from scipy import signal

D = json.load(open(sys.argv[1])); T = D['T']; MSG = D['MSG']
SR = 48000; N = int((T['dur'] + 0.3) * SR); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)          # music + effects (gets a little room)
DL = np.zeros(N); DR = np.zeros(N)        # dry bus: keyboard clicks
rng = np.random.default_rng(4)

def put(bufL, bufR, sig, t0, pan=0.0, g=1.0):
    i0 = int(round(t0 * SR))
    if i0 >= N or i0 < 0: return
    sig = sig[:N - i0] * g
    bufL[i0:i0 + len(sig)] += sig * np.sqrt((1 - pan) / 2); bufR[i0:i0 + len(sig)] += sig * np.sqrt((1 + pan) / 2)
place = lambda *a, **k: put(L, R, *a, **k)
dry = lambda *a, **k: put(DL, DR, *a, **k)
bp = lambda x, lo, hi: signal.sosfilt(signal.butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
hp = lambda x, f: signal.sosfilt(signal.butter(2, f, btype='high', fs=SR, output='sos'), x)
lp = lambda x, f: signal.sosfilt(signal.butter(2, f, fs=SR, output='sos'), x)
dec = lambda n, tau: np.exp(-np.arange(n) / (tau * SR))

# ---- iPhone-style key click: very short, dry, pitchless ----
def click(mod=False):
    n = int(0.014 * SR); x = rng.standard_normal(n)
    k = hp(x, 3200 if not mod else 2200) * dec(n, 0.0009 if not mod else 0.0012) * (1 if not mod else .55) + bp(x, 700, 2600) * dec(n, 0.0022) * (.55 if not mod else .9)
    k[:15] *= np.linspace(0, 1, 15); k[-96:] *= np.linspace(1, 0, 96)
    return k / np.max(np.abs(k))
texts = {'ty1': 'hold on', 'ty2': 'are you trying to close the library?', 'ty3': 'no. alex wants it open til 8 on weeknights'}
for key, txt in texts.items():
    for i, tc in enumerate(T[key]):
        dry(click(txt[i] == ' '), tc, rng.uniform(-.05, .05), rng.uniform(.85, 1) * .5)

# ---- message received: a soft, round two-tone "pop" (original) ----
def pop(f=900):
    n = int(0.16 * SR); tt = np.arange(n) / SR
    fr = f * (1 + 0.35 * np.exp(-tt / 0.012))
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * dec(n, 0.035) * np.clip(tt / 0.002, 0, 1)
    s2 = np.sin(2 * np.pi * 1.5 * f * tt) * dec(n, 0.02) * 0.35 * (tt > 0.045)
    return s + s2
# ---- message sent: a short airy upward swoosh ----
def swoosh():
    n = int(0.26 * SR); x = rng.standard_normal(n); y = np.zeros(n); zi = np.zeros((2, 2))
    for s0 in range(0, n, 256):
        fc = 900 * (5200 / 900) ** (s0 / n); sos = signal.butter(2, [fc * .7, fc * 1.4], btype='band', fs=SR, output='sos')
        y[s0:s0 + 256], zi = signal.sosfilt(sos, x[s0:s0 + 256], zi=zi)
    e = np.sin(np.pi * np.arange(n) / n) ** 2
    return y / np.max(np.abs(y)) * e
for kind, who, td, ts, tb in MSG:
    if ts is None or ts < 0: continue
    if kind == 'in': place(pop(rng.choice([820, 880, 940])), ts, rng.uniform(-.15, .15), .16)
    else: place(swoosh(), ts - 0.03, .1, .13)
    if tb: place(pop(1400)[:int(.08 * SR)], tb, .2, .08)
place(swoosh(), T['sendW'] - 0.03, 0, .12)                     # ask sent
place(pop(760), T['wans'][0], 0, .14)                          # answer arrives
for a in (T['push'][0], T['pop'][0]):                           # page push / pop: soft air
    n = int(.35 * SR); place(lp(rng.standard_normal(n), 1800) * np.sin(np.pi * np.arange(n) / n) ** 2, a, 0, .05)

# ---- light background track: warm plucks over a soft pad, F - C - Am - G at 96 bpm ----
bpm = 96; beat = 60 / bpm
chords = [[174.61, 220.0, 261.63], [130.81, 164.81, 196.0], [110.0, 130.81, 164.81], [98.0, 123.47, 146.83]]
end_music = T['end'][0] + 0.2
def pluck(f, d=0.5):
    n = int(d * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt) + .1 * np.sin(6 * np.pi * f * tt)) * dec(n, .14) * np.clip(tt / .004, 0, 1)
b, step = 0, 0
while b * beat < end_music:
    ch = chords[(b // 4) % 4]; tb_ = b * beat
    place(pluck(ch[step % 3] * 2, .6), tb_, -.2 + .2 * (step % 3), .028)
    if b % 2 == 0: place(pluck(ch[(step + 1) % 3] * 4, .4), tb_ + beat / 2, .25, .012)
    if b % 4 == 0:
        n = int(4 * beat * SR); tt = np.arange(n) / SR
        pad = sum(np.sin(2 * np.pi * f * tt) for f in ch) / 3
        place(lp(pad, 1200) * np.clip(tt / .4, 0, 1) * np.clip((4 * beat - tt) / .5, 0, 1), tb_, 0, .024)
        place(pluck(ch[0] / 2, 1.2), tb_, 0, .03)
    b += 1; step += 1
# fade the bed into the end frame, then a warm resolving chime
fade = np.clip((end_music + .6 - t) / .6, 0, 1); L *= fade; R *= fade
for f, dt, g in ((523.25, 0, .09), (659.25, .08, .08), (783.99, .16, .075), (1046.5, .28, .045)):
    n = int(2.2 * SR); tt = np.arange(n) / SR
    place((np.sin(2 * np.pi * f * tt) + .25 * np.sin(4 * np.pi * f * tt)) * dec(n, .55) * np.clip(tt / .006, 0, 1), T['end'][0] + .25 + dt, (dt - .14) * 2, g)

# ---- master ----
mix = np.stack([L, R], 1)
for c in range(2):
    ir = rng.standard_normal(int(.7 * SR)) * np.exp(-np.arange(int(.7 * SR)) / (.16 * SR)); ir = lp(ir, 4500); ir /= np.sqrt(np.sum(ir ** 2))
    mix[:, c] += signal.fftconvolve(mix[:, c], ir)[:N] * .16
mix += np.stack([DL, DR], 1) * 1.1
mix = hp(mix.T, 30).T
mix[-int(.3 * SR):] *= np.linspace(1, 0, int(.3 * SR))[:, None]
mix *= .89 / np.max(np.abs(mix))
pcm = np.ascontiguousarray(np.round(mix * 8388607).astype('<i4'))
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR); w.writeframes(pcm.view(np.uint8).reshape(-1, 4)[:, :3].tobytes())
print('duration', round(N / SR, 2))
