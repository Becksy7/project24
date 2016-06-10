$(function() {

	var App = (function(){

		return {
			init : function() {
				//DummyModule.init();
				Popovers.init();
				Scene.init();
			}
		}
	})()
	/**
	 * popover show initalization
	 *
	 */
		,Popovers = (function(){
			var $popovers = $('[data-webiu-popover]');
			return {
				init : function() {
					$popovers.each(function(i, popover) {
						var id = $(popover).attr('data-webiu-popover');
						$(popover).webuiPopover({url: id});
					});
				}
			}
		})()
		,Scene = (function(){
			var scene = {};
			scene.url ="api/scene1.json";
			scene.$ = {};
			scene.$.infoPopupsTemplate = $('#info-popups-template');
			scene.$.infoPopups = $('#info-popups-target');
			scene.$.heartsTemplate = $('#hearts-template');
			scene.$.hearts = $('#hearts-target');
			scene.$.headerTemplate = $('#header-template');
			scene.$.header = $('#header-target');

			var load = function() {
				$.ajax({
					url     : scene.url,
					method  : 'POST',
					data    : {
						id : 1
					},
					success: scene.success
				});	
			};
			scene.success = function(data) {
				//console.log('data:',data);
				var info = $.parseJSON(data).scene;
				//console.log(info);

				scene.background = info.image;


				scene.characters = info.characters;
				scene.code = info.code;
				scene.name = info.name;

				scene.sharings = {
					vkimg : info.shareImageVk,
					fbimg : info.shareImageFb,
					descr : info.description
				};



				//
				scene.firstStep(info);

				$(document).on('click','[data-to-step]', function() {
					var step = $(this).attr('data-to-step');
					step == 2 ? scene.secondStep(info) : (step == 3 ? scene.thirdStep(info) : '');
				});
			};
			scene.makeInfoPopups = function(info) {
				var tmpl = scene.$.infoPopupsTemplate.html(),
					infopopupsdata = {
						name : info.name,
						id : info.id,
						url : info.video,
						text: info.description
					};
				scene.$.infoPopups.html(_.template(tmpl)( infopopupsdata ));
			};
			scene.makeHearts = function(users) {
				var tmpl = scene.$.heartsTemplate.html();

				scene.$.hearts.html(_.template(tmpl)( users ));
			};
			scene.makeHeaders = function(data) {
				var tmpl = scene.$.headerTemplate.html();

				scene.$.header.html(_.template(tmpl)( data ));
			};

			scene.firstStep = function(info) {
				var headers = {
					id : info.id,
					name: info.name
				};
				scene.makeHeaders(headers);
				scene.makeInfoPopups(info);
			};
			scene.secondStep = function(info) {
				var data = {
					scene : info.code,
					users: info.characters
				};

				data.users.forEach(function(item, i) {
					item.traits.forEach(function(trait, i) {

						trait.image = window.TRAITS[trait.id].image;
					})
				});
				console.log(data);
				
				scene.makeHearts(data);
				$('[data-popover-webui]').each(function(i, link) {
					var $link = $(link),
						id = $link.attr('data-target');
					$link.webuiPopover({
						url: id,
						placement:'auto-right',
						onShow: function($element) {

							var $content = $element.find('[data-nicescroll-block]');
							$content.addClass('nicescroll-on').niceScroll( /*'.nicescroll-on p',*/ {
								'cursorcolor': '#00abe8',
								'cursorwidth': 12,
								'cursorborder': '0',
								'cursorborderradius': 12,
								'autohidemode': false
							});
						},
						onHide: function($element) {
							console.log($element, 'hidden');
							var $content = $element.find('[data-nicescroll-block]');
							$content.hasClass('nicescroll-on') && $content.niceScroll().remove();
						}
					});
				});

				//show next explain block
				scene.$.header.find('.explain.active').fadeOut(500, function() {
					scene.$.header.find('.explain.active').removeClass('active');
					scene.$.header.find('.explain').eq(1).fadeIn(200).addClass('active');
				});
			};
			scene.thirdStep = function() {

			};
		
			return {
				init : function() {
					load();

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

