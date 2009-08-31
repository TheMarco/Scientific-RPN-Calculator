/*
Copyright 2009 by Marco van Hylckama Vlieg
All Rights Reserved.
License information: http://creativecommons.org/licenses/by-nc-nd/3.0/us/
DO NOT DISTRIBUTE Palm .ipk PACKAGES OF THIS SOFTWARE
*/

function AppAssistant(appController) {
	this.appController = appController;
}

function StageAssistant(stageController) {
	var queryParams = document.URL.toQueryParams();
	this.stageController = stageController;
	this.calculator = new Calculator();
	this.stageController.pushScene("scientificcalculator", this.calculator);
}

StageAssistant.prototype.handleCommand = function(event) {
	var currentScene = this.controller.activeScene();
	if(event.type == Mojo.Event.command) {
		switch(event.command) {
			case 'do-aboutCalculator':
			this.stageController.pushScene("about");
			break;
			case 'do-support':
			this.stageController.pushScene("support");
			break;
			case 'do-preferences':
			this.stageController.pushScene("preferences", this.calculator);
			break;
			case 'do-backToCalculator':
			this.stageController.popScene("about");
			break;
		}
	}
};