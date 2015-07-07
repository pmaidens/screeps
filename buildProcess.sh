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
  filep=$(stat -f $f)

  stringSub=${filep//$stringSlash/$stringDot}
  stringFinal=${stringSub#..src.}
  echo $stringFinal
  cp $filep build/$stringFinal

done
