from PIL import Image

img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')
# Check the center of the drone to see if it's too bright
print("Center pixel:", img.getpixel((800, 400)))
