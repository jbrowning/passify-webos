function PrefsAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

PrefsAssistant.prototype.setup = function() {
	// Setup Widgets
	
	// keepHistoryTB
	this.keepHistoryTBAttrs = {};
	this.keepHistoryTBModel = {
		value: Passify.prefs.keepHistory,
		trueLabel: "Yes",
		falseLabel: "No"
	};
	this.controller.setupWidget("keepHistoryTB", this.keepHistoryTBAttrs, this.keepHistoryTBModel);
	
	Mojo.Log.warn("Passify.prefs.keepHistory value is", Passify.prefs.keepHistory);
	
	// historySizeLS
	this.historySizeLSAttrs = {
		label: "Passwords in History",
		//labelPlacement: Mojo.Widget.labelPlacementLeft,
		multiline: true
	};
	this.historySizeLSModel = {
		value: Passify.prefs.passHistorySize,
		disabled: !Passify.prefs.keepHistory,
		choices: [
			{label: "1", value: 1},
			{label: "2", value: 2},
			{label: "3", value: 3},
			{label: "4", value: 4},
			{label: "5", value: 5},
			{label: "6", value: 6},
			{label: "7", value: 7},
			{label: "8", value: 8},
			{label: "9", value: 9},
			{label: "10", value: 10},
			{label: "11", value: 11},
			{label: "12", value: 12},
			{label: "13", value: 13},
			{label: "14", value: 14},
			{label: "15", value: 15},
			{label: "16", value: 16},
			{label: "17", value: 17},
			{label: "18", value: 18},
			{label: "19", value: 19},
			{label: "20", value: 20}
		]
	};
	this.controller.setupWidget("historySizeLS", this.historySizeLSAttrs, this.historySizeLSModel);
	
	// Setup listeners
	Mojo.Event.listen(this.controller.get("keepHistoryTB"), Mojo.Event.propertyChange, this.keepHistoryChangeHandler.bind(this));
	Mojo.Event.listen(this.controller.get("historySizeLS"), Mojo.Event.propertyChange, this.historySizeChangeHandler.bind(this));
	
}

PrefsAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}

PrefsAssistant.prototype.deactivate = function(event) {
	if (Passify.prefs.passHistorySize < Passify.passHistory.length) {
		Passify.passHistory = Passify.passHistory.slice(0, Passify.prefs.passHistorySize);
	}
}

PrefsAssistant.prototype.cleanup = function(event) {
	//Mojo.Event.stopListening(this.controller.get("copyButton"), Mojo.Event.tap, this.copyButtonTapHandler.bind(this));
	Mojo.Event.stopListening(this.controller.get("keepHistoryTB"), Mojo.Event.propertyChange, this.keepHistoryChangeHandler.bind(this));
	Mojo.Event.stopListening(this.controller.get("historySizeLS"), Mojo.Event.propertyChange, this.historySizeChangeHandler.bind(this));
}

PrefsAssistant.prototype.keepHistoryChangeHandler = function(event) {
	if (event.value === false) {
		this.historySizeLSModel.disabled = true;
		this.controller.modelChanged(this.historySizeLSModel, this);	
	} else {
		this.historySizeLSModel.disabled = false;
		this.controller.modelChanged(this.historySizeLSModel, this);
	}
	Passify.prefs.keepHistory = event.value;
	//this.controller.get("historySizeDrawer").mojo.setOpenState(event.value);
}

PrefsAssistant.prototype.historySizeChangeHandler = function(event) {
	Passify.prefs.passHistorySize = event.value;
}