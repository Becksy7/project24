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
				console.log(info);

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
					
			};

			scene.firstStep = function(info) {
				scene.makeInfoPopups(info);
			};
			scene.secondStep = function() {

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

