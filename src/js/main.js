$(function() {

    var App = (function(){

        return {
            init : function() {
                //DummyModule.init();
                PageHeightCalc.init();
                NoPortraitLayout.init();
                UserBookmark.init();
            }
        }
    })()
    /**
     * Calculate page height if vh don't supports
     */
        ,PageHeightCalc = (function(){
            var selectors = ['.layout-wrapper'],
            recalc = function() {
                var wh = $(window).height();
                $.each(selectors, function(i, selector) {
                    $(selector).css('height', wh);
                })
            };
            return {
                init : function() {
                    if (!Modernizr.cssvhunit) {
                        // not-supported
                        recalc();
                        $(window).on('resize',recalc);
                    }
                },
                recalc : function(w, h, disable) {
                    $.each(selectors, function(i, selector) {
                        $(selector).css({
                            'height': h,
                            'width' : w,
                            'top': disable ? 'auto' : Math.abs(w - h)/2,
                            'left': disable ? 'auto' : -Math.abs(w - h)/2
                        });
                    })
                }
            }
        })()
    /**
     * Forbid to rotate screen on mobile devices
     */
        ,NoPortraitLayout = (function(){
            var isPortrait = function() {
              var ww = $(window).width(),
                  wh = $(window).height();

                 if (wh > ww){
                     return true;
                 }
                return false;
            },
            rotate = function() {
                var isportrait = isPortrait();
                var ww = $(window).width(),
                    wh = $(window).height();

                if (isportrait) {
                    $('body').addClass('rotate-me');
                    if (!Modernizr.cssvhunit) {
                        PageHeightCalc.recalc(wh, ww, false);
                    }
                } else {
                    $('body').removeClass('rotate-me');
                    if (!Modernizr.cssvhunit) {
                        PageHeightCalc.recalc('auto', wh, true);
                    }
                }
            };
            return {
                init : function() {
                    if (isMobile.any){

                        rotate();
                        $(window).on('resize orientationchange', rotate);
                    }
                }
            }
        })()
        /**
         * Hide and show user bookmark when panel shows/hides
         */
        ,UserBookmark = (function(){
            return {
                init : function() {
                    $('#user-panel').on('show.bs.collapse',function() {
                            $('#user-bookmark').addClass('rolled');
                        })
                        .on('hidden.bs.collapse',function() {
                            $('#user-bookmark').removeClass('rolled');
                        });

                    $('#user-traits-container').niceScroll('#user-traits-list',{
                        'cursorcolor': '#00abe8',
                        'cursorwidth': 12,
                        'cursorborder': '0',
                        'cursorborderradius': 12,
                        'autohidemode': false
                    });

                    //form Rostelekom settings:
                    var F = {};
                    F.errorMsg="Произошла ошибка. Попробуйте заполнить поле еще раз.";
                    F.sayError = function(data) {
                        var errorHTML = (data.errorMessage ? data.errorMessage : F.errorMsg);
                        $('#agreement-form').fadeOut(500, function() {
                            $('#agreement-error').find('.a-user-agreement__text')
                                .html(errorHTML);
                            $('#agreement-error').fadeIn(200);
                        });
                    };
                    F.success = function(data) {
                        if (data.error ) {
                            F.sayError(data);
                        } else {
                            $('#agreement-form').fadeOut(500, function() {
                                $('#agreement-success').fadeIn(200);
                            });
                        }
                    };
                    F.error = function(data) {
                        F.sayError(data);
                    };
                    $('#agreement-form').validate({
                        errorClass:'has-error',
                        errorPlacement: function(error, element) {
                            var $parent = $(element).parent();
                            if ($parent.hasClass('input-group')) {
                                error.insertAfter($parent);
                            } else {
                                error.insertAfter(element);
                            }
                        },
                        highlight: function(element, errorClass) {
                            $(element).parents('.form-group').addClass(errorClass);
                        },
                        unhighlight: function(element, errorClass) {
                            $(element).parents('.form-group').removeClass(errorClass);
                        },
                        submitHandler: function(form) {

                            var data = $(form).serialize();

                            $.ajax({
                                url     : $(form).attr('action'),
                                method  : $(form).attr('method'),
                                data    : data,
                                success : F.success,
                                error   : F.error
                            });

                            return false;
                        }
                    });
                    $('#enter-agreement-num').on('click',function() {
                        $('#agreement-offer').fadeOut(500, function(){
                            $('#agreement-form').fadeIn(200);
                        });
                    });
                    $('#enter-agreement-num').on('click',function() {
                        $('#agreement-offer').fadeOut(500, function(){
                            $('#agreement-form').fadeIn(200);
                        });
                    });
                    $('#agreement-try-again').on('click',function() {
                        $('#agreement-error').fadeOut(500, function(){
                            $('#agreement-form').fadeIn(200);
                        });
                    });

                }
            }
        })()
    /**
     * Dummy Module Example
     */
    ,DummyModule = (function(){
        return {
            init : function() {
                // do something
            }
        }
    })()

    ;App.init();

});
