# Sound for the group-chat Reel, built from real sound-effect files (uisfx, CC0, see sfx/README.txt).
# Only what a phone makes in this scene: key clicks, message sent, message received, tapbacks.
# No music, no reverb. Usage: python3 sound.py timeline.json out.wav
import json, sys, wave, os
import numpy as np

D = json.load(open(sys.argv[1])); T = D['T']; MSG = D['MSG']
SR = 48000; N = int((T['dur'] + 0.3) * SR)
HERE = os.path.dirname(os.path.abspath(__file__))
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(4)

def load(name):
    w = wave.open(os.path.join(HERE, 'sfx', name + '.wav')); x = np.frombuffer(w.readframes(w.getnframes()), '<i2') / 32768.0; w.close()
    a = np.abs(x); on = np.where(a > a.max() * 0.01)[0]          # trim leading silence so sounds land on the frame
    x = x[max(0, on[0] - 24):]
    return x / np.max(np.abs(x))
KEY, SPACE, SENT, RECV, TAP = (load(n) for n in ('studio_typing', 'rubber_typing', 'studio_send', 'studio_receive', 'studio_reaction'))

def put(sig, t0, g=1.0):
    i0 = int(round(t0 * SR))
    if i0 < 0 or i0 >= N: return
    sig = sig[:N - i0] * g; L[i0:i0 + len(sig)] += sig; R[i0:i0 + len(sig)] += sig

texts = {'ty1': 'hold on', 'ty2': 'are you trying to close the library?', 'ty3': 'no. alex wants it open til 8 on weeknights'}
for key, txt in texts.items():
    for i, tc in enumerate(T[key]):
        put(SPACE if txt[i] == ' ' else KEY, tc, rng.uniform(0.8, 1.0) * 0.5)
for kind, who, td, ts, tb in MSG:
    if ts is None or ts < 0: continue
    put(RECV if kind == 'in' else SENT, ts - (0 if kind == 'in' else 0.02), 0.6 if kind == 'in' else 0.55)
    if tb: put(TAP, tb, 0.35)

mix = np.stack([L, R], 1)
mix *= 0.71 / np.max(np.abs(mix))                                  # peaks at -3 dBFS
pcm = np.ascontiguousarray(np.round(mix * 8388607).astype('<i4'))
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR); w.writeframes(pcm.view(np.uint8).reshape(-1, 4)[:, :3].tobytes())
print('duration', round(N / SR, 2))
