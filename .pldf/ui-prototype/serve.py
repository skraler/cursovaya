#!/usr/bin/env python3
"""Локальный сервер для просмотра HTML-прототипов PLDF."""
import http.server
import socketserver
import os

PORT = 8000
DIR = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIR)
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"Serving {DIR}")
    print(f"Open http://localhost:{PORT}/index.html")
    httpd.serve_forever()
