from PIL import Image

img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')
data = img.getdata()

# We want to bake in the multiplication with #F4F3EE (244, 243, 238)
# Current background is (255, 255, 255)
# New pixel = pixel * (color / 255)
new_data = []
for r, g, b in data:
    nr = int(r * 244 / 255)
    ng = int(g * 243 / 255)
    nb = int(b * 238 / 255)
    new_data.append((nr, ng, nb))

img.putdata(new_data)
img.save(img_path)
print("Image background baked to #F4F3EE!")
