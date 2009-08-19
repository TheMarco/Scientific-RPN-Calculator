var AboutAssistant = Class.create({

	setup: function() {
		this.controller.setupWidget("clearabout",
		this.attributes = {
			disabledProperty: 'disabled'
		},

		this.model = {
			buttonLabel : "Dismiss",
			buttonClass: '',
			disabled: false
		});
		this.controller.listen('clearabout', Mojo.Event.tap, this.onBackClick.bindAsEventListener(this));

	},
	cleanup: function() {
		this.model = null;
		this.attributes = null;
		this.controller.stoplistening('clearabout', Mojo.Event.tap, this.onBackClick);
	}
	onBackClick: function(event) {
		this.controller.stageController.popScene();
	}
});