## 1. Описарие проекта
**Wordle Web App** – модульное, кроссплатформенное, красивое веб-приложение для игры в Wordle с таблицей лидеров и профилем пользователя. 
  
![Баннер](https://www.shutterstock.com/image-vector/wordle-word-puzzle-game-vector-260nw-2116971383.jpg)
## 2. Установка и запуск
**Простой запуск:**
* Скачиваем код из ветки site
* Запускаем локальный сервер и запускаем сайт.
сервер ваще любой, хоть live server в vs code

**Иначе:**
* git clone https://github.com/Reindotir/wordle.git
* cd wordle
* npm init
* npm install --save-dev vite
* npm run dev

Открываем http://localhost:5000  
Или после запуска просто прописать "o" и нажать Enter (сам открывает браузер)

**ЕСЛИ ВООБЩЕ НИЧЕГО НЕ РАБОТАЕТ:**
Я выложил сайт на бесплатный хостинг  
Тестировать здесь: m92443hk.beget.tech

## 3. Особенности проекта

Фронтенд: Vite + TypeScript

Дизайн: Human Interface Design (Я СТАРАЛСЯ СООТВЕТСТВОВАТЬ), светлая/темная тема

Кроссплатформенность: Работает в браузерах на всех ОС (мобильная версия, версия для пк)

Многоязычность: Поддержка нескольких языков (русский, английский)

## 4. Структура проекта

src/ – исходный код 

src/pages/ – страницы (игра, лидеры, профиль)

src/comps/ – игра wordle, шапка

src/libs/ - библиотеки, shader - для настройки стилей и темы, PageX - роутер, store - состояние приложения.

src/js/ - там файл с основным классом App.

public/ – стили, спрайт, фавикон, картинки с котиками, json файлы для локализации

dist/ - скомпилированный проект с обычным js.

## 6. Скриншоты

### Игра на телефоне:
![игра](https://github.com/Reindotir/wordle/blob/main/screenshots/screen1.jpg)

### Профиль на телефоне:
![профиль](https://github.com/Reindotir/wordle/blob/main/screenshots/screen2.jpg)

### Профиль на пк:
![Профиль](https://github.com/Reindotir/wordle/blob/main/screenshots/screen3.jpg)

### Лидеры на пк
![Лидеры](https://github.com/Reindotir/wordle/blob/main/screenshots/screen4.jpg)

## 7. Технологии

Vite – для сборки и работе с ts

TypeScript – ну без него никуда

Ключевая локализация - текст под ключами в json файлах

css_in_js – использую свою библиотеку (правда) для работы с стилямт внутри js


## 8. Будущие улучшения

Если бы времени было больше, я... не знаю, напишите свои предложения.


