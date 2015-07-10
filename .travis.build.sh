set -e

git checkout master

./buildProcess.sh

git config user.name "Travis-CI"
git config user.email "peter_maidens@intuit.com"

git add -f ./build

gitStatus=$(git status --porcelain)
gitCount=${#gitStatus}
if [[ $gitCount > 0 ]]; then
    git commit -m "Travis Build - Deploying to build folder [ci skip]"
    echo [INFO] Pushing changes...
    git push --force "https://${GH_TOKEN}@${GH_REF}" master
else
    echo [INFO] No new changes to push.
fi
