import pytesseract
from PIL import Image

img = Image.open('/Users/jay/Desktop/Omoikane/frontend/public/images/omoikane-engineering-hero.png')
data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

for i in range(len(data['text'])):
    if 'SCIENCE' in data['text'][i].upper():
        print(f"Found SCIENCE at x={data['left'][i]}, y={data['top'][i]}, w={data['width'][i]}, h={data['height'][i]}")
    if '1334005' in data['text'][i]:
        print(f"Found 1334005 at x={data['left'][i]}, y={data['top'][i]}, w={data['width'][i]}, h={data['height'][i]}")

