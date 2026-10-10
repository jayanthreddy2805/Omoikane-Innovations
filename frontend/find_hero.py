import os
from PIL import Image
import glob

artifact_dir = "/Users/jay/.gemini/antigravity-ide/brain/60243370-c80d-458e-ac84-10b4c82a9a51/.user_uploaded"
for f in glob.glob(os.path.join(artifact_dir, "*")):
    if f.lower().endswith(('.png', '.jpg', '.jpeg')):
        try:
            img = Image.open(f)
            if img.size == (1672, 941) or "engineering" in f.lower():
                print(f"Found match: {f} with size {img.size}")
        except Exception as e:
            pass

