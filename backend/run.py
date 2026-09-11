import os
import sys
import uvicorn

# Ensure the backend directory is in the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    from app.core.config import settings
    print("=" * 60)
    print(" Starting Pincher AI Wardrobe Intelligence Backend")
    print(f" URL:  http://localhost:{settings.PORT}")
    print(f" Docs: http://localhost:{settings.PORT}/docs")
    print("=" * 60)
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
