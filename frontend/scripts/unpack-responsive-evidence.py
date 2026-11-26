"""Restore organized screenshots beside RESPONSIVE_QA/index.html."""
from pathlib import Path
from zipfile import ZipFile
import hashlib
import json

root = Path(__file__).resolve().parent.parent / "RESPONSIVE_QA"
manifest = json.loads((root / "capture-archives/manifest.json").read_text())
for entry in manifest:
    archive = root / "capture-archives" / entry["file"]
    if not archive.exists() and entry.get("parts"):
        temporary = archive.with_suffix(".assembling")
        with temporary.open("wb") as output:
            for part in entry["parts"]:
                data = (archive.parent / part["file"]).read_bytes()
                if hashlib.sha256(data).hexdigest() != part["sha256"]:
                    raise ValueError(f"Archive part checksum mismatch: {part['file']}")
                output.write(data)
        temporary.replace(archive)
    if hashlib.sha256(archive.read_bytes()).hexdigest() != entry["sha256"]:
        raise ValueError(f"Archive checksum mismatch: {archive.name}")
    with ZipFile(archive) as bundle:
        for member in bundle.infolist():
            if not (root / member.filename).resolve().is_relative_to(root):
                raise ValueError("Archive path outside evidence folder")
        bundle.extractall(root)
print(f"Restored {sum(item['screenshots'] for item in manifest)} screenshots.")
