@echo off
title Anchor Aadhya - Daily 4:30 PM News Pipeline
cd /d "E:\Paresh\Auto Post\AI News Channel"
echo ==============================================================
echo   ANCHOR AADHYA - DAILY AI NEWS PIPELINE
echo   Auto-Fetches Today's News ^& Renders Master Video for 5 PM
echo ==============================================================
"C:\Users\Admin\AppData\Local\Programs\Python\Python311\python.exe" "E:\Paresh\Auto Post\AI News Channel\daily_news_pipeline.py"
echo.
echo [DONE] Master Video generated successfully!
if "%1"=="--scheduled" exit /b 0
pause
