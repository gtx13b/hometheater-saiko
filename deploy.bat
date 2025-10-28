@echo off
echo Gitリポジトリを更新します...
git add .
git commit -m "自動デプロイメント"
git push origin main

echo デプロイメントが完了しました。