function HistoryAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

HistoryAssistant.prototype.setup = function() {

	// Setup Widgets
	
	// App menu
	this.controller.setupWidget(Mojo.Menu.appMenu, Passify.MenuAttrs, Passify.MenuModel);
	
	this.clearButtonAttributes = {};
	this.clearButtonModel = {
		label: "Clear History",
		buttonClass: "negative"
	}
	this.controller.setupWidget("clearButton", this.clearButtonAttributes, this.clearButtonModel);
	
	this.historyListAttributes = {
		listTemplate: 'history/listContainer',
		itemTemplate: 'history/listItem',
		swipeToDelete: false,
		reorderable: false
		
	}
	this.historyListModel = {
		items: Passify.passHistory.slice(1)
	}
	this.controller.setupWidget("historyList", this.historyListAttributes, this.historyListModel);
        
        // Set up listeners
        Mojo.Event.listen(this.controller.get("clearButton"), Mojo.Event.tap, this.clearButtonTapHandler.bind(this));
        Mojo.Event.listen(this.controller.get("historyList"), Mojo.Event.listTap, this.historyListTapHandler.bind(this));
}

HistoryAssistant.prototype.activate = function(event) {
	if (Passify.passHistory.length === 0) {
		this.controller.stageController.popScene();
	}
	
	// We should not display the entire password history. This would include the current password in the history list
	if (this.historyListModel.items.length !== Passify.passHistory.length) {
		this.historyListModel.items = Passify.passHistory.slice(1);
		this.controller.modelChanged(this.historyListModel, this);
	}
}


HistoryAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

HistoryAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get(clearButton), Mojo.Event.tap, this.clearButtonTapHandler.bind(this));
    Mojo.Event.stopListening(this.controller.get(historyList), Mojo.Event.listTap, this.historyListTapHandler.bind(this));
}

HistoryAssistant.prototype.clearButtonTapHandler = function(event) {
	
	Mojo.Log.info("alertChoice value 1 is", this.alertChoice);
	
	this.controller.showAlertDialog({
		onChoose: function(value)
					{
						if (value == "yes") {
							Passify.passHistory.clear();
							this.controller.stageController.popScene();	
						}
						
						this.alertChoice = value;
					},
		title: "Confirm clear history",
		message: "Are you sure you want to clear your password history?",
		choices: [
			{label: "Yes", value:"yes", type:"negative"},
			{label: "No", value:"no"}
		]
	
	});
}

HistoryAssistant.prototype.historyListTapHandler = function(event) {
        Mojo.Controller.stageController.setClipboard(event.item.pass);
}