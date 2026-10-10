from PIL import Image
img = Image.open('/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png').convert('RGB')
print(img.getpixel((710, 150)))
