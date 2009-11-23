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
		value: Passify.prefs.keepHistory
		//trueLabel: "Yes",
		//falseLabel: "No"
	};
	this.controller.setupWidget("keepHistoryTB", this.keepHistoryTBAttrs, this.keepHistoryTBModel);
	
	// historySizeLS
	this.historySizeLSAttrs = {
		label: "Passwords in History",
		// labelPlacement: Mojo.Widget.labelPlacementLeft,
		multiline: true
	};
	/*
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
	*/
	
	// Pass Length IP
	this.historySizeIPAttrs = {
		label: " ",
		min: 1,
		max: 20,
		disabled: true
	};
	this.historySizeIPModel = {
		value: Passify.prefs.passHistorySize
	};
	this.controller.setupWidget("historySizeIP",	this.historySizeIPAttrs,	this.historySizeIPModel);
	
	// Hist Prefs Drawer
	this.histPrefsDrawerAttrs = {
		
	};
	this.histPrefsDrawerModel = {
		open: Passify.prefs.keepHistory
	};
	this.controller.setupWidget("histPrefsDrawer",	this.histPrefsDrawerAttrs,	this.histPrefsDrawerModel);
	this.drawer = this.controller.get("histPrefsDrawer");
	
	// Setup listeners
	Mojo.Event.listen(this.controller.get("keepHistoryTB"), Mojo.Event.propertyChange, this.keepHistoryChangeHandler.bind(this));
	Mojo.Event.listen(this.controller.get("historySizeIP"), Mojo.Event.propertyChange, this.historySizeChangeHandler.bind(this));
	
}

PrefsAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}

PrefsAssistant.prototype.deactivate = function(event) {
	if (!Passify.prefs.keepHistory) {
		Passify.passHistory.clear();
	}
	
	if (Passify.prefs.passHistorySize < Passify.passHistory.length) {
		Passify.passHistory = Passify.passHistory.slice(0, Passify.prefs.passHistorySize + 1);
	}
}

PrefsAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get("keepHistoryTB"), Mojo.Event.propertyChange, this.keepHistoryChangeHandler.bind(this));
	Mojo.Event.stopListening(this.controller.get("historySizeLS"), Mojo.Event.propertyChange, this.historySizeChangeHandler.bind(this));
}

PrefsAssistant.prototype.keepHistoryChangeHandler = function(event) {
	// Do not clear the password history here in case the user changes their mind
	if (event.value === false) {
		//this.historySizeLSModel.disabled = true;
		this.controller.modelChanged(this.historySizeLSModel, this);	
	} else {
		//this.historySizeLSModel.disabled = false;
		this.controller.modelChanged(this.historySizeLSModel, this);
	}
	this.toggleDrawer(event);
	Passify.prefs.keepHistory = event.value;
}

PrefsAssistant.prototype.historySizeChangeHandler = function(event) {
	Mojo.Log.info("History size changed: event.value: ", event.value, "event.label: ", event.label);
	Passify.prefs.passHistorySize = parseInt(event.value);
}

PrefsAssistant.prototype.toggleDrawer = function(event) {
	Mojo.Log.info("Toggling drawer");
	this.drawer.mojo.setOpenState(!this.drawer.mojo.getOpenState());
}