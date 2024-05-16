#!/bin/bash

gnome-terminal -- bash -c "cd ..\server && npm run dev; exec bash"
gnome-terminal -- bash -c "cd ..\web && npm run dev; exec bash"
gnome-terminal -- bash -c "cd ..\app && npx expo start --clear; exec bash"
