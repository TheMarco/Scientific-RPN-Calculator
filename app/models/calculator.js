/* Copyright 2009 by Marco van Hylckama Vlieg */

var Calculator = Class.create({
	initialize: function() {
		this.operationDone = 0;
		this.enterPressed = 0;
		this.cmode = 'rad';
		this.displaymode = 'normal';
		this.mode = 'normal';
		this.conversion = '1.0';
		this.mode_f = false;
		this.mode_g = false;
		this.displayBuffer = '';
		this.lastx = null;
		this.stopressed = false;
		this.rclpressed = false;
		this.fixpressed = false;
		this.memoryregisters = {};
		this.statisticsregisters = [];
		this.displayPrecision = 10;
		this.displayMode = 'sci';		
		this.conversionfactor = 1;
		this.convDone = 0;
		this.hapticFeedback = true;
		this.displayStack = true;
		this.conversionConfig = {};
		this.conversionConfig["tofactor"] = 1;
		this.conversionConfig["fromfactor"] = 1;
		this.conversionConfig["tovalue"] = 1;
		this.conversionConfig["fromvalue"] = 1;
		this.conversionConfig["property"] = 'Acceleration';
		this.conversionConfig["propertyindex"] = 0;	
		this.conversionConfig["fromtempincrease"] = 0;
		this.conversionConfig["totempincrease"] = 0;
		this.setupMemDb();
		this.Stack = {
			cards: Array(0,0,0,0,0),
			undostack: Array(0,0,0,0,0),
			update: function(list) {
				this.fillundostack();
				this.cards[0] = list[4];
				this.cards[1] = list[3];
				this.cards[2] = list[2];
				this.cards[3] = list[1];
				this.cards[4] = list[0];
			},
			fillundostack: function() {
				this.undostack[0] = this.cards[0];
				this.undostack[1] = this.cards[1];
				this.undostack[2] = this.cards[2];
				this.undostack[3] = this.cards[3];
				this.undostack[4] = this.cards[4];
			},
			pushX: function() {
				this.fillundostack();
				this.cards[4] = this.cards[3];
				this.cards[3] = this.cards[2];
				this.cards[2] = this.cards[1];
				this.cards[1] = this.cards[0];
			},
			dropOne: function(data) {
				this.fillundostack();
				this.cards[0] = data;
				this.cards[1] = this.cards[2];
				this.cards[2] = this.cards[3];
				this.cards[3] = this.cards[4];
				this.cards[4] = this.cards[3];
			},
			rollUp: function() {
				console.log('rollup');
				this.fillundostack();
				var newStack = [];
				newStack[0] = this.cards[4];
				newStack[1] = this.cards[0];
				newStack[2] = this.cards[1];
				newStack[3] = this.cards[2];
				newStack[4] = this.cards[3];	
				this.cards = newStack;			
			},
			rollDown: function() {		
				console.log('rolldown');		
				this.fillundostack();
				var newStack = [];
				newStack[0] = this.cards[1];
				newStack[1] = this.cards[2];
				newStack[2] = this.cards[3];
				newStack[3] = this.cards[4];
				newStack[4] = this.cards[0];	
				this.cards = newStack;			
			},
			clst: function() {
				this.fillundostack();
				this.cards = Array(0,0,0,0,0);
			},
			swapxy: function() {
				this.undostack = this.cards;
				var temp = this.cards[0];
				this.cards[0] = this.cards[1];
				this.cards[1] = temp;
			},
			undo: function() {
				this.stackDump();
				this.cards[0] = this.undostack[0];
				this.cards[1] = this.undostack[1];
				this.cards[2] = this.undostack[2];
				this.cards[3] = this.undostack[3];
				this.cards[4] = this.undostack[4];
				this.stackDump();
			},
			stackDump: function() {
				var output = 'stack dump: ';
				for(i=0;i<this.cards.length;i++) {
					output = output + ' ' + this.cards[i];
				}
				console.log(output);
			}
		};		
	},

	setHapticPrefs: function(value) {
		if(value) {
			this.hapticFeedback = true;
		}
		else {
			this.hapticFeedback = false;
		}
		this.db.simpleAdd('hapticfeedback', this.hapticFeedback, function(){}, function(){});
	},
	setStackDisplayPrefs: function(value) {
		if(value) {
			this.displayStack = true;
			$('infoline').innerHTML = Utils.renderStackInfo(this.Stack.cards);
		}
		else {
			this.displayStack = false;
			$('infoline').innerHTML = '';			
		}
		this.db.simpleAdd('displaystack', this.displayStack, function(){}, function(){});
	},
	setConversions: function(from, to, property, propertyindex, fromvalue, tovalue) {		
		// deal with unchanged values

		if(property === undefined) {
			property = this.conversionConfig['property'];
		}
		if (fromvalue === undefined) {
			fromvalue = this.conversionConfig['fromvalue'];
		}
		if(tovalue === undefined) {
			tovalue = this.conversionConfig['tovalue'];
		}
		if(!isFinite(from)) {
			from = this.conversionConfig['fromfactor'];
		}
		if(!isFinite(to)) {
			to = this.conversionConfig['tofactor'];
		}

		this.conversionConfig = {};
		this.conversionConfig['fromfactor'] = from;
		this.conversionConfig['tofactor'] = to;
		this.conversionConfig['property'] = property;
		this.conversionConfig['propertyindex'] = propertyindex;
		this.conversionConfig['fromvalue'] = fromvalue;
		this.conversionConfig['tovalue'] = tovalue;
		this.db.simpleAdd("conversionconfig", JSON.stringify(this.conversionConfig), function(){}, function(){});

	},
	addStatItem: function() {
		this.statisticsregisters.push({'valX': this.Stack.cards[0], 'valY': this.Stack.cards[1]});
		this.calculateStatItems();
	},
	removeStatItem: function() {
		var looplength = this.statisticsregisters.length;
		var newRegisters = [];
		for(i=0;i<looplength;i++) {
			if(this.statisticsregisters[i].valX === this.Stack.cards[0] && this.statisticsregisters[i].valY === this.Stack.cards[1]) {
				// do nothing
			}
			else {
				newRegisters.push(this.statisticsregisters[i]);
			}
		}
		this.statisticsregisters = newRegisters;
		this.calculateStatItems();
	},

	calculateStatItems: function() {
		for(i=2;i<8;i++) {
			this.memoryregisters['r' + i] = 0;
		}
		this.memoryregisters['r2'] = this.statisticsregisters.length;
		for(i=0;i<this.statisticsregisters.length;i++) {
			this.memoryregisters['r3'] = this.memoryregisters['r3'] + this.statisticsregisters[i].valX;	
			this.memoryregisters['r4'] = this.memoryregisters['r4'] + (this.statisticsregisters[i].valX * this.statisticsregisters[i].valX);
			this.memoryregisters['r5'] = this.memoryregisters['r5'] + this.statisticsregisters[i].valY;
			this.memoryregisters['r6'] = this.memoryregisters['r6'] + (this.statisticsregisters[i].valY * this.statisticsregisters[i].valY);
			this.memoryregisters['r7'] = this.memoryregisters['r7'] + (this.statisticsregisters[i].valX * this.statisticsregisters[i].valY);	
		}	
		this.db.simpleAdd("memoryregisters", JSON.stringify(this.memoryregisters));
	},

	factorial: function(n) {
		if ((n == 0) || (n == 1))
		return 1;
		else {
			result = (n * this.factorial(n-1) );
			return result;
		}
	},

	resetModes: function() {
		$('mode_g').removeClassName('on');
		$('mode_f').removeClassName('on');
		this.mode_f = false;
		this.mode_g = false;
	},

	getDisplayBuffer: function() {

		var data = this.displayBuffer.toString();
		data = data.replace(new RegExp(/^\./),"");
		data = data.replace(new RegExp(/\.$/),"");	

		if(data.indexOf('e') > -1) {
			return data;
		}

		// remove possible trailing dot

		// deal with rounding better (attempt anyway)

		if(this.operationDone) {	
			if(data === '') {return data;};
			if(this.displayPrecision < 10) {
				data = parseFloat(data).toFixed(this.displayPrecision);
			}
			//data = data.toString();
		}
		return data;

	},

	round: function(number) {
		// try to deal with stupid rounding errors
		return Math.round(parseFloat(number) * Math.pow(10, 10)) / Math.pow(10, 10);
	},


	memToJSON: function() {
		var obj = {};
		for(i=0;i<9;i++) {
			if(this.memoryregisters['r' + i] !== undefined) {
				obj['r' + i] = this.memoryregisters['r' + i];
				entry = {};
			}
		}
		return JSON.stringify(obj);
	},

	handleStorage: function(type) {
		if(this.stopressed) {
			if(type !== 'dot') {
				this.memoryregisters['r' + Calculator.keyStrokes[type]] = this.Stack.cards[0];
				this.db.simpleAdd('memoryregisters', this.memToJSON());
				this.stopressed = false;
				$('mode_sto').removeClassName('on');
			}
			return this.getDisplayBuffer();
		}
		if(this.rclpressed) {
			if(type !== 'dot') {
				if( this.memoryregisters['r' + Calculator.keyStrokes[type]] !== undefined) {
					this.Stack.pushX();
					this.Stack.cards[0] = this.memoryregisters['r' + Calculator.keyStrokes[type]];
					this.displayBuffer = this.Stack.cards[0];
					//this.enterPressed = 1;
				}					
			}
			this.rclpressed = false;
			return this.getDisplayBuffer();
		}
		return 'NOOP';
	},

	handleFIX: function(type) {
		if(this.fixpressed) {
			if(type !== 'dot') {
				this.displayPrecision = Calculator.keyStrokes[type];
			}
			if(type === 'dot') {
				this.displayPrecision = 10;
			}
			this.fixpressed = false;
			$('mode_fix').removeClassName('on');
			return this.displayBuffer;
		}
		else {
			return 'NOOP';
		}
	},

	handleNumbersWithFunctions: function(type) {
		if(type === 'seven' && this.mode_g == true) {
			this.cmode = 'deg';
			this.conversion = Math.PI/180.0;
			this.resetModes();
			$('mode_deg').addClassName('on');
			$('mode_rad').removeClassName('on');
			$('mode_grad').removeClassName('on');
			return this.getDisplayBuffer();
		}

		if(type === 'seven' && this.mode_f == true) {				
			this.Stack.dropOne(this.factorial(this.Stack.cards[1]) / (this.factorial((this.Stack.cards[1] - this.Stack.cards[0]))));
			this.operationDone = 1;
			this.resetModes();
			this.displayBuffer = this.Stack.cards[0];
			return this.getDisplayBuffer();
		}

		if(type === 'eight' && this.mode_g == true) {
			this.cmode = 'rad';
			this.conversion = '1.0';
			this.resetModes();
			$('mode_rad').addClassName('on');
			$('mode_deg').removeClassName('on');
			$('mode_grad').removeClassName('on');
			return this.getDisplayBuffer();
		}

		if(type === 'eight' && this.mode_f == true) {
			this.Stack.dropOne(this.factorial(this.Stack.cards[1]) / (this.factorial(this.Stack.cards[0]) * this.factorial((this.Stack.cards[1] - this.Stack.cards[0]))));
			this.operationDone = 1;
			this.resetModes();
			this.displayBuffer = this.Stack.cards[0];
			return this.getDisplayBuffer();	
		}

		if(type === 'nine' && this.mode_g == true) {
			this.cmode = 'grad';
			this.conversion = Math.PI/200.0;
			this.resetModes();
			$('mode_rad').removeClassName('on');
			$('mode_deg').removeClassName('on');
			$('mode_grad').addClassName('on');
			return this.getDisplayBuffer();
		}
		if(type === 'nine' && this.mode_f == true) {
			// linear regression
			this.calculateStatItems();
			var n = this.memoryregisters['r2'];
			var sxy = this.memoryregisters['r7'];
			var sx = this.memoryregisters['r3'];
			var sy = this.memoryregisters['r5'];
			var sxsquare = this.memoryregisters['r4'];
			var sysquare = this.memoryregisters['r6'];
			//slope
			var m = ((n * sxy) - (sx * sy)) / ((n * sxsquare) - Math.pow(sx,2));
			//y intercept
			var b = (sy - (m * sx)) / n;
			this.Stack.pushX();
			this.Stack.pushX();
			this.Stack.cards[1] = m;
			this.Stack.cards[0] = b;
			this.displayBuffer = this.Stack.cards[0].toString();
			this.operationDone = 1;
			this.resetModes();
			return this.displayBuffer;
		}

		if(type === 'four' && this.mode_g == true) {
			$('mode_fix').addClassName('on');
			$('mode_g').removeClassName('on');
			this.mode_g = false;
			//this.displayBuffer = '';
			this.fixpressed = true;
			return this.displayBuffer;
		}		
		if(type === 'one' && this.mode_g == true) {
			var retval = this.Stack.cards[0].toString(16);
			this.operationDone = 1;
			this.resetModes();
			return retval;
		}
		if(type === 'two' && this.mode_g == true) {
			var retval = this.Stack.cards[0].toString(2);
			this.operationDone = 1;
			this.resetModes();
			return retval;
		}
		if(type === 'three' && this.mode_g == true) {
			var retval = this.Stack.cards[0].toString(8);
			this.operationDone = 1;
			this.resetModes();
			return retval;
		}
		return 'NOOP';
	},

	handleDot: function(type) {
		if(type === 'dot')	{
			if(this.enterPressed) {
				this.enterPressed = false;
				this.Stack.stackDump();
				this.displayBuffer = '0.';
				return this.displayBuffer;
			}

			if(this.operationDone) {
				this.operationDone = false;
				this.Stack.pushX();
				this.displayBuffer = '0.';
				this.Stack.cards[0] = 0;
				this.Stack.stackDump();
				return this.displayBuffer;
			}


			if(this.displayBuffer.toString().length !== 0) { 
				if(this.displayBuffer.toString().indexOf('.') < 0) {
					this.displayBuffer = this.displayBuffer.toString() + Calculator.keyStrokes[type];
					this.Stack.stackDump();
				}
				return this.displayBuffer;
			}
			else {
				this.displayBuffer = '0.';
				this.Stack.stackDump();
				return this.displayBuffer;
			}
		}
		return 'NOOP';
	},

	handleDoneAndEnter: function(type) {
		if(this.operationDone === 1) {
			this.Stack.pushX();
			this.operationDone = 0;
			this.Stack.cards[0] = Calculator.keyStrokes[type];
			this.displayBuffer = Calculator.keyStrokes[type];
			this.Stack.stackDump();
			return this.getDisplayBuffer();
		}
		if(this.enterPressed === 1) {
			this.enterPressed = 0;
			this.Stack.cards[0] = Calculator.keyStrokes[type];
			this.displayBuffer = Calculator.keyStrokes[type];
			this.Stack.stackDump();
			return this.getDisplayBuffer();
		}
		return 'NOOP';
	},

	doCommand: function(type) {
		var stringValX = this.Stack.cards[0].toString();
		if(Calculator.keyStrokes[type] !== undefined) {			
			// memory ops

			var storageResult = this.handleStorage(type);
			if(storageResult !== 'NOOP') {
				return storageResult;
			}

			// FIX

			var fixResult = this.handleFIX(type);
			if(fixResult !== 'NOOP') {
				return fixResult;
			}
			// numbers that have secondary or tertiary functions
			var numbersWithFunctionsResult = this.handleNumbersWithFunctions(type);
			if(numbersWithFunctionsResult !== 'NOOP') {
				return numbersWithFunctionsResult;
			}			
			// deal with dots
			var dotResult = this.handleDot(type);
			if(dotResult !== 'NOOP') {
				return dotResult;
			}			
			// deal with finished operations and the enter key

			var doneAndEnterResult = this.handleDoneAndEnter(type);
			if(doneAndEnterResult !== 'NOOP') {
				return doneAndEnterResult;
			}								
			if(this.getDisplayBuffer().length > 14) {
				// limit input to 14 digits	
				return this.getDisplayBuffer();
			}

			if (this.displayBuffer == '0' && type == 'zero') {
				// make sure we can't type leading zeros					
				return this.getDisplayBuffer();
			}
			this.displayBuffer = this.displayBuffer.toString() + Calculator.keyStrokes[type];
			this.Stack.cards[0] = parseFloat(this.getDisplayBuffer());
			this.Stack.stackDump();
			return this.getDisplayBuffer();
		}
		else {
			switch(type) {			
				case 'sigmaplus':
				if(this.mode_f) {
					this.statisticsregisters = [];
					this.db.simpleAdd("statisticsregisters", JSON.stringify(this.statisticsregisters));
					this.Stack.clst();	
					this.resetModes();
					this.displayBuffer = '';
				}
				else {
					if(this.mode_g){
						this.removeStatItem();
						this.db.simpleAdd("statisticsregisters", JSON.stringify(this.statisticsregisters));
						this.Stack.clst();
						this.Stack.cards[0] = this.statisticsregisters.length;
						this.displayBuffer = this.Stack.cards[0];
						this.operationDone = 1;
						this.resetModes();
						return this.getDisplayBuffer();
					}
					else {
						this.addStatItem();
						this.db.simpleAdd("statisticsregisters", JSON.stringify(this.statisticsregisters));
						this.Stack.clst();
						this.Stack.cards[0] = this.statisticsregisters.length;						
						this.displayBuffer = this.Stack.cards[0];
						this.operationDone = 1;
						this.Stack.stackDump();
						return this.getDisplayBuffer();
					}
				}
				break;


				case 'sto':
				if(this.mode_g == true) {
					var meanx = this.memoryregisters['r3'] / this.memoryregisters['r2'];
					var meany = this.memoryregisters['r5'] / this.memoryregisters['r2'];
					this.Stack.pushX();
					this.Stack.pushX();
					this.Stack.cards[0] = meanx;
					this.Stack.cards[1] = meany;
					this.operationDone = 1;
					this.resetModes();
					this.displayBuffer = this.Stack.cards[0];
					return this.getDisplayBuffer();
				}
				this.stopressed = true;
				$('mode_sto').addClassName('on');
				return this.getDisplayBuffer();
				break;
				case 'rcl':
				if(this.mode_g) {
					this.resetModes();
					this.Stack.clst();
					this.displayBuffer = '';
					this.operationDone = 1;
				}
				else {
					this.rclpressed = true;
				}
				return this.getDisplayBuffer();
				break;

				case 'f':
				if(this.mode_f) {
					$('mode_f').removeClassName('on');
					this.mode_f = false;
				}
				else {
					this.resetModes();
					$('mode_f').addClassName('on');
					this.mode_f = true;
				}
				break;
				case 'g':
				if(this.mode_g) {
					$('mode_g').removeClassName('on');
					this.mode_g = false;
				}
				else {
					this.resetModes();
					$('mode_g').addClassName('on');
					this.mode_g = true;
				}
				break;
				case 'enter':
				if(this.mode_f) {
					this.Stack.cards[0] = Math.random();
					this.resetModes();
					this.displayBuffer = this.Stack.cards[0];
				}
				else {
					if(this.mode_g) {
						this.Stack.pushX();
						this.Stack.cards[0] = this.lastx;
						this.resetModes();
						this.Stack.stackDump();
						this.displayBuffer = this.Stack.cards[0];
					}
					else {
						this.Stack.pushX();
						this.Stack.stackDump();
						if(this.operationDone === 1) {
							this.operationDone = false;
						}
						this.enterPressed = 1;
					}
				}
				break;
				case 'plus':
				this.lastx = this.Stack.cards[0];
				this.Stack.dropOne(this.Stack.cards[0] + this.Stack.cards[1]);
				this.Stack.stackDump();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'minus':
				this.lastx = this.Stack.cards[0];
				this.Stack.dropOne(this.Stack.cards[1] - this.Stack.cards[0]);
				this.Stack.stackDump();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'multiply':
				this.lastx = this.Stack.cards[0];
				this.Stack.dropOne(this.round(this.Stack.cards[1] * this.Stack.cards[0]));
				this.Stack.stackDump();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'divide':			
				this.lastx = this.Stack.cards[0];
				this.Stack.dropOne(this.Stack.cards[1] / this.Stack.cards[0]);
				this.Stack.stackDump();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'undo':
				if(this.mode_g) {
					this.resetModes();
					return 'COMMAND-STACKINSPECTOR';
				}
				else {
					this.Stack.undo();
					this.operationDone = 1;
					this.displayBuffer = this.Stack.cards[0].toString();
				}
				break;
				case 'ex':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					// LN
					this.Stack.cards[0] = Math.log(this.Stack.cards[0]);
					this.operationDone = 1;
				}
				else {
					// e^x
					this.Stack.cards[0] = Math.pow(2.718281828459045, this.Stack.cards[0]);
				}
				this.resetModes();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'tenx':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					//log
					this.Stack.cards[0] = Math.log(parseFloat(this.Stack.cards[0]))/(Math.LN10 - 0.00000000000000001);
				}
				else {
					// 10^x
					this.Stack.cards[0] = Math.pow(10, this.Stack.cards[0]);
				}
				this.resetModes();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'conv':
				if(this.mode_g) {
					this.resetModes();
					return 'COMMAND-CONVERSION';
				}
				else {
					if(this.conversionConfig['tofactor'] === 1 && this.conversionConfig['fromfactor'] === 1) {
						return 'COMMAND-CONVERSION';
					}
					else {
						// short circuit the temperatures. easiest for now
						if(this.conversionConfig['property'] === 'Temperature') {
							if(this.conversionConfig['fromvalue'] === "Degrees Celsius ('C)") {
								if (this.conversionConfig['tovalue'] === "Degrees Celsius ('C)") {
									//nothing
								}
								if (this.conversionConfig['tovalue'] === "Degrees Fahrenheit ('F)") {
									this.Stack.cards[0] = (9/5) * this.Stack.cards[0] + 32;
								}
								if (this.conversionConfig['tovalue'] === "Degrees Kelvin ('K)") {
									this.Stack.cards[0] = this.Stack.cards[0] + 273.15;
								}
								if (this.conversionConfig['tovalue'] === "Degrees Rankine ('R)") {
									this.Stack.cards[0] = (9/5) * this.Stack.cards[0] + 491.69;
								}	
							}

							if(this.conversionConfig['fromvalue'] === "Degrees Fahrenheit ('F)") {
								if (this.conversionConfig['tovalue'] === "Degrees Celsius ('C)") {
									this.Stack.cards[0] = (this.Stack.cards[0] - 32) / 1.8;
								}
								if (this.conversionConfig['tovalue'] === "Degrees Fahrenheit ('F)") {
									//nothing
								}
								if (this.conversionConfig['tovalue'] === "Degrees Kelvin ('K)") {
									this.Stack.cards[0] = ((5/9) * (this.Stack.cards[0] - 32)) - 273.15;
								}
								if (this.conversionConfig['tovalue'] === "Degrees Rankine ('R)") {
									this.Stack.cards[0] = this.Stack.cards[0] + 459.69;
								}	
							}

							if(this.conversionConfig['fromvalue'] === "Degrees Kelvin ('K)") {
								if (this.conversionConfig['tovalue'] === "Degrees Celsius ('C)") {
									this.Stack.cards[0] = this.Stack.cards[0] - 273.15;
								}
								if (this.conversionConfig['tovalue'] === "Degrees Fahrenheit ('F)") {
									this.Stack.cards[0] = (9/5) * (this.Stack.cards[0] - 273.15) + 32;
								}
								if (this.conversionConfig['tovalue'] === "Degrees Kelvin ('K)") {
									//nothing
								}
								if (this.conversionConfig['tovalue'] === "Degrees Rankine ('R)") {
									this.Stack.cards[0] = (9/5) * this.Stack.cards[0] + 764.84;
								}	
							}

							if(this.conversionConfig['fromvalue'] === "Degrees Rankine ('R)") {
								if (this.conversionConfig['tovalue'] === "Degrees Celsius ('C)") {
									this.Stack.cards[0] = (5/9) * (this.Stack.cards[0] - 491.69);
								}
								if (this.conversionConfig['tovalue'] === "Degrees Fahrenheit ('F)") {
									this.Stack.cards[0] = this.Stack.cards[0] - 459.69;
								}
								if (this.conversionConfig['tovalue'] === "Degrees Kelvin ('K)") {
									this.Stack.cards[0] = (5/9) * (this.Stack.cards[0] - 764.84);
								}
								if (this.conversionConfig['tovalue'] === "Degrees Rankine ('R)") {
									this.Stack.cards[0] = (9/5) * this.Stack.cards[0] + 764.84;
								}	
							}
							if(this.conversionConfig['tovalue'] === "Degrees Kelvin ('K)" || this.conversionConfig['tovalue'] === "Degrees Rankine ('R)") {
								if(this.Stack.cards[0] < 0) {
									this.Stack.cards[0] = NaN;
								}
							}								
						}
						else {
							var result = this.Stack.cards[0] * this.conversionConfig['fromfactor'];
							result = result / this.conversionConfig['tofactor'];
							this.Stack.cards[0] = result;
						}
						this.displayBuffer = this.Stack.cards[0].toString();
						this.convDone = 1;
						this.operationDone = 1;
					}
				}
				break;
				case 'hyp':
				if(this.mode_hyp) {
					this.mode_hyp = false;
					$('mode_hyp').removeClassName('on');
				}
				else {
					this.mode_hyp = true;
					$('mode_hyp').addClassName('on');
				}
				break;
				case 'sin':
				// asin
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					if(this.mode_hyp) {			
						this.Stack.cards[0] = Math.log(this.Stack.cards[0] + Math.sqrt(this.Stack.cards[0]*this.Stack.cards[0]+1)) / this.conversion;
					}
					else {
						this.Stack.cards[0] = Math.asin(this.Stack.cards[0]) / this.conversion;
					}
				}
				else {
					if(this.mode_hyp) {						
						this.Stack.cards[0] = ((Math.exp(this.Stack.cards[0]) - Math.exp(-(this.Stack.cards[0])))/2) * this.conversion;

					}
					else {
						if(this.Stack.cards[0] == Math.PI) {
							this.Stack.cards[0] = 0;
						}
						else {
							this.Stack.cards[0] = Math.sin(this.Stack.cards[0] * this.conversion);
						}
					}
				}
				this.resetModes();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'cos':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					if(this.mode_hyp) {
						this.Stack.cards[0] = (Math.log(this.Stack.cards[0] + Math.sqrt(this.Stack.cards[0]*this.Stack.cards[0]-1))) / this.conversion;
					}
					else {
						this.Stack.cards[0] = Math.acos(this.Stack.cards[0]) / this.conversion;						
					}
				}
				else {	
					if(this.mode_hyp) {
						this.Stack.cards[0] = ((Math.exp(this.Stack.cards[0]) + Math.exp(-(this.Stack.cards[0])))/2) * this.conversion;
					}
					else {
						this.Stack.cards[0] = Math.cos(this.Stack.cards[0] * this.conversion);						
					}
				}
				this.resetModes();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'tan':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					if(this.mode_hyp) {
						this.Stack.cards[0] = (0.5 * Math.log((1+this.Stack.cards[0])/(1-this.Stack.cards[0]))) / this.conversion;
					}
					else {
						this.Stack.cards[0] = Math.atan(this.Stack.cards[0]) / this.conversion;	
					}
				}
				else {
					if(this.mode_hyp) {
						this.Stack.cards[0] = (Math.exp(this.Stack.cards[0]) - Math.exp(-(this.Stack.cards[0]))) / (Math.exp(this.Stack.cards[0]) + Math.exp(-(this.Stack.cards[0]))) * this.conversion;
					}
					else {
						this.Stack.cards[0] = Math.tan(this.Stack.cards[0] * this.conversion);
					}
				}
				this.resetModes();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'pi':
				if(this.mode_g == true) {
					// e
					this.Stack.pushX();
					this.Stack.cards[0] = 2.718281828459045;
					this.resetModes();
				}
				else {
					if(this.mode_f == true) {
						this.Stack.pushX();
						this.Stack.cards[0] = 1.618033988749895;
						this.resetModes();
					}
					else {
						this.Stack.pushX();
						this.Stack.cards[0] = Math.PI;
					}
				}
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'xsquare':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					this.Stack.cards[0] = Math.pow(this.Stack.cards[0], 3);
					this.resetModes();
				}
				else {
					this.Stack.cards[0] = Math.pow(this.Stack.cards[0], 2);
				}
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'onedivx':
				if(this.mode_g == true) {
					this.lastx = this.Stack.cards[0];
					this.Stack.dropOne(Math.pow(this.Stack.cards[1], this.Stack.cards[0]));
					this.displayBuffer = this.Stack.cards[0].toString();
					this.operationDone = 1;
					this.resetModes();
				}
				else {
					this.lastx = this.Stack.cards[0];
					this.Stack.cards[0] = 1 / this.Stack.cards[0];
					this.displayBuffer = this.Stack.cards[0].toString();
					this.operationDone = 1;
				}
				break;
				case 'xfac':
				if(this.mode_f == true) {
					this.Stack.pushX();
					this.Stack.cards[0] = 42;
					this.resetModes();
					this.operationDone = 1;
					this.displayBuffer = this.Stack.cards[0];
				}
				else {
					this.lastx = this.Stack.cards[0];
					this.Stack.cards[0] = this.factorial(this.Stack.cards[0]);
					this.displayBuffer = this.Stack.cards[0].toString();
					this.operationDone = 1;
				}
				break;

				case 'sqrt':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					this.Stack.cards[0] = Math.pow(this.Stack.cards[0], (1 / 3));
					this.displayBuffer = this.Stack.cards[0].toString();
					this.resetModes();
				}
				else {
					this.Stack.cards[0] = Math.sqrt(this.Stack.cards[0]);
					this.displayBuffer = this.Stack.cards[0].toString();
				}
				this.operationDone = 1;
				break;
				case 'percent':
				var xVal = this.Stack.cards[0];
				var yVal = this.Stack.cards[1];
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					this.Stack.cards[0] = this.round(((xVal - yVal) / yVal) * 100);
					this.resetModes();
				}
				else {
					this.Stack.cards[0] = this.round((yVal / 100) * xVal);
				}
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'swapxy':
				temp = this.Stack.cards[0];
				this.Stack.cards[0] = this.Stack.cards[1];
				this.Stack.cards[1] = temp;
				this.displayBuffer = this.Stack.cards[0];
				this.resetModes();
				return this.getDisplayBuffer();
				break;
				case 'roll':
				if(this.mode_g == true) {
					this.Stack.rollUp();
					this.resetModes();
				}
				else {
					this.Stack.rollDown();
				}
				this.displayBuffer = this.Stack.cards[0];
				return this.getDisplayBuffer();
				break;
				
				case 'sqrt':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					this.Stack.cards[0] = Math.pow(this.Stack.cards[0], (1 / 3));
					this.resetModes();
				}
				else {
					this.Stack.cards[0] = Math.sqrt(this.Stack.cards[0]);
				}
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'chs':
				if(this.mode_g == true) {
					this.Stack.cards[0] = Math.abs(this.Stack.cards[0]);
					this.resetModes();
					this.displayBuffer = this.Stack.cards[0];
				}
				else {
					this.Stack.cards[0] = -(this.Stack.cards[0]);
					this.displayBuffer = this.Stack.cards[0];
				}
				break;	
				case 'backspace':			

				if(this.mode_g == true) {
					/*
					var meanx = this.memoryregisters['r3'] / this.memoryregisters['r2'];
					var meany = this.memoryregisters['r5'] / this.memoryregisters['r2'];
					var sumofitemsminusmeanxsquare = 0;
					var sumofitemsminusmeanysquare = 0;
					for(i=0;i<this.statisticsregisters.length;i++) {
						sumofitemsminusmeanxsquare = sumofitemsminusmeanxsquare + Math.pow((this.statisticsregisters[i].valX - meanx), 2);
						sumofitemsminusmeanysquare = sumofitemsminusmeanysquare + Math.pow((this.statisticsregisters[i].valY - meany), 2);
					}
					var sdx = Math.sqrt(sumofitemsminusmeanxsquare / this.memoryregisters['r2']);
					var sdy = Math.sqrt(sumofitemsminusmeanysquare / this.memoryregisters['r2']);
					*/
					var M = (this.memoryregisters['r2'] * this.memoryregisters['r4']) - Math.pow(this.memoryregisters['r3'], 2);
					var N = (this.memoryregisters['r2'] * this.memoryregisters['r6']) - Math.pow(this.memoryregisters['r5'], 2);
					var sdx = Math.sqrt(M / (this.memoryregisters['r2'] * (this.memoryregisters['r2'] - 1)));
					var sdy = Math.sqrt(N / (this.memoryregisters['r2'] * (this.memoryregisters['r2'] - 1)));
					
					this.Stack.pushX();
					this.Stack.pushX();					
					this.Stack.cards[0] = sdx;
					this.Stack.cards[1] = sdy;
					this.displayBuffer = sdx;
					this.resetModes();
					this.operationDone = 1;
					return this.getDisplayBuffer();
				}

				if(this.mode_f == true) {
					this.calculateStatItems();
					var n = this.memoryregisters['r2'];
					var sxy = this.memoryregisters['r7'];
					var sx = this.memoryregisters['r3'];
					var sy = this.memoryregisters['r5'];
					var sxsquare = this.memoryregisters['r4'];
					var sysquare = this.memoryregisters['r6'];
					//slope
					var m = ((n * sxy) - (sx * sy)) / ((n * sxsquare) - Math.pow(sx,2));
					//y intercept
					var b = (sy - (m * sx)) / n;
					var predictedY = m * this.Stack.cards[0] + b;
					var r = (n * sxy - sx * sy) / Math.sqrt((n * sxsquare - Math.pow(sx, 2)) * (n * sysquare - Math.pow(sy, 2)));
					this.Stack.pushX();
					this.Stack.pushX();
					this.Stack.cards[0] = predictedY;
					this.Stack.cards[1] = r;
					this.displayBuffer = predictedY;
					this.resetModes();
					this.operationDone = 1;
					return this.getDisplayBuffer();
				}
				if(this.displayBuffer.toString().length === 1) {
					this.displayBuffer = '';
					return this.displayBuffer;
				}
				if(this.enterPressed === 1) {
					this.displayBuffer = '';
					this.Stack.dropOne(0);
					this.enterPressed = 0;
					return this.displayBuffer;
				}
				if(this.operationDone === 1) {
					this.displayBuffer = '';
					this.Stack.dropOne(0);
					this.operationDone = 0;
					return this.displayBuffer;
				}
				if(this.displayBuffer.toString().length > 0 && this.displayBuffer.toString() !== 0) {
					this.displayBuffer = this.displayBuffer.substring(0,this.displayBuffer.length - 1);
					this.Stack.cards[0] = this.displayBuffer;
					return this.displayBuffer;
				}
				if(this.displayBuffer.length === 0) {
					this.Stack.dropOne(0);
					this.displayBuffer = '';
					return this.displayBuffer
				}
				break;
				case 'eex':
				if(this.mode_g == true) {
					this.resetModes();
					this.displayBuffer = this.displayBuffer + 'e-';
					return this.displayBuffer;
				}
				else {
					this.displayBuffer = this.displayBuffer + 'e';
					return this.displayBuffer;
				}
				break;
			}
		}
		if(this.Stack.cards[0].toString() == 'NaN' || this.Stack.cards[0].toString() == 'Infinity' || this.Stack.cards[0].toString() == '-Infinity' || this.Stack.cards[0].toString() == 'undefined') {
			this.Stack.cards[0] = 0;
			return 'ERROR';
		}
		this.stopressed = false;
		this.rclpressed = false;
		$('mode_sto').removeClassName('on');

		return this.getDisplayBuffer();
	},


	getListFailed: function() {},

	getMemoryRegisters: function(value) {
		if(value !== null) {
			eval('this.memoryregisters = ' + value);
		}
	},
	getStatisticsRegisters: function(value) {
		if(value !== null) {
			eval('statArr = ' + JSON.parse(value));
			this.statisticsregisters = statArr;
		}
	},
	getConversionConfig: function(value) {
		if(value !== null) {
			eval('this.conversionConfig = ' + value);
		}
	},
	getHapticFeedback: function(value) {
		if(value !== null) {
			eval('this.hapticFeedback = ' + value);
		}
	},
	getStackDisplay: function(value) {
		if(value !== null) {
			eval('this.displayStack = ' + value);
		}
	},
	setupMemDb: function() {
		this.db = new Mojo.Depot({name: 'scientificcalculator', version: 1, replace: false}, function(){}, function(){});
		this.db.simpleGet("memoryregisters", this.getMemoryRegisters.bind(this), this.getListFailed);
		this.db.simpleGet("statisticsregisters", this.getStatisticsRegisters.bind(this), this.getListFailed);
		this.db.simpleGet("conversionconfig", this.getConversionConfig.bind(this), this.getListFailed);
		this.db.simpleGet("hapticfeedback", this.getHapticFeedback.bind(this), this.getListFailed);
		this.db.simpleGet("displaystack", this.getStackDisplay.bind(this), this.getListFailed);

	},
});

Calculator.keyStrokes = {
	'zero': 0,
	'one': 1,
	'two': 2,
	'three': 3,
	'four': 4,
	'five': 5,
	'six': 6,
	'seven': 7,
	'eight': 8,
	'nine': 9,
	'dot': '.'
};


Calculator.keyMap = {
	8 : 'backspace',
	48 : 'zero',
	49 : 'one',
	50 : 'two',
	51 : 'three',
	52 : 'four',
	53 : 'five',
	54 : 'six',
	55 : 'seven',
	56 : 'eight',
	57 : 'nine',
	64 : 'zero',
	69 : 'one',
	82 : 'two',
	84 : 'three',
	68 : 'four',
	70 : 'five',
	71 : 'six',
	88 : 'seven',
	67 : 'eight',
	86 : 'nine',
	87 : 'plus',
	43 : 'plus',
	83 : 'minus',
	45 : 'minus',
	81 : 'divide',
	47 : 'divide',
	90 : 'multiply',
	42 : 'multiply',
	13 : 'enter',
	32 : 'enter',
	190: 'dot'
};