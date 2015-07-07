set -e

./buildProcess.sh

git config user.name "Travis-CI"
git config user.email "peter_maidens@intuit.com"

git add -f ./build
git commit -m "Travis Build - Deploying to build folder"

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master
