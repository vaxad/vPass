tell application "Terminal"
  do script "cd ..\server && npm run dev"
  do script "cd ..\web && npm run dev"
  do script "cd ..\app && npx expo start --clear"
end tell
