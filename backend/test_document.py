from app.services.document_service import extract_text

file_path = "sample-local-pdf.pdf"

text = extract_text(file_path)

print(text[:2000])