# go-off
Front-end Bootstrap System

### Назначение папок

* build/ - готовые статичные .html страницы
* build/css - css файлы
* build/js - js-файлы
* build/img - картинки
* build/fonts - шрифты
* build/vendor - сторонние зависимости (js/css)
* src - файлы-исходники
* src/views/ - шаблоны .phtml страниц или их частей
* src/views/helpers - шаблоны вспомогательных элементов, частей страниц, которые используются повторно
* src/views/blocks - шаблон блоков страниц
* src/views/pages - шаблоны отдельных страниц
* src/views/data - хранение данных
* src/less - исходники стилей .less
* src/less/helpers - стили вспомогательных элементов страниц
* src/less/blocks - стили блоков страниц
* src/js - исходники JS (EcmaScript 6 разрешен)
* sys - вспомогательные скрипты

### Просмотр готовой статичной верстки
* Файлик build/pagename.html содержит готовую статичную верстку для pagename-страницы.

### Комманды
* `sys/grunt-install` - установка grunt и grunt-модулей
* `sys/serv port` - поднимает localhost:port (доступный по сети устройствам)
* `sys/config.php` - настройка

#### Вспомогательные php-скрипты (вызываются через grunt-shell)
* html_build.php - сборка цельных .html страниц из .phtml шаблонов
* html_fixpaths.php - исправление путей (относительных) внутри .html, .css, и .js

### Build
* `grunt` - единоразовая сборка
* `grunt online` - сборка в watch-режиме

#### Grunt-модули
* grunt-contrib-less
* grunt-postcss
* grunt-autoprefixer
* grunt-contrib-cssmin
* grunt-prettify
* grunt-contrib-htmlmin
* grunt-contrib-copy
* grunt-contrib-watch
* grunt-shell
* grunt-babel (es6)
