from PIL import Image, ImageDraw

img = Image.open('/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png').convert('RGB')
draw = ImageDraw.Draw(img)
# Draw a red rectangle over the proposed area
draw.rectangle([720, 220, 960, 320], outline="red", width=3)
img.save('/Users/jay/Desktop/Omoikane/frontend/public/images/test_mask.png')
