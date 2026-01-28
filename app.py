#!/usr/bin/env python3
"""
Auto Guardian Core - Web Server for Hugging Face Spaces
Serves the static HTML website
"""

import os
import sys
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

# Get the directory of this script
BASE_DIR = Path(__file__).parent

class MyHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler to serve HTML files"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)
    
    def end_headers(self):
        """Add custom headers"""
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        # Redirect to index.html for root
        if self.path == '/':
            self.path = '/index.html'
        
        # Handle .html file requests without extension
        if not self.path.endswith('.html') and not '.' in self.path.split('/')[-1]:
            html_path = self.path + '.html'
            if (BASE_DIR / html_path.lstrip('/')).exists():
                self.path = html_path
        
        return super().do_GET()
    
    def log_message(self, format, *args):
        """Log messages to console"""
        print(f"[{self.client_address[0]}] {format % args}")

def run_server(port=7860):
    """Run the HTTP server"""
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, MyHTTPRequestHandler)
    
    print(f"🚀 Auto Guardian Website Server")
    print(f"📍 Serving from: {BASE_DIR}")
    print(f"🌐 Server running on: http://0.0.0.0:{port}")
    print(f"✅ Press Ctrl+C to stop the server\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ Server stopped")
        sys.exit(0)

if __name__ == '__main__':
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 7860))
    run_server(port)
