function MainAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

MainAssistant.prototype.setup = function() {
	// Setup widgets
	
	// App menu
	this.controller.setupWidget(Mojo.Menu.appMenu, Passify.MenuAttrs, Passify.MenuModel);
	
	// Text Field
	this.passLengthIPAttrs = {
		label: "Password Length",
		min: 4,
		max: 20
	};
	this.passLengthIPModel = {
		value: Passify.passOpts.passLength
	};
	this.controller.setupWidget("passLengthIP",	this.passLengthIPAttrs,	this.passLengthIPModel);
	
	// Check boxes
	// numbersCB
	this.numbersCBAttrs = {};
	this.numbersCBModel = {
		value: Passify.passOpts.numbers
	};
	this.controller.setupWidget("numbersCB", this.numbersCBAttrs, this.numbersCBModel);
	
	// symbolsCB
	this.symbolsCBAttrs = {};
	this.symbolsCBModel = {
		value: Passify.passOpts.symbols
	};
	this.controller.setupWidget("symbolsCB", this.symbolsCBAttrs, this.symbolsCBModel);
	
	// mixedCaseCB
	this.mixedCaseCBAttrs = {};
	this.mixedCaseCBModel = {
		value: Passify.passOpts.mixedCase
	};
	this.controller.setupWidget("mixedCaseCB", this.mixedCaseCBAttrs, this.mixedCaseCBModel);
	
	// Buttons
	// genButton
	this.genButtonAttrs = {};
	this.genButtonModel = {
		label: "Generate",
		buttonClass: "primary float"
	};
	this.controller.setupWidget("genButton", this.genButtonAttrs, this.genButtonModel);

	// copyButton
	this.copyButtonAttrs = {};
	this.copyButtonModel = {
		label: "Copy",
		buttonClass: "secondary float"
	};
	this.controller.setupWidget("copyButton", this.copyButtonAttrs, this.copyButtonModel);

	this.historyButtonAttrs = {};
	this.historyButtonModel = {
		label: "Password History",
		disabled: false
	};
	this.controller.setupWidget("historyButton", this.historyButtonAttrs, this.historyButtonModel);
	
	// Setup listeners
	Mojo.Event.listen(this.controller.get("passLengthIP"), Mojo.Event.propertyChange, this.passLengthChangeHandler.bind(this));
	Mojo.Event.listen(this.controller.get("numbersCB"), Mojo.Event.propertyChange, this.numbersTapHandler.bind(this));
	Mojo.Event.listen(this.controller.get("symbolsCB"), Mojo.Event.propertyChange, this.symbolsTapHandler.bind(this));
	Mojo.Event.listen(this.controller.get("mixedCaseCB"), Mojo.Event.propertyChange, this.mixedCaseTapHandler.bind(this));
	Mojo.Event.listen(this.controller.get("genButton"), Mojo.Event.tap, this.genButtonTapHandler.bind(this));
	Mojo.Event.listen(this.controller.get("copyButton"), Mojo.Event.tap, this.copyButtonTapHandler.bind(this));
	Mojo.Event.listen(this.controller.get("historyButton"), Mojo.Event.tap, this.historyButtonTapHandler.bind(this));
	
	// Generate the initial password
	this.genPass();
}

MainAssistant.prototype.activate = function(event) {
	// If there are no saved passwords or saving passwords is disabled, disable the history button
	if (Passify.passHistory.length === 0) {
		Mojo.Log.info("There are no more history strings. Disabling history button");
		this.historyButtonModel.disabled = true;
		this.controller.modelChanged(this.historyButtonModel, this);
	}
}


MainAssistant.prototype.deactivate = function(event) {

}

MainAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get("passLengthIP"), Mojo.Event.propertyChange, this.passLengthChangeHandler.bind(this));
	Mojo.Event.stopListening(this.controller.get("numbersCB"), Mojo.Event.propertyChange, this.numbersTapHandler.bind(this));
	Mojo.Event.stopListening(this.controller.get("symbolsCB"), Mojo.Event.propertyChange, this.symbolsTapHandler.bind(this));
	Mojo.Event.stopListening(this.controller.get("mixedCaseCB"), Mojo.Event.propertyChange, this.mixedCaseTapHandler.bind(this));
	Mojo.Event.stopListening(this.controller.get("genButton"), Mojo.Event.tap, this.genButtonTapHandler.bind(this));
	Mojo.Event.stopListening(this.controller.get("copyButton"), Mojo.Event.tap, this.copyButtonTapHandler.bind(this));
	
	Passify.passOptsCookie.put(Passify.passOpts);
	Passify.historyCookie.put(Passify.passHistory);
	Passify.prefsCookie.put(Passify.prefs);
	
	/* The emulator has a bug in it that makes it retain cookies after an app delete. Use these to kill the cookies */
	
	/*
	Passify.passOptsCookie.put(undefined);
	Passify.historyCookie.put(undefined);
	Passify.prefsCookie.put(undefined);
	
	Passify.passOptsCookie.remove();
	Passify.historyCookie.remove();
	Passify.prefsCookie.remove();
	*/
}


MainAssistant.prototype.passLengthChangeHandler = function(event) {
	Mojo.Log.warn("passLengthSlider value changed. New value: " + event.value);
	Passify.passOpts.passLength = event.value;
	this.genPass();
}

MainAssistant.prototype.numbersTapHandler = function(event) {
	Passify.passOpts.numbers = event.value;
	this.genPass();
}

MainAssistant.prototype.symbolsTapHandler = function(event) {
	Passify.passOpts.symbols = event.value;
	this.genPass();
}

MainAssistant.prototype.mixedCaseTapHandler = function(event) {
	Passify.passOpts.mixedCase = event.value;
	this.genPass();
}

MainAssistant.prototype.genButtonTapHandler = function(event) {
	this.genPass();
}

MainAssistant.prototype.copyButtonTapHandler = function(event) {
	this.controller.stageController.setClipboard(Passify.currentPass.pass);
}

MainAssistant.prototype.historyButtonTapHandler = function(event) {
	this.controller.stageController.pushScene({name: "history"});
}

MainAssistant.prototype.genPass = function() {
	var newPass = Passify.gen.generate(Passify.passOpts);
	Passify.currentPass = { pass: newPass, escapedPass: newPass.escapeHTML() };
	if (Passify.prefs.keepHistory) {
		Passify.passHistory.unshift(Passify.currentPass);
	}
	//Passify.passHistory.unshift({pass: newPass, escapedPass: newPass.escapeHTML()});
	
	this.controller.get("passField").update(Passify.currentPass.escapedPass);
	
	if (Passify.passHistory.length > Passify.prefs.passHistorySize) {
		Mojo.Log.warn("passHistory too big, removing excess");
		Passify.passHistory = Passify.passHistory.slice(0, Passify.prefs.passHistorySize);
	}
	
	
	//if (this.historyButtonModel.disabled === true) {
	// This one should work better. The password history is cleared when history keeping is disabled
	if (Passify.passHistory.length > 0) {
		this.historyButtonModel.disabled = false;
		this.controller.modelChanged(this.historyButtonModel, this);
	}
	
}