set -e

git checkout $TRAVIS_BRANCH

pwd
PWD=$(pwd)
echo $PWD

cd buildProcess
cargo run
echo cd $PWD
cd $PWD
pwd

git config user.name "Travis-CI"
git config user.email "peter_maidens@intuit.com"

git add -f ./build

gitStatus=$(git status --porcelain)
gitCount=${#gitStatus}
if [[ $gitCount > 0 ]]; then
    git commit -m "Travis Build - Deploying to build folder [ci skip]"
    echo
    echo [INFO] Pushing changes...
    git push --force "https://${GH_TOKEN}@${GH_REF}" $TRAVIS_BRANCH
    echo [INFO] Changes pushed.
else
    echo
    echo [INFO] No new changes to push.
fi
