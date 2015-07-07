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
  echo $f

  stringSub=${f//$stringSlash/$stringDot}
  echo $stringSub
  stringFinal=${stringSub#..src.}
  echo $stringFinal
  echo build/$stringFinal
  # cp $filep $PWD/build/$stringFinal
  cp $filep /home/travis/build/pmaidens/screeps/build/LinkController.js

done
