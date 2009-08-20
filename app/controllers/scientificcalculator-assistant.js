var ScientificcalculatorAssistant = Class.create({
	appMenuModel: { visible:true, 
		label: $L('Calculator'), 
		items: [	{label: "About...", command: 'do-aboutCalculator'}, 
		{label: "Preferences", command: 'do-preferences'},
		{label: "Help", command: 'do-help'},
		{label:$L('Edit'), items: [{label:$L('Cut'), command:Mojo.Menu.cutCmd, shortcut:'x', disabled:true},
		{label:$L('Copy'), command:Mojo.Menu.copyCmd, shortcut:'c', disabled:true}, 
		{label:$L('Paste'), command:Mojo.Menu.pasteCmd, shortcut:'v', disabled:true}]
	}
	]
},

initialize : function(calculator) {
	this.calculator = calculator;
},

setup: function() {
	this.setupTapHandlers();
	this.setupKeyHandlers();
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems:true}, this.appMenuModel);
},
setupTapHandlers: function() {		
	// event handling FTW!		
	$('scientificcalculator-main').observe(Mojo.Event.tap, this.onTap.bindAsEventListener(this));
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
		$('infoline').innerHTML = $('infoline').innerHTML = Utils.renderStackInfo(this.calculator.Stack.cards);
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
			this.controller.serviceRequest("palm://com.palm.vibrate", {
				method: 'vibrate', parameters: { 'period': 0,'duration': 50 }
			});
		}
	}		
},

onTap: function(event) {
	if(event.element().className.indexOf('button') < 0) {
		return;
	}
	var tappedButton = event.element().id;
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