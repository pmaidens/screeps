# rm -rf ./build
# mkdir build
#!/bin/bash
shopt -s nullglob
FILES=./src/*
stringSlash="/"
stringDot="."

rm -rf ./build
mkdir build

echo
echo "[INFO] Starting build process..."
echo

for f in $(find ./src -name '*.js')
do
  echo "[INFO] Processing $f"

  stringSub=${f//$stringSlash/$stringDot}
  stringFinal=${stringSub#..src.}
  cp $f $PWD/build/$stringFinal

done

echo
echo "[INFO] File processing complete."
