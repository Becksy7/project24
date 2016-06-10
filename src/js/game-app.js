$(function() {

	var App = (function() {

			return {
				init: function() {
					//DummyModule.init();
					Popovers.init();
					Rostelekom.init();
					Scene.init();
				}
			}
		})()
	/**
	 * popover show initalization
	 *
	 */
		, Popovers = (function() {
			var $popovers = $('[data-webiu-popover]');
			return {
				init: function() {
					$popovers.each(function(i, popover) {
						var id = $(popover).attr('data-webiu-popover');
						$(popover).webuiPopover({url: id});
					});
				}
			}
		})()
		, Scene = (function() {
			var scene = {};
			scene.urls = {
				getScene: "api/scene.json",
				guessCharTraits: "api/guess-character-traits/",
				userSayHimself: "api/user-set-traits/"
			};
			scene.MAXCHECKEDTRAITS = 5;//макс. число выбранных черт характера


			scene.$ = {};
			scene.$.infoPopupsTemplate = $('#info-popups-template');
			scene.$.infoPopups = $('#info-popups-target');
			scene.$.heartsTemplate = $('#hearts-template');
			scene.$.hearts = $('#hearts-target');
			scene.$.headerTemplate = $('#header-template');
			scene.$.header = $('#header-target');
			scene.$.userTraitsTemplate = $('#user-traits-template');
			scene.$.userTraits = $('#user-traits-container');

			var load = function() {
				$.ajax({
					url: scene.urls.getScene,
					method: 'POST',
					success: scene.success
				});
			};
			scene.success = function(data) {
				//console.log('data:',data);
				var info = $.parseJSON(data).scene;

				scene.makeUserTraits(info);
				scene.firstStep(info);
				scene.loadCurrentState(info);

				$(document).on('click', '[data-to-step]', function() {
					var step = $(this).attr('data-to-step');
					step == 2 ? scene.secondStep(info) : (step == 3 ? scene.thirdStep(info) : '');
				});
			};
			/**
			 * Загрузка текущего состояния, если таковое имеется
			 * @param info - массив сцены
			 */
			scene.loadCurrentState = function(info) {
				var player = info.player,
					hasContract = player.hasContract;
				if (hasContract) {
					// скрываем форму ростелекома
					Rostelekom.set();
				}
			};
			/**
			 * Создание попапов с видео и текстом для сцены
			 * @param info - массив сцены
			 */
			scene.makeInfoPopups = function(info) {
				var tmpl = scene.$.infoPopupsTemplate.html(),
					infopopupsdata = {
						name: info.name,
						id: info.id,
						url: info.video,
						text: info.description
					};
				scene.$.infoPopups.html(_.template(tmpl)(infopopupsdata));
			};
			/**
			 * Построение сердечек с попапами
			 * @param users - данные о персонажах
			 */
			scene.makeHearts = function(users) {
				var tmpl = scene.$.heartsTemplate.html();

				scene.$.hearts.html(_.template(tmpl)(users));

				scene.makePopoverHandlers(users);
			};
			/**
			 * Построение заголовка игры(шаблонизация)
			 * @param data - инфо для заголо
			 */
			scene.makeHeaders = function(data) {
				var tmpl = scene.$.headerTemplate.html();

				scene.$.header.html(_.template(tmpl)(data));
			};
			/**
			 * Скрытие формы выбора черт персонажа и вывод результатов ответа пользователя после запроса
			 * @param form - форма ответов
			 * @param data - данные, пришедшие из формы
			 */
			scene.makeTraitsResult = function(form, data) {
				var $results = $(form).parent().siblings('[data-personage-result]'),
					$traits = $results.find('.trait'),
					incorrect = data.incorrectTraitIds,
					correct = data.correctTraitIds,
					score = data.userScore;
				
				UserScore.set(score);

				$(form).parent().fadeOut(500, function() {
					$(form).find('[data-nicescroll-block]').niceScroll().remove();
					$results.fadeIn(200);
				});

				$traits.each(function(i, trait) {
					var id = parseInt($(trait).attr('data-trait-id')),
						$placeholder = $(trait).find('[data-trait-result]'),
						resultHtml = "";

					if ( ($.inArray(id, incorrect) + 1)){
						//means this value is incorrect
						resultHtml = '<i class="icon icon-minus"></i>';
						
					} else if (($.inArray(id, correct) + 1)){
						//means this value is correct
						resultHtml = '+1'; //if some else value requred, change here!!!!
					}
					$placeholder.html(resultHtml);
				});
			};
			/**
			 * Построение маленьких поповеров у сердечек
			 * @param users
			 */
			scene.makePopoverHandlers = function(users) {

				$('[data-popover-webui]').each(function(i, link) {
					var $link = $(link),
						id = $link.attr('data-target');
					$link.webuiPopover({
						url: id,
						placement: 'auto-right',
						onShow: function($element) {

							var $content = $element.find('[data-nicescroll-block]');
							$content.addClass('nicescroll-on').niceScroll(/*'.nicescroll-on p',*/ {
								'cursorcolor': '#00abe8',
								'cursorwidth': 12,
								'cursorborder': '0',
								'cursorborderradius': 12,
								'autohidemode': false
							});
						},
						onHide: function($element) {

							var $content = $element.find('[data-nicescroll-block]');
							$content.hasClass('nicescroll-on') && $content.niceScroll().remove();
						}
					});
				});
				$(document).on('click', '[data-goto-choose]', function() {
					var $this = $(this),
						$startContent = $this.parent();//.find('[data-start-content]'),
					$form = $startContent.siblings('[data-personage-choose]');
					$startContent.fadeOut(500, function() {
						$form.fadeIn(200);
					});
				});

				scene.checkboxLimiting('[data-personage-choose] input[type=checkbox]');


				$('[data-personage-choose]').each(function(i, element) {
					$(element).find('form').validate({
						submitHandler: function(form) {
							//var dd = $.Deferred();

							var guessedTraits = [];
							var characterId = $(form).find('input[name="characterid"]').val();
							var $checkboxes = $(form).find('input[type="checkbox"]:checked');
							if ($checkboxes.length) {
								$checkboxes.each(function(i, checkbox) {
									guessedTraits.push($(checkbox).val());
								});
							}

							guessedTraits = guessedTraits.join(',');


							$.ajax({
								url: scene.urls.guessCharTraits,
								method: 'POST',
								data: {
									"character-id": characterId,
									"trait-ids": guessedTraits
								},
								dataType: 'json',
								success: function(data) {
									scene.makeTraitsResult(form, data);
								},
								error: function(data) {
									scene.sayError(data, '[data-personage-choose]', '[data-personage-error]');
								}
							});
							return false;
						}
					})
				})

			};
			/**
			 * Построение блока выбора черт пользователя
			 ** @param info - данные сцены
			 */
			scene.makeUserTraits = function(info) {
				var tmpl = scene.$.userTraitsTemplate.html(),
					data = {
						traits: info.traits
					};
					console.log(data);
				scene.$.userTraits.html(_.template(tmpl)(data));
				$('#user-panel').on('shown.bs.collapse',function() {
					$('.a-user-choose .traits').addClass('nicescroll-on').niceScroll({
						'cursorcolor': '#00abe8',
						'cursorwidth': 12,
						'cursorborder': '0',
						'cursorborderradius': 12,
						'autohidemode': false
					});
				}).on('hidden.bs.collapse',function() {
					$('.a-user-choose .traits').niceScroll().remove();
				});

				$(document).on('click','[data-goto-selfchose]',function(e) {
					e.preventDefault();
					$('[data-self-start]').fadeOut(500, function() {
						$('[data-self-choose]').fadeIn(200);
					});
				});

				scene.checkboxLimiting('[data-self-choose] input[type=checkbox]');

				$('[data-self-choose]').find('form').validate({
					submitHandler: function(form) {
						//var dd = $.Deferred();

						var userTraits = [],
							userTraitsData = "";

						var $checkboxes = $(form).find('input[type="checkbox"]:checked');
						if ($checkboxes.length) {
							$checkboxes.each(function(i, checkbox) {
								userTraits.push(parseInt($(checkbox).val()));
							});
						}

						userTraitsData = userTraits.join(',');


						$.ajax({
							url: scene.urls.userSayHimself,
							method: 'POST',
							data: {
								"trait-ids":userTraitsData
							},
							dataType: 'json',
							success: function(data) {
								
								scene.displayUserTraits(form, data, userTraits);
							},
							error: function(data) {
								scene.sayError(data, '[data-self-choose]', '[data-self-error]');
							}
						});
						return false;
					}
				});
			};
			/**
			 * Вывод ошибки
			 * @param data - данные ошибки
			 * @param formblock - блок который надо будет скрыть и открыть еще раз
			 * @param errorblock - блок c ошибкой
			 */
			scene.sayError = function(data, formblock, errorblock) {

				var error = data.error ? data.error : 'Произошла ошибка!';

				$(formblock).fadeOut(500, function() {
					$(errorblock).find('data-head').text(error);
					$(errorblock).fadeIn(200);
				});
				$(document).on('click', '[data-again]', function(e) {
					e.preventDefault();
					$(errorblock).fadeOut(500,function() {
						$(formblock).fadeIn(200);
					});
				});
			};
			/**
			 * Отслеживание чекбоксов, чтобы было выбрано 5, не больше
			 * @param checkbox - строка с селектором чекбокса
			 */
			scene.checkboxLimiting = function(checkbox) {
				var $form = $(checkbox).parents('form'),
					$submit = $form.find('[type="submit"]');
				$submit.attr('disabled',true);
				$(document).on('click', checkbox, function() {
					var $checked = $(checkbox + ':checked');
					var bol = $checked.length >= scene.MAXCHECKEDTRAITS;
					$(checkbox).not(":checked").attr("disabled", bol);

					$submit.attr('disabled', ($checked.length < scene.MAXCHECKEDTRAITS) );
				});
			};
			/**
			 * Вывод и отображение характеристик юзера после отправки
			 * @param form - форма
			 * @param data - данные ответа
			 * @param userTraits - выбранные пользователем черты
			 */
			scene.displayUserTraits = function(form, data, userTraits){
				var $userResult = $('[data-self-result]');

				var $traits = $userResult.find('.trait');
				$traits.each(function(i, trait) {
					var id = parseInt($(trait).attr('data-trait-id'));

					if ( !($.inArray(id, userTraits) + 1)){
						//means this value was chosen
						$(trait).hide();
					}
				});

				$(form).parent().fadeOut(500, function() {
					$userResult.fadeIn(200);
				});
			};
			/**
			 * Первый шаг игры
			 * @param info - массив сцены
			 */
			scene.firstStep = function(info) {
				var headers = {
					id: info.id,
					name: info.name
				};
				scene.makeHeaders(headers);
				scene.makeInfoPopups(info);
			};
			/**
			 * Второй шаг игры
			 * @param info - массив сцены
			 */
			scene.secondStep = function(info) {
				var data = {
					scene: info.code,
					users: info.characters,
					traits: info.traits
				};


				scene.makeHearts(data);


				//show next explain block
				scene.$.header.find('.explain.active').fadeOut(500, function() {
					scene.$.header.find('.explain.active').removeClass('active');
					scene.$.header.find('.explain').eq(1).fadeIn(200).addClass('active');
				});
			};
			scene.thirdStep = function() {

			};

			return {
				init: function() {
					load();

				}
			}
		})()
		,Rostelekom = (function() {
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
					var score = $.parseJSON(data).userScore;
					UserScore.set(score);

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


			return{
				set : function(){
						// $('.a-user-agreement__text, #agreement-offer').hide();
						// $('#agreement-success').show();
				},
				init: function() {

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
		, UserScore = (function() {
			var set = function(n) {
				console.log(n);
				$('.a-user-info__points').text(n);
			};
			return {
				set: set
			}
		})()
	/**
	 * Dummy Module Example
	 */
		, DummyModule = (function() {
			return {
				init: function() {
					// do something
				}
			}
		})()

		;
	App.init();

});

