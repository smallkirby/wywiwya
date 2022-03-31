#
# Generated distribution files of Nuxt, SPA mode contains inline script inside its 200.html.
# Therefore, it must have nonce attribute for Content-Security-Policy (CSP) to work.
# This script add meta tag of CSP and add nonce to 200.html.
#
# This mitigation's purpose is just to "raise a bar".
# Cuz nonce is completely static, it has no guard agains script tag with the same static nonce.
# However, it at least would be a mitigation of javascript directive and so on.
#
# Other mitigations for XSS is held such as DOMPurify, iframe sandbox, and etc.
#

import re

CSP = {
  "default-src": [
    "'self'",
  ],
  "script-src": [
    "'self'",
    "'nonce-hogehoge'"
  ],
  "child-src": ["'self'"],
  "connect-src": [
    "'self'",
    "identitytoolkit.googleapis.com",
    "http://localhost:5001",
    "http://localhost:8081",
    "http://localhost:9099",
  ],
  "font-src": ["*"],
  "frame-src": ["'self'"],
  "img-src": ["*"],
  "media-src": ["*"],
  "style-src": ["*", "'unsafe-inline'"],
}

#################################################3

cspString = """<meta http-equiv="Content-Security-Policy" content=\""""
for (key,vals) in CSP.items():
  cspString += f"{key} "
  for val in vals:
    cspString += f"{val} "
  cspString += ";"
cspString += "\">"

def add_meta_header(lines):
  for (ix,line) in enumerate(lines):
    if "<head>" in line:
      lines = lines[0:ix+1] + [cspString] + lines[ix+1:]
      break
  return lines

def add_nonce(lines):
  for (ix,line) in enumerate(lines):
    lines[ix] = re.sub('<script>', '<script nonce="hogehoge">', line)
  return lines

if __name__ == "__main__":
  print("[+] setting CSP meta tag.")
  lines = ""
  with open("./dist/index.html", "r") as f:
    lines = f.readlines()
  lines = add_meta_header(lines)
  lines = add_nonce(lines)

  with open("./dist/index.html", "w") as f:
    f.writelines(lines)
