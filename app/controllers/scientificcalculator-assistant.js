/*
Copyright 2009 by Marco van Hylckama Vlieg
All Rights Reserved.
License information: http://creativecommons.org/licenses/by-nc-nd/3.0/us/
DO NOT DISTRIBUTE Palm .ipk PACKAGES OF THIS SOFTWARE
*/

var ScientificcalculatorAssistant = Class.create({
	appMenuModel: { visible:true, 
		label: $L('Calculator'), 
		items: [	
		{label:$L('Edit'), items: [{label:$L('Cut'), command:Mojo.Menu.cutCmd, shortcut:'x', disabled:true},
		{label:$L('Copy'), command:Mojo.Menu.copyCmd, shortcut:'c', disabled:true}, 
		{label:$L('Paste'), command:Mojo.Menu.pasteCmd, shortcut:'v', disabled:true}]},
		{label: "About", command: 'do-aboutCalculator'}, 
		{label: "Preferences...", command: 'do-preferences'},
		{label: "Help", command: 'do-support'}
	]
	},

	initialize : function(calculator) {
		this.calculator = calculator;
	},
	
	setFS : function(val) {
		if(val) {
			this.controller.enableFullScreenMode(true);
		}
		else {
			this.controller.enableFullScreenMode(false);			
		}
	},
	
	
	setup: function() {
		this.setupTapHandlers();
		this.setupKeyHandlers();
		this.setupResizeHandler();
		this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems:true}, this.appMenuModel);
		this.onWindowResize();
		$('firstline').innerHTML = Utils.renderDisplay('0');
	},
	cleanup: function() {
		this.calculator = null;
		var tapBind = this.onTap.bindAsEventListener(this);
		var mouseDownBind = this.onMouseDown.bindAsEventListener(this);
		var keyDownBind = this.onKeyDown.bindAsEventListener(this);
		Mojo.Event.stopListening(this.controller.window, 'resize', this.onWindowResize);
		Mojo.Event.stopListening($('scientificcalculator-main'), Mojo.Event.tap, tapBind);
		Mojo.Event.stopListening($('scientificcalculator-main'), 'mousedown', mouseDownBind);
		Mojo.Event.stopListening($('scientificcalculator-main'), 'mousedown', mouseDownBind);
		Mojo.Event.stopListening(this.controller.document, "keydown", keyDownBind);
	},
	setupResizeHandler: function() {
		Mojo.Event.listen(this.controller.window, 'resize', this.onWindowResize);
	},
	onWindowResize: function() {
		if(window.innerHeight === 452) {
			$('scientificcalculator-main').removeClassName('resized');
			$('toprow').removeClassName('tophidden');
		}
		else {
			if(window.innerHeight === 390) {
				$('scientificcalculator-main').addClassName('resized');
				$('toprow').addClassName('tophidden');
			}
			else {
				$('scientificcalculator-main').addClassName('resized');
				$('toprow').removeClassName('tophidden');
			}
		}
	},
	setupTapHandlers: function() {		
		// event handling FTW!		
		Mojo.Event.listen($('scientificcalculator-main'), Mojo.Event.tap, this.onTap.bindAsEventListener(this));		
		Mojo.Event.listen($('scientificcalculator-main'), 'mousedown', this.onMouseDown.bindAsEventListener(this));
	},

	setupKeyHandlers: function() {
		Mojo.Event.listen(this.controller.document, "keydown", this.onKeyDown.bindAsEventListener(this), true);
	},
	onKeyDown: function(event) {
		if(Calculator.keyMap[event.keyCode] !== undefined) {
			$('firstline').innerHTML = Utils.renderDisplay(this.calculator.doCommand(Calculator.keyMap[event.keyCode]));
		}		
		if(this.calculator.displayStack) {
			$('infoline').innerHTML = Utils.renderStackInfo(this.calculator.Stack.cards);
		}
		else {
			$('infoline').innerHTML = '';
		}
		return true;
	},

	onMouseDown: function(event) {
		if(event.element().className.indexOf('button') < 0) {
			return;
		}
		else {
			if(this.calculator.hapticFeedback !== false) {
				
				// Dear Palm, I'd love to be able to use the method below
				// However it only works when the app ID is in com.palm.app.* format
				// which is not allowed for developers to use.
				// please enable this for regular use!
				
				//this.controller.serviceRequest("palm://com.palm.vibrate", {
				//	method: 'vibrate', parameters: { 'period': 0,'duration': 50 }
				//});
				
				this.controller.serviceRequest('palm://com.palm.audio/systemsounds', {
				 method:"playFeedback",
				 parameters:{'name': 'down2'},
				 onSuccess:{},
				 onFailure:{}
				 });
			}
		}		
	},

	onTap: function(event) {
		if(event.element().className.indexOf('button') < 0) {
			return;
		}
		var tappedButton = event.element().id;
		
		if (tappedButton == 'hyp') {
			if(this.calculator.mode_g == true) {
				if(this.calculator.fullscreen) {
					this.controller.enableFullScreenMode(false);
					this.calculator.fullscreen = false;
					$('scientificcalculator-main').removeClassName('fs');
				}
				else {
					this.controller.enableFullScreenMode(true);
					this.calculator.fullscreen = true;
					$('scientificcalculator-main').addClassName('fs');
				}
			}			
		}
		
		if (tappedButton === '') {return;}
		var out = this.calculator.doCommand(tappedButton);

		if(out === 'COMMAND-CONVERSION') {
			this.controller.stageController.pushScene("conversion", this.calculator);
			return true;
		}
		if(out === 'COMMAND-STACKINSPECTOR') {
			this.controller.stageController.pushScene("stackinspector", this.calculator);
			return true;
		}
		if(out === 'NOOP') {
			return true;
		}
		else {
			$('firstline').innerHTML = Utils.renderDisplay(out);
			if(this.calculator.convDone === 1) {
				$('infoline').innerHTML = 'Converted from ' + this.calculator.conversionConfig['fromvalue'] + ' to ' + this.calculator.conversionConfig['tovalue'];
				this.calculator.convDone = 0;
			}
			else {
				if(this.calculator.displayStack) {
					$('infoline').innerHTML = $('infoline').innerHTML = Utils.renderStackInfo(this.calculator.Stack.cards);
				}
				else {
					$('infoline').innerHTML = '';
				}
			}
			return true;
		}
	}
});