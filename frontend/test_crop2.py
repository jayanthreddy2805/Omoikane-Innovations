from PIL import Image, ImageDraw
img = Image.open('/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png').convert('RGB')
draw = ImageDraw.Draw(img)
draw.rectangle([760, 180, 890, 230], outline="blue", width=3)
img.save('/Users/jay/Desktop/Omoikane/frontend/public/images/test_mask2.png')
