// Global Namespace

Passify = { passOpts: {},
			prefs: {}
};

function StageAssistant() {
	Passify.gen = new PassGen();
	Passify.passOpts.passLength = 8;
	Passify.passOpts.numbers = true;
	Passify.passOpts.symbols = false;
	Passify.passOpts.mixedCase = false;
	
	Passify.prefs.keepHistory = true;
	Passify.prefs.passHistorySize = 5;
	
	Passify.currentPass = "";
	Passify.passHistory = [];
	
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
	this.controller.pushScene({	name: "main"});
}
