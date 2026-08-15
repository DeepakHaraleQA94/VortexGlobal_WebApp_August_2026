import sys
from collections import deque
import urllib.request
from PIL import Image

URL = "https://static.prod-images.emergentagent.com/jobs/046a707f-bb66-4f03-9e0d-daa2b6f97828/images/743354d5f299a6229280ffa81a16f7600473cf1fddc6aec969bd17135e9c0928.jpeg"
OUT = "/app/frontend/public/vortex-emblem.png"

fn, _ = urllib.request.urlretrieve(URL)
img = Image.open(fn).convert("RGBA")
W, H = img.size
# crop the top emblem region (exclude wordmark)
crop = img.crop((int(W*0.13), int(H*0.03), int(W*0.87), int(H*0.57)))
crop = crop.convert("RGBA")
cw, ch = crop.size
px = crop.load()

def is_white(p):
    return p[0] > 238 and p[1] > 238 and p[2] > 238

# flood fill from borders to remove connected white background only
visited = [[False]*cw for _ in range(ch)]
q = deque()
for x in range(cw):
    for y in (0, ch-1):
        q.append((x, y))
for y in range(ch):
    for x in (0, cw-1):
        q.append((x, y))
while q:
    x, y = q.popleft()
    if x < 0 or y < 0 or x >= cw or y >= ch or visited[y][x]:
        continue
    visited[y][x] = True
    p = px[x, y]
    if is_white(p):
        px[x, y] = (p[0], p[1], p[2], 0)
        q.append((x+1, y)); q.append((x-1, y)); q.append((x, y+1)); q.append((x, y-1))

# autocrop to non-transparent bbox
bbox = crop.getbbox()
if bbox:
    crop = crop.crop(bbox)
crop.save(OUT)
print("saved", OUT, crop.size)
