@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1

echo.
echo  ================================================
echo   BetterBody -- Next.js Project Setup
echo   This will scaffold the full app in this folder
echo  ================================================
echo.

:: ── Check Node.js ──
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Node.js is not installed.
    echo  Download from: https://nodejs.org  (LTS version)
    pause & exit /b
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo  [OK] Node.js %NODE_VER%

:: ── Move to script folder ──
cd /d "%~dp0"

echo.
echo  Creating Next.js 14 project...
echo  (This takes 1-2 minutes)
echo.

:: ── Scaffold with create-next-app ──
call npx create-next-app@14.2.5 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes 2>nul

if %errorlevel% neq 0 (
    echo  Retrying without --yes flag...
    call npx create-next-app@14.2.5 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
)

echo.
echo  Installing additional dependencies...
call npm install @supabase/supabase-js @supabase/ssr stripe @stripe/stripe-js gsap @gsap/react lenis framer-motion resend clsx tailwind-merge zod date-fns

echo.
echo  Creating folder structure...

:: ── Create directories ──
mkdir app\(auth)\login 2>nul
mkdir app\(auth)\signup 2>nul
mkdir app\(auth)\forgot-password 2>nul
mkdir app\auth\callback 2>nul
mkdir app\(site)\programs 2>nul
mkdir app\(site)\programs\[slug] 2>nul
mkdir app\(site)\challenges 2>nul
mkdir app\(site)\challenges\[slug] 2>nul
mkdir app\(site)\nutrition 2>nul
mkdir app\(site)\stride-club 2>nul
mkdir app\(site)\membership 2>nul
mkdir app\(site)\about 2>nul
mkdir app\(site)\shop 2>nul
mkdir app\(site)\shop\[slug] 2>nul
mkdir app\(site)\legal\privacy-policy 2>nul
mkdir app\(site)\legal\terms 2>nul
mkdir app\(site)\legal\refunds 2>nul
mkdir app\account 2>nul
mkdir app\account\programs 2>nul
mkdir app\account\nutrition 2>nul
mkdir app\account\stride-club 2>nul
mkdir app\account\billing 2>nul
mkdir app\account\settings 2>nul
mkdir app\admin 2>nul
mkdir app\admin\orders 2>nul
mkdir app\admin\products 2>nul
mkdir app\admin\programs 2>nul
mkdir app\admin\users 2>nul
mkdir app\admin\stride-club 2>nul
mkdir app\admin\coupons 2>nul
mkdir app\admin\reviews 2>nul
mkdir app\admin\subscribers 2>nul
mkdir app\admin\email-templates 2>nul
mkdir app\admin\settings 2>nul
mkdir app\api\webhooks\stripe 2>nul
mkdir app\api\checkout 2>nul
mkdir app\api\stride 2>nul
mkdir app\api\currency 2>nul
mkdir app\api\subscribe 2>nul
mkdir app\api\admin 2>nul
mkdir components\ui 2>nul
mkdir components\layout 2>nul
mkdir components\sections 2>nul
mkdir components\providers 2>nul
mkdir components\admin 2>nul
mkdir components\account 2>nul
mkdir utils\supabase 2>nul
mkdir types 2>nul
mkdir lib 2>nul
mkdir public\images 2>nul

echo  [OK] Directories created

:: ── Copy config files from this setup folder ──
echo  Copying config files...

if exist "package.json.betterbody" (
    copy /y "package.json.betterbody" "package.json" >nul
)

:: Copy all the pre-built source files
for %%f in (
    "middleware.ts"
    "next.config.ts"
    "tsconfig.json"
    "tailwind.config.ts"
    ".env.local.example"
    ".gitignore"
) do (
    if exist %%f (
        echo  Keeping %%f
    )
)

echo.
echo  ================================================
echo   SETUP COMPLETE
echo  ================================================
echo.
echo  Next steps:
echo    1. Copy .env.local.example to .env.local
echo    2. Fill in your Supabase + Stripe keys
echo    3. Run: npm run dev
echo    4. Open: http://localhost:3000
echo.
echo  When ready to deploy:
echo    npx vercel --prod
echo.
pause
