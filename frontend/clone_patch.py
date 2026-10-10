from PIL import Image

# Use the original image before I painted the white block!
img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')

# The text box is roughly x: 715->900, y: 150->240
# We want to copy a patch of the same size from just above it.
box = (715, 60, 900, 150)
patch = img.crop(box)

# Paste the patch over the text
img.paste(patch, (715, 150))

# Save over the -v2 image so cache is busted
img.save('/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero-v2.png')
print("Patched image!")
