# Sound for the group-chat Reel, built from the client's own iPhone screen recording (see sfx/README.txt):
# real keyboard clicks, the real "sent" sound, and "received" = the sent sound reversed.
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
    return x / np.max(np.abs(x))
KEYS = [load(f'iphone_key_{k:02d}') for k in range(13)]
SENT, RECV = load('iphone_send'), load('iphone_receive')
SENT_PEAK = np.argmax(np.abs(SENT)) / SR            # where the sent sound hits hardest
RECV_PEAK = np.argmax(np.abs(RECV)) / SR            # reversed: the hit is near the end

def put(sig, t0, g=1.0):
    i0 = int(round(t0 * SR))
    if i0 < 0: sig = sig[-i0:]; i0 = 0
    if i0 >= N: return
    sig = sig[:N - i0] * g; L[i0:i0 + len(sig)] += sig; R[i0:i0 + len(sig)] += sig

# keyboard: a different real click for each keypress, so it never sounds looped
for key in ('ty1', 'ty2', 'ty3'):
    for tc in T[key]:
        put(KEYS[rng.integers(len(KEYS))], tc - 0.004, rng.uniform(0.85, 1.0) * 0.1)
# messages: the sent sound when you send; the reversed sound peaks as an incoming bubble lands
for kind, who, td, ts, tb in MSG:
    if ts is None or ts < 0: continue
    if kind == 'in': put(RECV, ts - RECV_PEAK + 0.03, 0.85)
    else: put(SENT, ts - SENT_PEAK, 1.0)

mix = np.stack([L, R], 1)
mix *= 0.71 / np.max(np.abs(mix))                                  # peaks at -3 dBFS
pcm = np.ascontiguousarray(np.round(mix * 8388607).astype('<i4'))
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR); w.writeframes(pcm.view(np.uint8).reshape(-1, 4)[:, :3].tobytes())
print('duration', round(N / SR, 2), '| sent peak at', round(SENT_PEAK, 3), 's, received peak at', round(RECV_PEAK, 3), 's')
