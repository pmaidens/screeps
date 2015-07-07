set -e

git checkout master

./buildProcess.sh

git config user.name "Travis-CI"
git config user.email "peter_maidens@intuit.com"

git add -f ./build

gitStatus=$(git status --porcelain)
echo $gitStatus
gitCount=${#gitStatus}
echo $gitCount
if [[ $gitCount > 0 ]]; then
    git commit -m "Travis Build - Deploying to build folder"


    echo pushing...
    gitStatus= git status --porcelain
    echo gitStatus
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master
fi
