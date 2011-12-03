/*globals $ window document */

$(function () {
	var s = null,

		AnimationFillCode = {
			settings : {
				field: $('#code')[0],
				btn: $('#submit')[0],
				currentValue: null,
				mwValue: null,
				sValue: null,
				complete: "",
				startWith: null,
				atValue: null,
				fieldValue: null,
				phMessage: 'Paste your -webkit- or -moz- CSS3 keyframe animations code here, then press the \'Fill My Animation Code\' button to fill in the equivalent other code, including standard syntax.',
				helpBtn: null,
				demoBtn: null,
				closeHelp: null,
				closeDemo: null,

				venStart: '',
				venEnd: '',
				venStartRegEx: null,
				venEndRegEx: null,
				myChunkCode: null,
				myBrackets: [],
				myBracketBreak: [],
				myBrackets2: [],
				venProps: '',
				venProps2: '',
				venPropsS: '',
				myAnimChunk: '',

				helpContent: $('#helpContent')[0],
				demoContent: $('#demoContent')[0],
				hGroup: $('hgroup')[0],
				error: $('#error')[0],
				congrats: $('#congrats')[0],
				errorMsg1: '<p>Trigger happy much? Enter some code before submitting.</p>',
				errorMsg2: '<p>Are you sure that\'s CSS3 animation code? That code is whack. Try again.</p>',
				errorMsg3: '<p>It looks like this code already has all the necessary syntax. Make sure you paste only WebKit or only Mozilla, and then select the correct option.</p>',
				congratsMsg: '<p>Your animation code has been filled! &nbsp; &nbsp; <a href="#" onclick="selectText(); return false;">Click to Select Text</a></p>',
				speed: 1000,
				foo: 'bar'
			},

			init: function () {

				s = this.settings;

				$(s.helpContent).append('<a href="#" class="closeHelp" id="closeHelp">X</a>');
				$('<div class="top-box" id="error"></div>').insertAfter(s.helpContent);
				$('<div class="top-box" id="congrats"></div>').insertAfter(s.helpContent);
				$('<a href="#" class="help" id="btnHelp" title="What is this Tool?">?</a>').insertAfter(s.hGroup);

				$(s.demoContent).append('<a href="#" class="closeHelp" id="closeDemo">X</a>');
				$('<div class="top-box" id="error"></div>').insertAfter(s.demoContent);
				$('<div class="top-box" id="congrats"></div>').insertAfter(s.demoContent);
				$('<a href="http://www.youtube.com/watch?v=araO0Vli-j4" class="play" id="btnDemo">Play</a>').insertAfter(s.hGroup);
				$('.top-box').slideUp(0);

				$(s.btn).bind('click', function () {
					if (!$(s.field).val() || $(s.field).val() === s.phMessage) {
						AnimationFillCode.doErrorMsg(1);
					} else {
						s.currentValue = $(s.field).val();
						AnimationFillCode.doCheckCode();
					}
				});

				//if (!Modernizr.input.placeholder) {
				this.polyfillPlaceholder();
				//} else {
					//this.blurCleared();
				//}

				this.doHelpButton();
				this.doDemoButton();
			},

			doCheckCode: function () {
				s = this.settings;

				s.startWith = $('input:radio[name=startWith]:checked').val();

				if (s.startWith === 'wk') {
					s.atValue = '@-moz-keyframes';
				} else {
					s.atValue = '@-webkit-keyframes';
				}

				if (s.currentValue.search(s.atValue) === -1) {

					if (s.currentValue.search('keyframes') !== -1) {

						if (s.currentValue.search('{') !== -1) {
							AnimationFillCode.doFill($(s.field).val(), s.startWith);
						} else {
							AnimationFillCode.doErrorMsg(2);
						}

					} else {
						AnimationFillCode.doErrorMsg(2);
					}

				} else {
					AnimationFillCode.doErrorMsg(3);
				}
			},

			doFill: function (val, ven) {
				s = this.settings;
				$(s.helpContent).slideUp(s.speed);
				
				s.myChunkCode = val.replace(/@-/g, "||||@-");
				s.myChunkCode = s.myChunkCode.replace(/}\s*}/g, "||||}\n\n}");
				s.myChunkCode = s.myChunkCode.split("||||");

				if (ven === 'wk') {
					s.venStart = "-webkit-";
					s.venEnd = "-moz-";
					s.venStartRegEx = new RegExp("@" + s.venStart + "keyframes","g");
					s.venEndRegEx = "@" + s.venEnd + "keyframes";
				} else {
					s.venStart = "-moz-";
					s.venEnd = "-webkit-";
					s.venStartRegEx = new RegExp("@" + s.venStart + "keyframes","g");
					s.venEndRegEx = "@" + s.venEnd + "keyframes";
				}

				// complete code, broken up here
				for (var i = 0; i < s.myChunkCode.length; i += 1) {
				
					if (s.myChunkCode[i].indexOf("@-") === -1) {
						
						s.myBrackets = s.myChunkCode[i].replace(/{/g, "||||{");
						s.myBrackets = s.myBrackets.replace(/}/g, "||||}");
						s.myBrackets = s.myBrackets.split("||||");
						
						for (var j = 0; j < s.myBrackets.length; j += 1) {

							if (s.myBrackets[j].indexOf(s.venStart + "animation") !== -1) {

								// do stuff with the vendor properties here
								
								s.myBrackets2 = s.myBrackets[j].split(";");
								
								for (var k = 0; k < s.myBrackets2.length; k += 1) {

									if (s.myBrackets2[k].indexOf(s.venStart + "animation") !== -1) {
										s.venProps += s.myBrackets2[k].replace(s.venStart + "animation", s.venEnd + "animation") + ";";
										s.venProps2 += s.myBrackets2[k].replace(s.venStart + "animation", "-ms-" + "animation") + ";";
										s.venPropsS += s.myBrackets2[k].replace(s.venStart + "animation", "animation") + ";";
									}

								}
								
								s.myBrackets[j] = s.myBrackets[j] + s.venProps.replace("{", "") + "\n" + s.venProps2.replace("{", "") + "\n" + s.venPropsS.replace("{", "") + "\n";

								s.venProps = "";
								s.venProps2 = "";
								s.venPropsS = "";
								
							}

						}

						s.myChunkCode[i] = s.myBrackets.join('');

					} else {

						s.myAnimChunk = s.myChunkCode[i].replace(s.venStartRegEx, s.venEndRegEx);
						s.myAnimChunk = s.myAnimChunk + "}\n\n}\n\n" + s.myChunkCode[i].replace(s.venStartRegEx, "@-ms-keyframes");
						s.myAnimChunk = s.myAnimChunk + "}\n\n}\n\n" + s.myChunkCode[i].replace(s.venStartRegEx, "@keyframes");
						s.myChunkCode[i] = s.myChunkCode[i] + "}\n\n}\n\n" + s.myAnimChunk;
						
					}

				}

				s.complete = s.myChunkCode.join('');

				$(s.field).val(s.complete);
				s.complete = "";
				this.doCongrats();
			},

			polyfillPlaceholder: function () {

				s = this.settings;
				$(s.field).addClass('ph');

				$(s.field).val(s.phMessage);

				s.fieldValue = $(s.field).val;
				$(s.field).focus(function () {
					if ($(s.field).val() === s.phMessage) {
						$(s.field).val('');
						$(s.field).removeClass('ph');
					}
				});

				$(s.field).blur(function () {
					if ($(s.field).val() === '') {
						$(s.congrats).slideUp(s.speed);
						$(s.field).val(s.phMessage);
						$(s.field).addClass('ph');
					}
				});

			},

			blurCleared: function () {

				s = this.settings;

				$(s.field).blur(function () {
					if ($(s.field).val() === '') {
						$(s.congrats).slideUp(s.speed);
					}
				});

			},

			doHelpButton: function () {

				s = this.settings;
				s.error = $('#congrats')[0];
				s.closeHelp = $('#closeHelp')[0];
				s.helpBtn = $('#btnHelp')[0];

				$(s.helpBtn).bind('click', function () {
					$(s.helpContent).slideToggle(s.speed);
					$(s.demoContent).slideUp(s.speed);
					$(s.congrats).slideUp(s.speed);
					AnimationFillCode.removeError();
					return false;
				});

				$(s.closeHelp).bind('click', function () {
					$(s.helpContent).slideUp(s.speed);
					$(s.demoContent).slideUp(s.speed);
					$(s.congrats).slideUp(s.speed);
					AnimationFillCode.removeError();
					return false;
				});

			},
			
			doDemoButton: function () {
				s = this.settings;
				s.error = $('#congrats')[0];
				s.closeDemo = $('#closeDemo')[0];
				s.demoBtn = $('#btnDemo')[0];
				
				$(s.demoBtn).bind('click', function () {
					$(s.demoContent).slideToggle(s.speed);
					$(s.helpContent).slideUp(s.speed);
					$(s.congrats).slideUp(s.speed);
					AnimationFillCode.removeError();
					return false;
				});
				
				$(s.closeDemo).bind('click', function () {
					$(s.helpContent).slideUp(s.speed);
					$(s.demoContent).slideUp(s.speed);
					$(s.congrats).slideUp(s.speed);
					AnimationFillCode.removeError();
					return false;
				});
			},

			doErrorMsg: function (e) {

				s = this.settings;
				s.error = $('#error')[0];
				s.congrats = $('#congrats')[0];

				$(s.helpContent).slideUp(s.speed);
				$(s.congrats).slideUp(s.speed);

				switch (e) {
				case 1:
					$(s.error).html(s.errorMsg1);
					break;

				case 2:
					$(s.error).html(s.errorMsg2);
					break;

				case 3:
					$(s.error).html(s.errorMsg3);
					break;
				}

				$(s.error).slideDown(s.speed);

				$(s.field).focus(function () {
					AnimationFillCode.removeError();
				});

			},

			doCongrats: function (e) {

				s = this.settings;
				s.error = $('#error')[0];
				s.congrats = $('#congrats')[0];

				$(s.error).slideUp(s.speed);
				$(s.congrats).html(s.congratsMsg);
				$(s.congrats).slideDown(s.speed);
			},

			removeError: function () {

				s = this.settings;
				s.error = $('#error')[0];

				$(s.error).slideUp(s.speed);

			}

		};

	AnimationFillCode.init();

});

function selectText () {
	$('#code').select();
}