#!/usr/bin/env sh

# Остановить deploy при ошибках
set -e

# Сборка приложения
npm run build

# Переход в каталог сборки
cd dist

# Инициализация репозитория и загрузка кода в git
git init
git add -A
git commit -m "deploy"
git push -f git@github.com:Twisters30/moire-app.git master:gh-pages

