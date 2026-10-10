from PIL import Image
try:
    img = Image.open('frontend/public/images/leadership/123.png').convert('RGB')
    color = img.getpixel((0, 0))
    print(f"Top-left pixel color: #{color[0]:02x}{color[1]:02x}{color[2]:02x}")
except Exception as e:
    print(e)
