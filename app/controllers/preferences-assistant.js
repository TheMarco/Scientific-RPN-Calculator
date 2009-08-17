var PreferencesAssistant = Class.create({

	initialize : function(calculator) {
		this.calculator = calculator;
	},

	setup: function() {
		
		console.log(this.calculator.hapticFeedback + '   ' + this.calculator.displayStack);
		
		var val = 0;
		if(this.calculator.hapticFeedback) {
			val = 1;
		}
		var display = 0;
		if(this.calculator.displayStack) {
			display = 1;
		}		
		this.controller.setupWidget("clearprefs",

		this.attributes = {
			disabledProperty: 'disabled'
		},

		this.model = {
			buttonLabel : "Dismiss",
			buttonClass: '',
			disabled: false
		});

		this.hapticModel = {
			value: val,
			disabled: false
		};
		this.hapticAttributes = {
			choices: [
			{label: "Enabled", value: 1},
			{label: "Disabled", value: 2},
			]
		};
		this.stackDisplayModel = {
			value: display,
			disabled: false
		};

		this.stackDisplayAttributes = {
			choices: [
			{label: "Enabled", value: 1},
			{label: "Disabled", value: 2},
			]
		};

		this.controller.setupWidget("haptictoggle",	this.hapticAttributes, this.hapticModel);		
		this.controller.setupWidget("stacktoggle",	this.stackDisplayAttributes, this.stackDisplayModel);		
		
		this.controller.listen('haptictoggle', Mojo.Event.propertyChange, this.onHapticChange.bindAsEventListener(this));
		this.controller.listen('stacktoggle', Mojo.Event.propertyChange, this.onStackDisplayChange.bindAsEventListener(this));
		this.controller.listen('clearprefs', Mojo.Event.tap, this.onBackClick.bindAsEventListener(this));
	},
	onHapticChange: function() {		
		this.calculator.setHapticPrefs(this.hapticModel.value);
		console.log(this.calculator.hapticFeedback + '   ' + this.calculator.displayStack);
		
	},
	onStackDisplayChange: function() {		
		this.calculator.setStackDisplayPrefs(this.stackDisplayModel.value);
		console.log(this.calculator.hapticFeedback + '   ' + this.calculator.displayStack);
	},
	onBackClick: function(event) {
		this.controller.stageController.popScene();
	}
});