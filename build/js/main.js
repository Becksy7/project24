$(function() {

    var App = (function(){

        return {
            init : function() {
                //DummyModule.init();
                AddDesktopClass.init();
            }
        }
    })()
        ,AddDesktopClass = (function(){
            return {
                init : function() {
                    if (!isMobile.any){
                        console.log('desktop');
                        $('body').addClass('desktop');
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
