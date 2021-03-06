$(function() {

    var App = (function(){

        return {
            init : function() {
                UserBookmark.init();
                InterfaceElements.init();
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
                    $('#user-panel a.btn-default:not(.a-user-supergame__btn)').on('click',function(e) {
                       e.stopPropagation();
                    });

                    // $('#user-panel').find('.a-user__scrollable').niceScroll({
                    //     cursorcolor: "rgba(255,255,255,0)",
                    //     background: "rgba(255,255,255,0)",
                    //     cursorborder: "1px solid transparent",
                    //     autohidemode:"hidden"
                    // }).hide();

                    // $('#user-traits-container').niceScroll('#user-traits-list',{
                    //     'cursorcolor': '#00abe8',
                    //     'cursorwidth': 12,
                    //     'cursorborder': '0',
                    //     'cursorborderradius': 12,
                    //     'autohidemode': false
                    // });
                    

                }
            }
        })()
        ,InterfaceElements = (function(){
            return {
                init : function() {
                    $(document).on('shown.bs.modal','#text-popup',function() {
                        var $content = $(this).find('.text');

                            $content.addClass('nicescroll-on').niceScroll('#text-popup p', {
                                'cursorcolor': '#00abe8',
                                'cursorwidth': 12,
                                'cursorborder': '0',
                                'cursorborderradius': 12,
                                'autohidemode': false
                            });

                    }).on('hidden.bs.modal','#text-popup',function() {
                        var $content = $(this).find('.text');
                        $content.hasClass('nicescroll-on') && $content.niceScroll().remove();
                    }).on('shown.bs.modal','.modal',function(){

                            var $content = $(this).find('[data-nicescroll-block]');
                            $content.addClass('nicescroll-on').niceScroll(/*'.nicescroll-on p',*/ {
                                'cursorcolor': '#00abe8',
                                'cursorwidth': 12,
                                'cursorborder': '0',
                                'cursorborderradius': 12,
                                'autohidemode': false
                            });
                    }).on('hidden.bs.modal','.modal',function() {
                        var $content = $(this).find('[data-nicescroll-block]');
                        $content.hasClass('nicescroll-on') && $content.niceScroll().remove();
                    }).on('show.bs.modal','#video-popup',function(){
                        var $iframe = $(this).find('iframe');
                        if (!$iframe.attr('data-url')){
                            $iframe.attr('data-url',$iframe.attr('src'));
                        }
                        if ($iframe.attr('src') == ''){
                            $iframe.attr('src',$iframe.attr('data-url'));
                        }

                    }).on('hide.bs.modal','#video-popup',function(){
                        var $iframe = $(this).find('iframe');
                        if (!$iframe.attr('data-url')){
                            $iframe.attr('data-url',$iframe.attr('src'));
                        }
                        $iframe.attr('src','');
                    }).on('click','.popover-ui-close', function(){
                        var parent = $(this).parents('.webui-popover');
                        var id = parent.attr('id'),
                            $link = $('[data-target="' + id + '"]');
                        $link.webuiPopover('hide');
                    }).on('shown.bs.modal','[data-modal-user-choose]',function() {
                        $('#superGame').fadeOut();
                    }).on('hide.bs.modal','[data-modal-user-choose]',function() {
                        $('#superGame').fadeIn();
                    }).on('shown.bs.modal','#superGame',function() {
                        $('.users-slider').resize();
                        $('[data-popover-webui]').webuiPopover('hide');

                    });

                    // $('.a-user__scrollable').niceScroll({
                    //     cursorcolor: "rgba(255,255,255,0.2)",
                    //     background: "rgba(255,255,255,0)",
                    //     cursorborder: "1px solid transparent",
                    //     autohidemode:"hidden"
                    // });
                    
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
