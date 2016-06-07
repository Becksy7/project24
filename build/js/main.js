$(function() {

    var App = (function(){

        return {
            init : function() {
                //DummyModule.init();
                PageHeightCalc.init();
                NoPortraitLayout.init();
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
