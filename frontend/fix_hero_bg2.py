from PIL import Image

img_path = '/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png'
img = Image.open(img_path).convert('RGB')
data = list(img.getdata())

# Let's sample a few pixels from the top left corner to find the "base" background color
samples = [img.getpixel((x, y)) for x in range(10, 50, 10) for y in range(10, 50, 10)]
avg_r = sum(s[0] for s in samples) / len(samples)
avg_g = sum(s[1] for s in samples) / len(samples)
avg_b = sum(s[2] for s in samples) / len(samples)

print(f"Detected background: {avg_r}, {avg_g}, {avg_b}")

# Scale so the average background becomes 255
new_data = []
for r, g, b in data:
    nr = min(255, int(r * 255 / avg_r))
    ng = min(255, int(g * 255 / avg_g))
    nb = min(255, int(b * 255 / avg_b))
    new_data.append((nr, ng, nb))

img.putdata(new_data)
img.save(img_path)
print("Image background leveled to pure white!")
