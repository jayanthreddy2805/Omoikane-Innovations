import os
from PIL import Image

d = '/Users/jay/.gemini/antigravity-ide/brain/60243370-c80d-458e-ac84-10b4c82a9a51/.user_uploaded/'
for f in os.listdir(d):
    if f.endswith(('.png', '.jpg', '.jpeg')):
        try:
            img = Image.open(os.path.join(d, f))
            print(f"{f}: {img.size}")
        except Exception:
            pass
