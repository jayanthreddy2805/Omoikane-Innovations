from PIL import Image

# Re-open the originally uploaded image before any leveling if possible, 
# or just the current image if we don't have the original.
# Wait, leveling changed the colors. But copying a patch will still match!
img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')

# Region to copy (above the text)
# Text is roughly x=720..900, y=155..230 (width 180, height 75)
# Let's copy from y=75 to y=150
box_to_copy = (720, 75, 900, 150)
patch = img.crop(box_to_copy)

# Paste over the text
img.paste(patch, (720, 155))

img.save('/Users/jay/Desktop/Omoikane/frontend/public/images/patched_test.png')
print("Patched!")
