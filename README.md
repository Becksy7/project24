### Назначение папок

* build/ - готовые статичные .html страницы
* build/css - готовые css
* build/js - js-файлы (в данный момент используются все на каждой странице)
* build/img - картинки
* build/fonts - шрифты
* src - файлы-исходники
* src/views/ - шаблоны .phtml страниц или их частей
* src/views/helpers - шаблоны вспомогательных элементов, частей страниц, которые используются повторно
* src/views/blocks - шаблон блоков страниц
* src/views/pages - шаблоны отдельных страниц
* src/views/data - хранение данных
* src/less - исходники стилей .less
* src/less/helpers - стили вспомогательных элементов страниц
* src/less/blocks - стили блоков страниц

### Просмотр готовой статичной верстки
* Файлик build/pagename.html содержит готовую статичную верстку для pagename-страницы.

### Просмотр динамической верстки
* Находясь в корневой папке, поднять localhost (`php -S localhost:8000`)
* Открыть localhost:8000 для просмотра главной страницы
* Обращаться по параметру `?page=pagename` к другим готовым страницам

### Build
Проект собирается Grunt-задачами и php-шаблонизатором

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

#### Вспомогательные php-скрипты (вызываются через grunt-shell)
* html_build.php - сборка цельных .html страниц из .phtml шаблонов
* html_fixpaths.php - исправление путей (относительных) внутри .html, .css, и .js

#### Установка Grunt
`npm install --save-dev grunt grunt-postcss grunt-autoprefixer lost grunt-contrib-less grunt-contrib-cssmin grunt-prettify grunt-contrib-htmlmin grunt-contrib-copy grunt-contrib-watch grunt-shell
`
