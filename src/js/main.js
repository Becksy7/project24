$(function() {

    var App = (function(){

        return {
            init : function() {
                //DummyModule.init();
                AddDesktopClass.init();
                ShowOrientationDisclamer.init();
            }
        }
    })()
        ,AddDesktopClass = (function(){
            return {
                init : function() {
                    if (!isMobile.any){
                        $('body').addClass('desktop');
                    }
                }
            }
        })()
    /**
     * Forbid to rotate screen on mobile devices
     */
        ,ShowOrientationDisclamer = (function(){
            var $dPopup = $('#disclamer'),
                isPortrait = function() {
                    var ww = $(window).width(),
                        wh = $(window).height();

                    if (wh > ww){
                        return true;
                    }
                    return false;
                },
                showDisclamer = function() {
                    var isportrait = isPortrait();

                    if (isportrait) {

                        $dPopup.modal('show');
                    } else {
                        
                        $dPopup.modal('hide');
                    }
                };
            return {
                init : function() {
                    if (isMobile.any){
                        $('body').addClass('mobile');
                        if ($('body[class*=game]').length){
                            $('html').addClass('v100');
                        }
                        showDisclamer();
                        $(window).on('resize orientationchange', showDisclamer);
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
