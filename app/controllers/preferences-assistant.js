var PreferencesAssistant = Class.create({
	
	initialize : function(calculator) {
		this.calculator = calculator;
  	},

	setup: function() {
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
		
		this.controller.setupWidget("haptictoggle",		
					this.attributes = {
		                choices: [
			            {label: "Enabled", value: 1},
			            {label: "Disabled", value: 2},
			            ]
		                },	
		           	this.model = {
						value: val,
						disabled: false
				    });		
		this.controller.setupWidget("stacktoggle",		
					this.attributes = {
		                choices: [
			            {label: "Enabled", value: 1},
			            {label: "Disabled", value: 2},
			            ]
		                },	
		           	this.model = {
						value: display,
						disabled: false
				    });
		this.controller.listen('haptictoggle', Mojo.Event.propertyChange, this.onHapticChange.bindAsEventListener(this));
		this.controller.listen('stacktoggle', Mojo.Event.propertyChange, this.onStackDisplayChange.bindAsEventListener(this));
		this.controller.listen('clearprefs', Mojo.Event.tap, this.onBackClick.bindAsEventListener(this));
	},
	onHapticChange: function() {		
		this.calculator.setHapticPrefs(this.model.value);
	},
	onStackDisplayChange: function() {		
		this.calculator.setStackDisplayPrefs(this.model.value);
	},
	onBackClick: function(event) {
		this.controller.stageController.popScene();
	}
});