@echo off
ECHO ローカルプロジェクトディレクトリへ移動...
cd C:\React\my-homepage

ECHO 変更をステージング (git add .)
git add .
if %errorlevel% neq 0 goto ERROR_HANDLER

ECHO コミット (git commit)
git commit -m "Automatic Update"
if %errorlevel% neq 0 (
    ECHO 警告: コミットする変更がありません。プッシュを続行します。
)

ECHO リモートリポジトリへプッシュ (git push)
git push origin main
if %errorlevel% neq 0 goto ERROR_HANDLER

ECHO.
ECHO ----------------------------------------------------
ECHO ? Gitプッシュ完了。Vercelが自動でビルドを開始します。
ECHO ----------------------------------------------------
goto END

:ERROR_HANDLER
ECHO.
ECHO ----------------------------------------------------
ECHO ? エラーが発生しました。ターミナルで確認してください。
ECHO ----------------------------------------------------

:END
pause