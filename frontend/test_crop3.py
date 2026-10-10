from PIL import Image, ImageDraw
img = Image.open('/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png').convert('RGB')
draw = ImageDraw.Draw(img)
draw.rectangle([720, 160, 890, 220], outline="green", width=3)
img.save('/Users/jay/Desktop/Omoikane/frontend/public/images/test_mask3.png')
