#!/bin/bash

# ask for commit message
echo "Enter commit message:"
read message

# check if empty
if [ -z "$message" ]; then
  echo "❌ Commit message cannot be empty"
  exit 1
fi

# show files status
echo ""
git status
echo ""

# confirm push
echo "Do you want to commit and push? (y/n)"
read confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
  git add .
  git commit -m "$message"
  git push
  echo "🚀 Code pushed successfully"
else
  echo "❌ Commit cancelled"
fi
