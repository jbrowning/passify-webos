function PrefsAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

PrefsAssistant.prototype.setup = function() {
	/*
	<div x-mojo-element="ToggleButton" id="keepHistoryTB"></div>
	<div x-mojo-element="IntegerPicker" id="historySizeIP"></div>
	*/
	// Setup Widgets
	
	// keepHistoryTB
	this.keepHistoryTBAttrs = {};
	this.keepHistoryTBModel = {
		value: Passify.prefs.keepHistory,
		trueLabel: "Yes",
		falseLabel: "No"
	};
	this.controller.setupWidget("keepHistoryTB", this.keepHistoryTBAttrs, this.keepHistoryTBModel);
	
	// historySizeIP
	this.historySizeIPAttrs = {
		label: "Passwords in history",
		min: 1,
		max: 20,
	};
	this.historySizeIPModel = {
		value: Passify.prefs.passHistorySize,
		disabled: Passify.prefs.keepHistory
	};
	this.controller.setupWidget("historySizeIP", this.historySizeIPAttrs, this.historySizeIPModel);
	
	// Setup listeners
	Mojo.Event.listen(this.controller.get("keepHistoryTB"), Mojo.Event.propertyChange, this.keepHistoryChangeHandler.bind(this));
	Mojo.Event.listen(this.controller.get("historySizeIP"), Mojo.Event.propertyChange, this.historySizeChangeHandler.bind(this));
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
	Mojo.Event.stopListening(this.controller.get("historySizeIP"), Mojo.Event.propertyChange, this.historySizeChangeHandler.bind(this));
}

PrefsAssistant.prototype.keepHistoryChangeHandler = function(event) {
	if (event.value === false) {
		Passify.passHistory.clear();
		this.controller.get("historySizeRow").visible = false;
		//this.historySizeModel.disabled = true;
		//this.controller.modelChanged(this.historySizeModel, this);
	} else {
		this.controller.get("historySizeRow").visible = true;
		//this.historySizeModel.disabled = false;
		//this.controller.modelChanged(this.historySizeModel, this);
	}
	Passify.prefs.keepHistory = event.value;
}

PrefsAssistant.prototype.historySizeChangeHandler = function(event) {
	Passify.prefs.passHistorySize = event.value;
}