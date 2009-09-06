var PassGen = Class.create({
	initialize: function() {
		// Ambiguous letters have been removed
		
		/*
		
		this.lowerCaseList = [
								"a", "b", "c", "d", "e", "f", "g", "h",
								"i", "j", "k", "l", "m", "n", "o", "p",
								"q", "r", "s", "t", "u", "v", "w", "x",
								"y", "z"
		];
		
		this.upperCaseList = [
								"A", "B", "C", "D", "E", "F", "G", "H",
								"I", "J", "K", "L", "M", "N", "O", "P",
								"Q", "R", "S", "T", "U", "V", "W", "X",
								"Y", "Z"
		];
		
		this.numberList = [
								"0", "1", "2", "3", "4", "5", "6", "7",
								"8", "9"
		];
		
		*/
		
		this.lowerCaseList = [
			"a", "b", "c", "d", "e", "f", "g",
			"h", "i", "j", "k", "m", "n", "p",
			"q", "r", "s", "t", "u", "v", "w",
			"x", "y", "z"
		];
		
		this.upperCaseList = [
			"A", "B", "C", "D", "E", "F", "G",
			"H", "J", "K", "L", "M", "N", "P",
			"Q", "R", "S", "T", "U", "V", "W",
			"X", "Y", "Z"
		];
		
		this.numberList = [
			"1", "2", "3", "4", "5", "6", "7",
			"8", "9"
		];
		
		this.symbolList = [
			"!", "@", "#", "$", "%", "^", "&", "*",
			"(", ")", "?"
		];
		
		this.defaultOpts = {
			passLength: 8,
			symbols: false,
			mixedCase: false,
			numbers: true
		}
		
		//this.firstPass = generate(options)
	},
	
	generate: function(options) {
		if (options == null) {
			options = this.defaultOpts;
		}
		var passLength = options.passLength;
		var symbols = options.symbols;
		var mixedCase = options.mixedCase;
		var numbers = options.numbers;
		var newPass = "";
		var pickList = this.lowerCaseList.clone();
		
		if (passLength == 0) {
			return "";
		}
		
		// Process options
		if (symbols === true) {
			pickList = pickList.concat(this.symbolList);
		}
		
		if (mixedCase === true) {
			pickList = pickList.concat(this.upperCaseList);
		}
		
		if (numbers === true) {
			pickList = pickList.concat(this.numberList);
		}
		
		pickList = this.randomizeList(pickList);
		
		//$(logDiv).innerHTML += "<p>Length of pick list is: " + pickList.length + "</p>";
		
		var allGood = false;
	
		do  {
			
			newPass = "";
			var symbolsGood = false;
			var numbersGood = false;
			var mixedCaseGood = false;
			
			for (var i = 0; i < passLength; i++) {
				var randomIndex = this.getRandomNumber(pickList.length);
				newPass = newPass.concat(pickList[randomIndex]);
			}
			
			// Check for symbols
			if (symbols) {
				var testSymbol = null;
				for (var i = 0; i < this.symbolList.length; i++) {
					testSymbol = this.symbolList[i];
					if (newPass.include(testSymbol)) {
						symbolsGood = true;
						break;
					}
				}
			} else {
				symbolsGood = true;
			}
			
			if (numbers) {
				var testNumber = null;
				for (var i = 0; i < this.numberList.length; i++) {
					testNumber = this.numberList[i];
					if (newPass.include(testNumber)) {
						numbersGood = true;
						break;
					}
				}
			} else {
				numbersGood = true;
			}
			
			if (mixedCase) {
				var lowerCaseGood = false;
				var upperCaseGood = false;
				var testLowerLetter = null;
				var testUpperLetter = null;
				
				for (var i = 0; i < this.lowerCaseList.length; i++) {
					testLowerLetter = this.lowerCaseList[i];
					testUpperLetter = this.upperCaseList[i];
					
					if (newPass.include(testLowerLetter)) {
						lowerCaseGood = true;
						if (upperCaseGood) {
							break;
						}
					}
					
					if (newPass.include(testUpperLetter)) {
						upperCaseGood = true;
						if (lowerCaseGood) {
							break;
						}
					}
				}
				
				if (lowerCaseGood && upperCaseGood) {
					mixedCaseGood = true;
				}
				
			} else {
				mixedCaseGood = true;
			}
			
			if (symbolsGood && numbersGood && mixedCaseGood) {
				allGood = true;
			}
			
		} while (!allGood)
		
		return newPass;
	},
	
	getRandomNumber: function(ceiling) {
		//$(logDiv).innerHTML += "<p>Getting a number between 0 and " + (ceiling+1);
		return Math.floor(Math.random() * ceiling);
	},
	
	randomizeList: function(list) {
		var newList = list.clone(); 
		var i = newList.length;
		if (i == 0) {
			return;
		}
		while(--i) {
			var j = Math.floor(Math.random()*(i+1));
			var tmp1 = newList[i];
			var tmp2 = newList[j];
			newList[i] = tmp2;
			newList[j] = tmp1;
		}
		return newList;
	}
	
});