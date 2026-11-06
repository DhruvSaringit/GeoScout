import sys
import base64
import io
from PIL import Image

def resize_b64(b64_str, max_dim=1536):
    try:
        header = ""
        if "," in b64_str:
            header, b64_str = b64_str.split(",", 1)
            header += ","
            
        img_bytes = base64.b64decode(b64_str)
        im = Image.open(io.BytesIO(img_bytes))
        
        w, h = im.size
        if w <= max_dim and h <= max_dim:
            return header + b64_str
            
        im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGB")
            header = "data:image/jpeg;base64,"
            
        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=85)
        new_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        return header + new_b64
    except Exception as e:
        sys.stderr.write(f"Resize error: {e}\n")
        return b64_str

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            content = f.read()
        output = resize_b64(content)
        with open(sys.argv[1], "w", encoding="utf-8") as f:
            f.write(output)

