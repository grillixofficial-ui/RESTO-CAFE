import zipfile, xml.etree.ElementTree as ET, os

docx_path = r'c:\Users\mnith\Downloads\POS.docx'

with zipfile.ZipFile(docx_path) as z:
    print('=== Files in DOCX ===')
    for f in z.namelist():
        print(f)
    
    # Try to read document.xml
    if 'word/document.xml' in z.namelist():
        tree = ET.parse(z.open('word/document.xml'))
        root = tree.getroot()
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        texts = []
        for t in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
            if t.text:
                texts.append(t.text)
        print('\n=== Text content ===')
        print('\n'.join(texts) if texts else 'No text found')
    
    # Check for images
    images = [f for f in z.namelist() if f.startswith('word/media/')]
    print(f'\n=== Images found: {len(images)} ===')
    for img in images:
        print(img)
    
    # Check for headers/footers
    headers = [f for f in z.namelist() if 'header' in f or 'footer' in f]
    print(f'\n=== Headers/Footers: {len(headers)} ===')
    for h in headers:
        print(h)