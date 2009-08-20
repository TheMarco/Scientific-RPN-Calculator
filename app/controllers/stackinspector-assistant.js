var StackinspectorAssistant = Class.create({

	initialize : function(calculator) {
		this.calculator = calculator;
	},

	setup: function() {
		this.controller.setupWidget("clearinspector",

		this.attributes = {
			disabledProperty: 'disabled'
		},
		this.model = {
			buttonLabel : "Revert",
			buttonClass: 'secondary',
			disabled: false
		});
		
		this.controller.setupWidget("apply",

		this.attributes = {
			disabledProperty: 'disabled'
		},

		this.model = {
			buttonLabel : "Apply",
			buttonClass: 'primary',
			disabled: false
		});

		this.listItems = [
			{id: 's4', label: 'b', value: this.calculator.Stack.cards[4]},
			{id: 's3', label: 'a', value: this.calculator.Stack.cards[3]},
			{id: 's2', label: 'z', value: this.calculator.Stack.cards[2]},
			{id: 's1', label: 'y', value: this.calculator.Stack.cards[1]},
			{id: 's0', label: 'x', value: this.calculator.Stack.cards[0]}
		];
		this.oldStack = [];
		this.oldStack[0] = this.calculator.Stack.cards[0];
		this.oldStack[1] = this.calculator.Stack.cards[1];
		this.oldStack[2] = this.calculator.Stack.cards[2];
		this.oldStack[3] = this.calculator.Stack.cards[3];
		this.oldStack[4] = this.calculator.Stack.cards[4];

		this.controller.setupWidget("stack",
		this.attributes = {
			itemTemplate: "stackinspector/listitem",
			swipeToDelete: true,
			reorderable: true
		},
		this.model = {
			listTitle: 'Stack Inspector',
			items: this.listItems
		}
	);	
	this.controller.listen('clearinspector', Mojo.Event.tap, this.onBackClick.bindAsEventListener(this));
	this.controller.listen('apply', Mojo.Event.tap, this.onApplyClick.bindAsEventListener(this));			
	this.controller.listen('stack', Mojo.Event.listReorder, this.onStackChange.bind(this));
},
onStackChange: function(event) {
	var newstack = [];
	for(i=0;i<5;i++) {
		newstack[i] = this.listItems[i].value;
	}
	this.controller.modelChanged(this.listItems, this);
	var list = new List(newstack);
	list.remove(event.fromIndex);
	list.add(this.listItems[event.fromIndex].value, event.toIndex);
	this.calculator.Stack.update(list['$_$']);
	this.calculator.operationDone = 1;
	this.calculator.displayBuffer = list['$_$'][4];
	$('firstline').innerHTML = Utils.renderDisplay(list['$_$'][4]);
	if(this.calculator.displayStack) {
		$('infoline').innerHTML = $('infoline').innerHTML = Utils.renderStackInfo(this.calculator.Stack.cards);
	}
	else {
		$('infoline').innerHTML = '';
	}
},
onBackClick: function(event) {
	this.calculator.Stack.cards = this.oldStack;
	$('firstline').innerHTML = Utils.renderDisplay(this.oldStack[0]);
	this.calculator.enterPressed = false;
	this.controller.stageController.popScene();
},
onApplyClick: function(event) {
	this.controller.stageController.popScene();
	this.calculator.enterPressed = true;
},
cleanup: function() {
	this.calculator = null;
	this.listItems = null;
	this.oldStack = null;
	this.controller.stopListening('clearinspector', Mojo.Event.tap, this.onBackClick);
	this.controller.stopListening('apply', Mojo.Event.tap, this.onApplyClick);
	this.controller.stopListening('stack', Mojo.Event.listReorder, this.onStackChange);
	}
});