"""Serve an exported Expo web build with headers required by expo-sqlite."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'dist'
if not (ROOT / 'index.html').exists():
    raise SystemExit('Run npx expo export --platform web first.')

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'credentialless')
        super().end_headers()

print('Open http://127.0.0.1:8090/ (Ctrl+C to stop)', flush=True)
ThreadingHTTPServer(('127.0.0.1', 8090), partial(Handler, directory=str(ROOT))).serve_forever()
