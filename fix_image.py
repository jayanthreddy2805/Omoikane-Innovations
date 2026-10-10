from PIL import Image

def make_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # The background is roughly #f1f0e8 (241, 240, 232)
    # We will make anything close to this transparent.
    # To be safe, anything brighter than 220, 220, 220
    for item in datas:
        # Check if pixel is close to the off-white background
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            newData.append((255, 255, 255, 0)) # Make transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

make_transparent("frontend/public/images/leadership/123.png", "frontend/public/images/leadership/123-transparent.png")
print("Done creating transparent image.")
