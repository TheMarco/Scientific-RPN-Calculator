var HelpAssistant = Class.create({

	setup: function() {
		this.listItems = [
			{id: 'c1', label: '1', value: 'Introduction'},
			{id: 'c2', label: '2', value: 'Fundamentals'},
			{id: 'c3', label: '3', value: 'The Stack and Data Storage'},
			{id: 'c4', label: '4', value: 'Numeric Functions'},
			{id: 'c5', label: '5', value: 'Statistics Functions'}
		];

		this.controller.setupWidget("helpcontents",
		this.attributes = {
			itemTemplate: "help/listitem",
			swipeToDelete: false,
			reorderable: false
		},
		this.model = {
			listTitle: 'Help',
			items: this.listItems
		}
	);		
		
	this.controller.listen('helpcontents', Mojo.Event.tap, this.onChapterTap.bindAsEventListener(this));
},
onChapterTap: function(event) {
	var helpPage = event.target.className.replace('title c', '');
	this.controller.stageController.pushScene("help" + helpPage);
},

cleanup: function() {}
});