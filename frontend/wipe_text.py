from PIL import Image, ImageDraw

img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')
draw = ImageDraw.Draw(img)

# The coordinates from the SVG mask (in 1672x941 space)
# x="720" y="155" width="175" height="75"
draw.rectangle([715, 150, 900, 240], fill=(255, 255, 255))
img.save(img_path)
print("Text wiped from image!")
