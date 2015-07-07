set -e

./buildProcess.sh

git config user.name "Travis CI"
git config user.email "pmaidens@ualberta.ca"

git add -f ./build
git commit -m "Travis Build - Deploying to build folder"

git push --force --quiet "https://NjpzCqapfKVXXBQ29BJH@github.com/pmaidens/screeps.git" master
