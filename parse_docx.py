from docx import Document

doc = Document('C:/Users/mnith/Downloads/floor.docx')

print("=== PARAGRAPHS ===")
for p in doc.paragraphs:
    if p.text.strip():
        print(p.text)

print("=== TABLES ===")
print(f"Number of tables: {len(doc.tables)}")
for i, table in enumerate(doc.tables):
    print(f"--- Table {i+1} ---")
    for row in table.rows:
        cells = [cell.text for cell in row.cells]
        print(" | ".join(cells))

print("=== IMAGES ===")
print(f"Number of inline shapes: {len(doc.inline_shapes)}")
print(f"Number of drawings/embedded images: {len(doc.part.related_parts) if hasattr(doc, 'part') else 'N/A'}")

# Also try to find embedded images/blobs
import zipfile
import os

with zipfile.ZipFile('C:/Users/mnith/Downloads/floor.docx', 'r') as z:
    media_files = [f for f in z.namelist() if f.startswith('word/media/')]
    print(f"Media files in docx: {media_files}")
    # Extract first image if exists
    for mf in media_files[:1]:
        z.extract(mf, 'extracted_media')
        print(f"Extracted: {mf}")