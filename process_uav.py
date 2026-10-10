import os
from PIL import Image, ImageFilter

def process_uav(input_path):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        return
        
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    red_data = []
    dark_data = []
    base_data = []
    
    # 1. Separate colors
    for item in data:
        r, g, b, a = item
        if a == 0:
            red_data.append((0,0,0,0))
            dark_data.append((0,0,0,0))
            base_data.append((0,0,0,0))
            continue
            
        # Is it red?
        if r > 150 and g < 100 and b < 100:
            red_data.append(item)
            dark_data.append((0,0,0,0))
            base_data.append((0,0,0,0)) # Or keep in base? The prompt says red reveals later.
        else:
            red_data.append((0,0,0,0))
            dark_data.append(item)
            # Make the base very faint/transparent to simulate unfilled line art
            base_data.append((r, g, b, int(a * 0.25)))

    # Save Red Layer
    red_img = Image.new("RGBA", img.size)
    red_img.putdata(red_data)
    red_img.save("frontend/public/images/leadership/uav-red-fill.png")
    
    # Save Dark Fill Layer
    dark_img = Image.new("RGBA", img.size)
    dark_img.putdata(dark_data)
    dark_img.save("frontend/public/images/leadership/uav-dark-fill.png")
    
    # Save Base Layer (just faint version of dark for now)
    base_img = Image.new("RGBA", img.size)
    base_img.putdata(base_data)
    base_img.save("frontend/public/images/leadership/uav-base.png")

    print("Created uav-red-fill.png, uav-dark-fill.png, uav-base.png")

process_uav("frontend/public/images/leadership/123-transparent.png")
