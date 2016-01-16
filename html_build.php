<?php
//
// Склеивание всех .phtml файл
// в статические страницы .html
//

include "config.php";

//
// Получение имён страниц из /src/view/pages/PAGENAME.phtml
//
$pages = array_map(function($page){
    return basename($page, ".phtml");
}, array_diff(scandir("${src_dir}/views/pages"), array('..', '.')));


foreach($pages as $page) {
    ob_start();
    // там читается переменная $page
    include "index.php";
    $content = ob_get_contents();
    ob_end_clean();

    // @bad_solution (некогда делать по-человечески)
    $content = str_replace("/${src_dir}/main.js", "/${build_dir}/js/main.js", $content);

    // clean abs-path from $content
    $content = str_replace("/${build_dir}/", '', $content);

    // replace links
    $content = preg_replace("/\/?\?page=([a-zA-Z0-9]+)/", "/${build_dir}/$1.html", $content);

    file_put_contents(sprintf("%s/%s.html", $build_dir, $page), $content);
}
