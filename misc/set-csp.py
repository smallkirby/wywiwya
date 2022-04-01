#
# Generated distribution files of Nuxt, SPA mode contains inline script inside its index.html.
# Therefore, <script> tags must be calculated for sha256-hash and appropriate meta-tag must be added
# for Content-Security-Policy (CSP) to work.
# This script calculates hashes of inline scripts of index.html
# and adds an appropriate meta tag of CSP.
#
# This mitigation's purpose is just to "raise a bar".
# However, it at least would be a mitigation of javascript directive and so on.
#
# Other mitigations for XSS is held such as DOMPurify, iframe sandbox, and etc.
#

import re
import hashlib
import base64

CSP = {
  "default-src": [
    "'self'",
  ],
  "script-src": [
    "'self'",
    "*.apis.google.com",
    "apis.google.com",
    "*.smallkirby.xyz",
    "smallkirby.xyz",
    "wywiwya.firebaseapp.com",
  ],
  "child-src": ["'self'"],
  "connect-src": [
    "'self'",
    "*.googleapis.com",
    "*.smallkirby.xyz",
    "wywiwya.firebaseapp.com",
    "https://asia-northeast1-wywiwya.cloudfunctions.net",
    "http://localhost:5001",
    "http://localhost:8081",
    "http://localhost:9099",
  ],
  "font-src": ["*"],
  "frame-src": [
    "'self'",
    "apis.google.com",
    "wywiwya.firebaseapp.com",
  ],
  "img-src": ["*", "data:"],
  "media-src": ["*"],
  "style-src": ["*", "'unsafe-inline'"],
}

#################################################3

shas = []

def generate_meta():
  for sha in shas:
    CSP["script-src"].append("'sha256-" + sha.decode('utf-8') + "'")

  cspString = """<meta http-equiv="Content-Security-Policy" content=\""""
  for (key,vals) in CSP.items():
    cspString += f"{key} "
    for val in vals:
      cspString += f"{val} "
    cspString += ";"
  cspString += "\">"

  return cspString


def add_meta_header(lines):
  for (ix,line) in enumerate(lines):
    if "<head>" in line:
      lines = lines[0:ix+1] + [generate_meta()] + lines[ix+1:]
      break
  return lines

def add_hash(lines):
  for (ix,line) in enumerate(lines):
    scripts = re.findall(r"<script>(.*?)</script>", line)
    for script in scripts:
      sh = hashlib.sha256()
      sh.update(script.encode("utf-8"))
      shas.append(base64.b64encode(sh.digest()))
  return lines

if __name__ == "__main__":
  print("[+] setting CSP meta tag.")
  lines = ""
  with open("./dist/index.html", "r") as f:
    lines = f.readlines()
  lines = add_hash(lines)
  lines = add_meta_header(lines)

  with open("./dist/index.html", "w") as f:
    f.writelines(lines)
