from PIL import Image

img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')
pixels = img.load()

# Box around the text
x1, y1 = 715, 150
x2, y2 = 900, 240

# We consider a pixel "text" if it's darker than 180 in all channels
for x in range(x1, x2):
    for y in range(y1, y2):
        r, g, b = pixels[x, y]
        if r < 180 and g < 180 and b < 180:
            # It's a text pixel. Scan upwards to find a replacement background pixel.
            replacement = (242, 239, 230) # fallback
            for search_y in range(y - 1, y - 30, -1):
                sr, sg, sb = pixels[x, search_y]
                if sr > 200 and sg > 200 and sb > 200:
                    replacement = (sr, sg, sb)
                    break
            pixels[x, y] = replacement

img.save(img_path)
print("Smart text removal complete!")
