from PIL import Image

img = Image.open('/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png').convert('L')
pixels = img.load()

# find bounds of the text block starting near 849, 239
min_x, max_x = 10000, 0
min_y, max_y = 10000, 0

for y in range(230, 310):
    for x in range(700, 950):
        if pixels[x, y] < 120:
            min_x = min(min_x, x)
            max_x = max(max_x, x)
            min_y = min(min_y, y)
            max_y = max(max_y, y)

print(f"Bounds: x={min_x}-{max_x}, y={min_y}-{max_y}")
