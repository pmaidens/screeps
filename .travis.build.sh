set -e

git checkout master

./buildProcess.sh

git config user.name "Travis-CI"
git config user.email "peter_maidens@intuit.com"

git add -f ./build
git commit -m "Travis Build - Deploying to build folder"

echo pushing...
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master
