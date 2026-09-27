import sys
import os

# Ensure the 'server' directory is on Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
server_dir = os.path.join(current_dir, "server")
if os.path.exists(server_dir) and server_dir not in sys.path:
    sys.path.insert(0, server_dir)

# Import the FastAPI application instance from server/main.py
from server.main import app

# Expose app for ASGI servers like uvicorn
__all__ = ["app"]

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
