/*
Copyright 2009-2011 by Marco van Hylckama Vlieg
All Rights Reserved.
License information: http://creativecommons.org/licenses/by-nc-nd/3.0/us/
DO NOT DISTRIBUTE Palm .ipk PACKAGES OF THIS SOFTWARE
*/

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
	},

	onHapticChange: function() {		
		this.calculator.setHapticPrefs(this.hapticModel.value);		
	},

	onStackDisplayChange: function() {		
		this.calculator.setStackDisplayPrefs(this.stackDisplayModel.value);
	},

	onBackClick: function(event) {
		this.controller.stageController.popScene();
	},
	cleanup: function() {
		this.calculator = null;
		this.hapticModel = null;
		this.hapticAttributes = null;
		this.stackDisplayModel = null;
		this.stackDisplayAttributes = null;
		var hapticChangeBind = this.onHapticChange.bindAsEventListener(this);
		var stackDisplayChangeBind = this.onStackDisplayChange.bindAsEventListener(this);
		this.controller.stopListening('haptictoggle', Mojo.Event.propertyChange, hapticChangeBind);
		this.controller.stopListening('stacktoggle', Mojo.Event.propertyChange, stackDisplayChangeBind);
	}
});