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
            var recalc = function() {
                var selectors = ['body','.layout-wrapper','.layout-main'],
                    wh = $(window).height();
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
                    console.log(ww,wh);
                 if (wh > ww){
                     return true;
                 }
                return false;
            },
            rotate = function() {
                var isportrait = isPortrait();
                isportrait ? $('body').addClass('rotate-me') : $('body').removeClass('rotate-me');
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
