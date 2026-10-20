@echo off
title Anchor Aadhya - 12:00 PM Afternoon Bulletin
cd /d "E:\Paresh\Auto Post\AI News Channel"
echo ==============================================================
echo   ANCHOR AADHYA - 12:00 PM TECH SPECIAL BULLETIN
echo   Auto-Fetches Fresh News, Renders Video ^& Uploads to YouTube
echo ==============================================================
"C:\Users\Admin\AppData\Local\Programs\Python\Python311\python.exe" "E:\Paresh\Auto Post\AI News Channel\daily_news_pipeline.py" --slot 12PM
echo.
"C:\Users\Admin\AppData\Local\Programs\Python\Python311\python.exe" "E:\Paresh\Auto Post\AI News Channel\youtube_uploader.py" --slot 12PM
echo.
echo [DONE] 12:00 PM Bulletin Generated and Uploaded!
if "%1"=="--scheduled" exit /b 0
pause
