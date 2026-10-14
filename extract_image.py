import zipfile

docx_path = r'c:\Users\mnith\Downloads\POS.docx'
output_path = r'c:\Thilaga\pos_layout.jpeg'

with zipfile.ZipFile(docx_path) as z:
    data = z.read('word/media/image1.jpeg')
    with open(output_path, 'wb') as f:
        f.write(data)
    print(f'Extracted {len(data)} bytes to {output_path}')