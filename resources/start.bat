@echo off
start cmd /k "cd ..\server && npm run dev"
start cmd /k "cd ..\web && npm run dev"
start cmd /k "cd ..\app && npx expo start --clear"
