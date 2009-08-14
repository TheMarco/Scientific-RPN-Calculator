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
	
	onBackClick: function(event) {
		this.controller.stageController.popScene();
	}
});