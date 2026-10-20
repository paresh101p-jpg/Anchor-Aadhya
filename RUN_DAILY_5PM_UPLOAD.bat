@echo off
title Anchor Aadhya - Daily 5:00 PM YouTube Upload
cd /d "E:\Paresh\Auto Post\AI News Channel"
echo ==============================================================
echo   ANCHOR AADHYA - DAILY 5:00 PM YOUTUBE UPLOADER
echo   Uploads Master Video + Custom Thumbnail + Full SEO Metadata
echo ==============================================================
"C:\Users\Admin\AppData\Local\Programs\Python\Python311\python.exe" "E:\Paresh\Auto Post\AI News Channel\youtube_uploader.py"
echo.
if "%1"=="--scheduled" exit /b 0
pause
