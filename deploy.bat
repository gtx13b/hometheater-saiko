@echo off
ECHO ���[�J���v���W�F�N�g�f�B���N�g���ֈړ�...
cd C:\React\my-homepage

ECHO �ύX���X�e�[�W���O (git add .)
git add .
if %errorlevel% neq 0 goto ERROR_HANDLER

ECHO �R�~�b�g (git commit)
git commit -m "Automatic Update"
if %errorlevel% neq 0 (
    ECHO �x��: �R�~�b�g����ύX������܂���B�v�b�V���𑱍s���܂��B
)

ECHO �����[�g���|�W�g���փv�b�V�� (git push)
git push origin main
if %errorlevel% neq 0 goto ERROR_HANDLER

ECHO.
ECHO ----------------------------------------------------
ECHO ? Git�v�b�V�������BVercel�������Ńr���h���J�n���܂��B
ECHO ----------------------------------------------------
goto END

:ERROR_HANDLER
ECHO.
ECHO ----------------------------------------------------
ECHO ? �G���[���������܂����B�^�[�~�i���Ŋm�F���Ă��������B
ECHO ----------------------------------------------------

:END
pause