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
				userSayHimself: "api/user-set-traits/",
				extraRoundUsers: "api/extra-round-get-users/"
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
			scene.$.extraRoundTemplate = $('#extraround-template');
			scene.$.extraRound = $('#extraround-target');
			scene.$.extraUserPopupTemplate = $('#extraround-user-template');
			scene.$.extraUserPopup = $('#extraround-user-popup-target')

			var load = function() {
				$.ajax({
					url: scene.urls.getScene,
					method: 'POST',
					success: scene.success,
					dataType: 'json'
				});
			};
			scene.success = function(data) {
				//console.log('data:',data);
				var info = data.scene;

				scene.makeUserTraits(info);
				scene.firstStep(info);
				scene.loadCurrentState(info);

				$(document).on('click', '[data-to-step="2"]', function() {
					scene.secondStep(info);
				});

				scene.goExtraRound(info);
			};
			/**
			 * Загрузка текущего состояния, если таковое имеется
			 * @param info - массив сцены
			 */
			scene.loadCurrentState = function(info) {
				var player = info.player,
					hasContract = player.hasContract,
					characters = info.characters;

				if (hasContract) {
					// скрываем форму ростелекома, если уже ввели договор
					Rostelekom.set();
				}
				if (player.currentScore){
					// выводим набранные уже очки
					UserScore.set(player.currentScore);
				}
				if (player.currentPlace){
					UserPlace.set(player.currentPlace);
				}

				if (player.traits.length){
					$('[data-self-start]').hide();
					$('.a-user-supergame').show();

					var $selfResult = $('[data-self-result]');

					scene.displayUserTraits($selfResult.find('form'),false, player.traits);
					$selfResult.show();
				}

				if (characters.length){
					scene.secondStep(info);
					var i = 0;
					for(var index in characters) {
						if (characters.hasOwnProperty(index)) {
							var character = characters[index];
							var guessed = character.guessedTraitsByPlayer;

							if (guessed) {
								var id = character.code + '-' + i++,
									correct = guessed.correct,
									incorrect = guessed.incorrect,
									$result = $('#' + id).find('[data-personage-result]'),
									$traits = $result.find('.trait'),
									rightAnswers = correct.length,
									$badge = $('[data-target="#' + id + '"]').find('[data-heart-badge]').text(rightAnswers).show();


								$traits.each(function(i, trait) {
									var id = parseInt($(trait).attr('data-trait-id')),
										$placeholder = $(trait).find('[data-trait-result]'),
										resultHtml = "";

									if (($.inArray(id, incorrect) + 1)) {
										//means this value is incorrect
										resultHtml = '<i class="icon icon-minus"></i>';

									} else if (($.inArray(id, correct) + 1)) {
										//means this value is correct
										resultHtml = '+1'; //if some else value requred, change here!!!!
									}
									$placeholder.html(resultHtml);
								});
								//show chosen block:
								$('#'+id).find('.popover-ui-content').hide();
								$result.show();
							}
						}
					};
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
					score = data.userScore,
					rightAnswers = correct.length,
					blockId = $(form).parents('.popover-ui').attr('id'),
					$badge = $('.heart[data-target="#' + blockId + '"]').find('[data-heart-badge]').text(rightAnswers);

				UserScore.set(score);

				$(form).parent().fadeOut(500, function() {
					$(form).find('[data-nicescroll-block]').niceScroll().remove();
					$results.fadeIn(200);
					$badge.fadeIn(200);
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
					//console.log(data);
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
								"trait-ids" : userTraitsData
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
					$('.a-user-supergame').show();
				});
			};
			
			/**
			 * Создаем попапы для суперигры
			 * @param data - пришедшие данные
			 */
			scene.makeExtraUsers = function(data, info) {
				//make users
				var tmpl = scene.$.extraRoundTemplate.html(),
					d = data,//$.parseJSON(data),
					usersInfo = {
						users : d.users
					};
//				console.log(d, d.users, usersInfo);

				$.each(usersInfo.users, function(index, value) {
					var user = usersInfo.users[index];
					usersInfo.users[index].traits = info.traits;
					if (user.guessedTraits){
						usersInfo.users[index].nopopup = true;
						var correct = user.guessedTraits.correct,
							incorrect = user.guessedTraits.incorrect;

						usersInfo.users[index].traits.forEach(function(item, i, arr) {
								var id = item.id;
							if (($.inArray(id, incorrect) + 1)) {
								//means this value is incorrect
								item.state = 'incorrect';

							} else if (($.inArray(id, correct) + 1)) {
								//means this value is correct
								item.state = 'correct';
							}
						});
					} else {
						usersInfo.users[index].nopopup = false;
					}
				});
				var slides = _.template(tmpl)(usersInfo);
				$.each($(slides), function(i, slide) {
					var $content = $(slide).find('[data-nicescroll-block]'),
						$inner = $content.find('[data-nicescroll-inner]');
					$content.addClass('nicescroll-on').niceScroll($inner, {
						'cursorcolor': '#00abe8',
						'cursorwidth': 12,
						'cursorborder': '0',
						'cursorborderradius': 12,
						'autohidemode': false
					});
					$('.users-slider').slick('slickAdd', slide);
				});


				$('.users-slider').promise().done(function(){
					var lastActive = $('.users-slider').find('.slick-active').last().attr('data-slick-index');
					$('.users-slider').slick('goTo', +lastActive + 3);
				});

				//scene.$.extraRound.append(_.template(tmpl)(usersInfo));
				//make users popups
				var tmpl2 = scene.$.extraUserPopupTemplate.html();

				scene.$.extraUserPopup.append(_.template(tmpl2)(usersInfo));

				scene.checkboxLimiting('[data-modal-user-choose] input[type=checkbox]');
				

				$('[data-modal-user-choose]').each(function(i, element) {
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
									console.log('success', data);
									scene.makePersTraitsResult(form, data);
								},
								error: function(data) {
									console.log('error', data);
									scene.sayError(data, '[data-user-traits-choose]', '[data-user-traits-error]');
								}
							});
							return false;
						}
					})
				})


			};
			scene.makePersTraitsResult = function(form, data) {
				var id = $(form).parents('.modal').attr('id'),
					$results = $('[data-id="#' + id + '"]'),
					$traits = $results.find('.trait'),
					incorrect = data.incorrectTraitIds,
					correct = data.correctTraitIds,
					score = data.userScore;

				UserScore.set(score);

				$('#'+id).modal('hide');
				$results.find('[data-user-offer]').hide();
				$results.find('[data-user-result]').show();

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
			scene.getExtraUsers = function(info) {
				$.ajax({
					url     : scene.urls.extraRoundUsers,
					method  : 'POST',
					success : function(data) {
						scene.makeExtraUsers(data, info);
					},
					error: function(data) {
						console.info(data);
						ErrorPopup.show(data.error);
					}
				});
			};
			scene.goExtraRound = function(info) {
				scene.getExtraUsers(info);

				// $('[data-user-arrow="right"]').attr('data-next-users',false);
				var $slider = $('.users-slider');
				$slider.slick({
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: false,
					prevArrow: $('[data-user-arrow="left"]'),
					nextArrow: $('[data-user-arrow="right"]')
				});
				// $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
				// 	console.log(currentSlide,nextSlide);
				// });
				$(document).on('click','[data-user-arrow]',function(e) {
					e.preventDefault();

					var $this = $(this),
						direction = $this.attr('data-user-arrow');
					if (direction == "right") {
						var lastActive = $('.users-slider').find('.slick-active').last().attr('data-slick-index');
						var lastSlide = $('.users-slider').find('.slick-slide').last().attr('data-slick-index');

						if (lastActive == lastSlide ){
							scene.getExtraUsers(info);
							// $('.users-slider').promise().done(function(){
							// 	console.log('ok',lastActive, +lastActive +3);
							// 	$('.users-slider').slick('goTo', +lastActive + 3);
							// });
						}
					}
				});

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
					var score = data.userScore;
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
					$('.a-user-agreement__text').eq(0).hide();
						$('#agreement-offer').hide();
						$('#agreement-success').show();
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
				$('.a-user-info__points').text(n);
			};
			return {
				set: set
			}
		})()
		, UserPlace = (function() {
			var set = function(n) {
				$('.a-user-rating__place').text(n);
			};
			return {
				set: set
			}
		})()
		, ErrorPopup = (function() {
			var error = 'Произошла ошибка. Перезагрузите стараницу и попробуйте еще раз.';
			var show = function(msg) {
				var msg = msg ? msg : error;
				$('#errorModal').find('.modal-body').html(msg);
				$('#errorModal').show();
			};
			return {
				show: show
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

