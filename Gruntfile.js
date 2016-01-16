module.exports = function(grunt) {

    grunt.initConfig({

        // main task : watch files and do all tasks
        watch: {
            files: [
                'src/less/**/*.less', 'src/views/**/*.phtml'
            ],
            tasks: [
                'shell:html_template',
                'less',
                'postcss',
                'autoprefixer',
                'cssmin',
                'htmlmin',
                'prettify',
                'copy',
                'shell:html_fixpaths'
            ]
        },

        shell: {
            html_template : {
                command : 'php html_build.php'
            },

            html_fixpaths : {
                command : 'php html_fixpaths.php'
            }
        },

        // Less 2 Css
        less: {
            development: {
                files: {
                    "build/css/styles.css": "src/less/styles.less"
                }
            },
            production: {
                files: {
                    "build/css/styles.css": "src/less/styles.less"
                }
            }
        },

        // Transform lost-* commands
        postcss: {
            options: {
                map: true,
                processors: [ require('lost') ]
            },
            dist: {
                src  : 'build/css/styles.css',
                dest : 'build/css/styles.css'
            }
        },

        // Autoprefixing
        autoprefixer: {
            single_file: {
                src  : 'build/css/styles.css',
                dest : 'build/css/styles.css'
            }
        },

        // Pretty HTML
        prettify: {
            options: {
                "indent"            : 4,
                "condense"          : true,
                "indent_inner_html" : false
            },
            // directory of files
            all: {
                expand : true,
                cwd    : 'build/',
                ext    : '.html',
                src    : ['*.html'],
                dest   : 'build/'
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments     : true
                },
                files: [{
                    expand : true,
                    cwd    : 'build/',
                    ext    : '.html',
                    src    : ['*.html'],
                    dest   : 'build/'
                }]
            }
        },

        // Minifying css
        cssmin: {
            options: {
                shorthandCompacting : false,
                roundingPrecision   : -1
            },
            target: {
                files: {
                    'build/css/styles.css': ['build/css/styles.css']
                }
            }
        },

        // Copy JS file
        copy: {
            main: {
                src  : 'src/main.js',
                dest : 'build/js/main.js'
            }
        }

    });

    // npm install grunt-contrib-less --save-dev
    grunt.loadNpmTasks('grunt-contrib-less');

    // npm install --save-dev grunt-postcss grunt-autoprefixer lost
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // npm install grunt-contrib-cssmin --save-dev
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // npm install grunt-prettify --save-dev
    grunt.loadNpmTasks('grunt-prettify');

    // npm install grunt-contrib-htmlmin --save-dev
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // npm install grunt-contrib-copy --save-dev
    grunt.loadNpmTasks('grunt-contrib-copy');

    // npm install --save-dev grunt-contrib-watch
    grunt.loadNpmTasks('grunt-contrib-watch');

    // npm install --save-dev grunt-shell
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default',  ['watch'] );
};
