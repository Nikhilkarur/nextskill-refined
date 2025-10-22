@echo off
echo This script will help you set a PostgreSQL password
echo.
echo Step 1: Connect to PostgreSQL (currently no password needed)
echo Step 2: Set a password for the postgres user
echo Step 3: Test the new password
echo.
echo Ready? Press any key to continue...
pause >nul

echo.
echo Starting PostgreSQL command shell...
echo When psql opens, run this command:
echo   ALTER USER postgres PASSWORD 'your-strong-password';
echo.
echo Replace 'your-strong-password' with your actual password
echo.

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres

echo.
echo Password should now be set!
echo Test it by running: psql -U postgres
echo (It should now ask for password)