from PIL import Image

img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')
data = img.getdata()

# The background color is approximately (242, 239, 230)
# We want to scale these values to (255, 255, 255) to make it pure white
# so that mix-blend-mode: multiply works perfectly.
new_data = []
for r, g, b in data:
    nr = min(255, int(r * 255 / 242))
    ng = min(255, int(g * 255 / 239))
    nb = min(255, int(b * 255 / 230))
    new_data.append((nr, ng, nb))

img.putdata(new_data)
img.save(img_path)
print("Image background leveled to pure white!")
