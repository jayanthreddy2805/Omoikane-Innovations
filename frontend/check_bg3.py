from PIL import Image

img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')
print("Top left pixel:", img.getpixel((0, 0)))
