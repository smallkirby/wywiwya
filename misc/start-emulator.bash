#!/bin/bash

EMU_DATA_DIR=./emu-sample

export FB_FIRESTORE_EMULATE=1
export FB_FUNCTIONS_EMULATE=1
export FB_AUTH_EMULATE=1

if [ -d ./emu-sample ]; then
  echo "[+] Using existing data for Emulators."
  npx firebase emulators:start --import="$EMU_DATA_DIR"
else
  echo "[-] No data found for Emulators."
  npx firebase emulators:start
fi
