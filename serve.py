import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class RangeRequestHandler(SimpleHTTPRequestHandler):
    """Simple HTTP Request Handler with HTTP Range (byte serving) support for smooth video streaming."""

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def send_head(self):
        """Common code for GET and HEAD commands with Range support."""
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = sys.version_info
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return super().send_head()

        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        size = fs[6]

        range_header = self.headers.get('Range')
        if range_header and range_header.startswith('bytes='):
            try:
                ranges = range_header.split('=')[1].strip()
                start_str, end_str = ranges.split('-')
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else size - 1
                if start >= size:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    f.close()
                    return None
                end = min(end, size - 1)
                content_length = end - start + 1

                self.send_response(206)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(content_length))
                self.end_headers()

                f.seek(start)
                return f
            except Exception:
                pass

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(size))
        self.end_headers()
        return f

def run(port=8080):
    server_address = ('', port)
    httpd = ThreadingHTTPServer(server_address, RangeRequestHandler)
    print(f"Serving HTTP on port {port} with Range support...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run(port)

