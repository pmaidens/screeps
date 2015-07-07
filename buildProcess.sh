# rm -rf ./build
# mkdir build
#!/bin/bash
shopt -s nullglob
FILES=./src/*
stringSlash="/"
stringDot="."

rm -rf ./build
mkdir build

for f in $(find ./src -name '*.js')
do
  echo "[INFO] Processing $f file..."

  stringSub=${f//$stringSlash/$stringDot}
  stringFinal=${stringSub#..src.}
  cp $f $PWD/build/$stringFinal

done
