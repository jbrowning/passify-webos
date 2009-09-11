// Global Namespace

var Passify = { passOpts: {},
			prefs: {}
};

function StageAssistant() {
	Passify.versionString = "1.0.0";
	Passify.licenseURL = "http://wiki.github.com/jbrowning/Passify/license-info";
	Passify.gen = new PassGen();
	Passify.passOpts.passLength = 8;
	Passify.passOpts.numbers = true;
	Passify.passOpts.symbols = false;
	Passify.passOpts.mixedCase = false;
	
	Passify.prefs.keepHistory = true;
	Passify.prefs.passHistorySize = 5;
	
	Passify.currentPass = "";
	Passify.passHistory = [];
	
	// Set up app menu
	Passify.MenuAttrs = {omitDefaultItems: true};
	Passify.MenuModel = {
		visible: true,
		items: [
			{label:"About Passify...", command:"do-about"},
			{label:"Preferences...", command: "do-prefs"}
		]
	};
	
	Passify.passOptsCookie = new Mojo.Model.Cookie("passOpts");
	Passify.prefsCookie = new Mojo.Model.Cookie("prefs");
	Passify.historyCookie = new Mojo.Model.Cookie("passHistory");
	
	if (Passify.prefsCookie.get() != undefined) {
		var prefs = Passify.prefsCookie.get();
		Passify.prefs.keepHistory = prefs.keepHistory;
		Passify.prefs.passHistorySize = prefs.passHistorySize; 
	}
	
	if (Passify.passOptsCookie.get() != undefined) {
		var passOpts = Passify.passOptsCookie.get();
		Passify.passOpts.passLength = passOpts.passLength;
		Passify.passOpts.numbers = passOpts.numbers;
		Passify.passOpts.symbols = passOpts.symbols;
		Passify.passOpts.mixedCase = passOpts.mixedCase;
	}
	
	if (Passify.historyCookie.get() != undefined) {
		Passify.passHistory = Passify.historyCookie.get("passHistory");
	}
}

StageAssistant.prototype.setup = function() {
	this.controller.pushScene("main");
}

// Handle app menu commands
StageAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {
		switch(event.command) {
			case "do-prefs":
				this.controller.pushScene("prefs");
				break;
			case "do-about":
				var currentScene = this.controller.activeScene();
				currentScene.showAlertDialog({
					onChoose: function(value) {
						if (value == "license") {
							this.controller.serviceRequest("palm://com.palm.applicationManager", {
							  method: "open",
							  parameters:  {
							      id: 'com.palm.app.browser',
							      params: {
							          target: Passify.licenseURL
							      }
							  }
							});
						}
					},
					title: "Passify v#{version}".interpolate({
						version: Passify.versionString
					}),
					message: "Copyright &copy 2009, Jeff Browning. This application is open-source and is covered by a a BSD-like license.",
					choices: [
						{label: "License Information", value: "license"},
						{label:"OK", value:"ok"}
					]
				});
				break;
		}
	}
}
