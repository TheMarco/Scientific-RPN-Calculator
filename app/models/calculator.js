/*
Copyright 2009 by Marco van Hylckama Vlieg
All Rights Reserved.
License information: http://creativecommons.org/licenses/by-nc-nd/3.0/us/
DO NOT DISTRIBUTE Palm .ipk PACKAGES OF THIS SOFTWARE
*/

var Calculator = Class.create({
	initialize: function() {
		console.log('init!');
		this.operationDone = 1;
		this.fullscreen = false;
		this.enterPressed = 0;
		this.cmode = 'rad';
		this.displaymode = 'normal';
		this.mode = 'normal';
		this.conversion = '1.0';
		this.mode_f = false;
		this.mode_g = false;
		this.displayBuffer = '0';
		this.lastx = 0;
		this.stopressed = false;
		this.rclpressed = false;
		this.stoarithmetic = 'none';
		this.rclarithmetic = 'none';
		this.fixpressed = false;
		this.engpressed = false;
		this.scipressed = false;
		this.memoryregisters = {};
		this.memoryregisters['r0'] = 0;
		this.memoryregisters['r1'] = 0;
		this.memoryregisters['r2'] = 0;
		this.memoryregisters['r3'] = 0;
		this.memoryregisters['r4'] = 0;
		this.memoryregisters['r5'] = 0;
		this.memoryregisters['r6'] = 0;
		this.memoryregisters['r7'] = 0;
		this.memoryregisters['r8'] = 0;
		this.memoryregisters['r9'] = 0;		
		this.statisticsregisters = [];
		this.displayprecision = 10;
		this.conversionfactor = 1;
		this.convDone = 0;
		this.hapticFeedback = false;
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
			maintain: function() {
				var count = this.cards.length - 1;
				var finalLength;
				while((this.cards[count] == 0) && count > -1) {
					this.cards.pop();
					count--;
				}
				finalLength = this.cards.length;
				if(finalLength < 5) {
					for(i=0;i<5-finalLength;i++) {
						this.cards.push(0);
					}
				}
			},	
			update: function(list) {
				this.fillundostack();
				this.cards[0] = list[4];
				this.cards[1] = list[3];
				this.cards[2] = list[2];
				this.cards[3] = list[1];
				this.cards[4] = list[0];
				this.stackDump();	
			},		
			fillundostack: function() {
				this.undostack = this.cards;
			},
			pushX: function() {
				console.log('pushX');
				this.fillundostack();
				this.cards.unshift(this.cards[0]);
				this.maintain();
				this.stackDump();
			},
			dropOne: function(data) {
				this.fillundostack();
				this.cards.shift();
				this.cards[0] = data;
				this.maintain();
				this.stackDump();
			},
			rollUp: function() {
				this.fillundostack();
				var removedElement = this.cards.pop();
				this.cards.unshift(removedElement);	
				this.stackDump();	
			},
			rollDown: function() {		
				this.fillundostack();
				var removedElement = this.cards.shift();
				this.cards.push(removedElement);
				this.stackDump();	
			},
			clst: function() {
				this.fillundostack();
				this.cards = Array(0,0,0,0,0);
				this.stackDump();	
			},
			swapxy: function() {
				this.undostack = this.cards;
				var temp = this.cards[0];
				this.cards[0] = this.cards[1];
				this.cards[1] = temp;
				this.stackDump();	
			},
			undo: function() {
				this.stackDump();
				this.cards = this.undostack;
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
		/*
		this.oldStack = {
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
			backSpace: function() {
				this.cards[0] = 0;
				this.cards[1] = this.cards[2];
				this.cards[2] = this.cards[3];
				this.cards[3] = this.cards[4];
				this.cards[4] = 0;
			},
			rollUp: function() {
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
				//console.log(output);
			}
		};
		*/
	},

	setHapticPrefs: function(value) {
		if(value) {
			this.hapticFeedback = true;
		}
		else {
			this.hapticFeedback = false;
		}
		this.db.add('hapticfeedback', this.hapticFeedback, function(){}, function(){});
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
		this.db.add('displaystack', this.displayStack, function(){}, function(){});
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
		this.db.add("conversionconfig", JSON.stringify(this.conversionConfig), function(){}, function(){});

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
		this.db.add("memoryregisters", JSON.stringify(this.memoryregisters));
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

	getDisplayBuffer: function(done) {

		var data = this.displayBuffer.toString();
		data = data.replace(new RegExp(/^\./),"");
		data = data.replace(new RegExp(/\.$/),"");	

		// remove possible trailing dot

		// deal with rounding better (attempt anyway)

		if(this.operationDone == 1 || done) {	
			if(data === '') {return data;};

			if(this.displaymode === 'fix') {
				data = parseFloat(data).toFixed(this.displayprecision);
			}
			if(this.displaymode === 'sci') {
				data = Utils.SCI(data, this.displayprecision);
			}
			if(this.displaymode === 'eng') {
				data = Utils.ENG(data, this.displayprecision);
			}
		}

		if(data.length > 21) {
			data = parseFloat(data.toString()).toExponential(this.displayprecision);
		}
		return data;

	},

	round: function(number) {
		
		// Still somewhat experimental and messy but it works pretty well so far
		// and at least now I can't get accused of having stolen someone else's code
		
		var originalnumber = number;
		var str = number.toExponential().toString();
		var splittedString = str.split('e');
		if(splittedString[0].length <= 12) {
			return number;
		}
		var splittedMantissa = splittedString[0].split('.');
		var largestnumber, largest, number, num, items;
		firstBit = splittedMantissa[1].substr(0, splittedMantissa[1].length - 4);
		lastBit = splittedMantissa[1].substr(splittedMantissa[1].length - 4, splittedMantissa[1].length);
		largest = 0;
		items = {};
		for(j=0;j<4;j++) {
			if(items['n' + lastBit.substr(j,1)]) {
				items['n' + lastBit.substr(j,1)]++;
				if(largest < items['n' + lastBit.substr(j,1)]) {
					largest = items['n' + lastBit.substr(j,1)];
					largestnumber = lastBit.substr(j,1);
				}
			}
			else {
				items['n' + lastBit.substr(j,1)] = 1;
			}
		}	
		if(largest < 3) {
			return originalnumber;
		}
		result = splittedMantissa[0] + '.' + firstBit.toString() + largestnumber.toString() + largestnumber.toString() + largestnumber.toString() + largestnumber.toString() + largestnumber.toString() + 'e' + splittedString[1];
		return parseFloat(result);
	},

	memToJSON: function() {
		var obj = {};
		for(i=0;i<10;i++) {
			if(this.memoryregisters['r' + i] !== undefined) {
				obj['r' + i] = this.memoryregisters['r' + i];
				entry = {};
			}
		}
		return JSON.stringify(obj);
	},

	handleStorage: function(type) {
		if(this.stopressed) {
			if(this.stoarithmetic !== 'none') {
				var newVal;
				switch(this.stoarithmetic) {
					case 'plus':
					newVal = this.memoryregisters['r' + Calculator.keyStrokes[type]] + this.Stack.cards[0];
					 break;
					case 'minus':
					newVal = this.memoryregisters['r' + Calculator.keyStrokes[type]] - this.Stack.cards[0];
					break;
					case 'divide':
					newVal = this.round(this.memoryregisters['r' + Calculator.keyStrokes[type]] / this.Stack.cards[0]);
					break;
					case 'multiply':
					newVal = this.round(this.memoryregisters['r' + Calculator.keyStrokes[type]] * this.Stack.cards[0]);
					break;
				}
				this.stopressed = false;
				this.stoarithmetic = 'none';
				$('mode_sto').removeClassName('on');
				if(newVal === NaN) {
					return NaN;
				}
				else {
					this.memoryregisters['r' + Calculator.keyStrokes[type]] = newVal;
					this.db.add('memoryregisters', this.memToJSON());
					return this.getDisplayBuffer();
				}
			}
			if(type !== 'dot' && Calculator.keyStrokes[type] !== undefined) {
				this.memoryregisters['r' + Calculator.keyStrokes[type]] = this.Stack.cards[0];
				this.db.add('memoryregisters', this.memToJSON());
				
				this.stopressed = false;
				$('mode_sto').removeClassName('on');
				this.operationDone = 1;
			}
			if(type == 'minus' || type == 'plus' || type == 'divide' || type== 'multiply') {
				this.stoarithmetic = type;
				return this.getDisplayBuffer();
			}
			else {
				this.stoarithmetic = 'none';
			}
			this.stopressed = false;
			return this.getDisplayBuffer();
		}
		if(this.rclpressed) {			
			if(this.rclarithmetic !== 'none') {
				var result;
				switch(this.rclarithmetic) {
					case 'plus':
					result = this.Stack.cards[0] + this.memoryregisters['r' + Calculator.keyStrokes[type]];
					 break;
					case 'minus':
					result = this.Stack.cards[0] - this.memoryregisters['r' + Calculator.keyStrokes[type]];
					break;
					case 'divide':
					result = this.round(this.Stack.cards[0] / this.memoryregisters['r' + Calculator.keyStrokes[type]]);
					break;
					case 'multiply':
					result = this.round(this.Stack.cards[0] * this.memoryregisters['r' + Calculator.keyStrokes[type]]);
					break;
				}
				
				this.rclpressed = false;
				this.rclarithmetic = 'none';
				if(newVal === NaN) {
					return NaN;
				}
				else {
					this.lastx = this.Stack.cards[0];
					this.Stack.cards[0] = result;
					this.displayBuffer = result;
					this.operationDone = 1;
					return this.getDisplayBuffer();
				}
			}
			
			if(type == 'minus' || type == 'plus' || type == 'divide' || type== 'multiply') {
				this.rclarithmetic = type;
				return this.getDisplayBuffer();
			}
			else {
				this.rclarithmetic = 'none';
			}
				
			if(type !== 'dot') {
				if( this.memoryregisters['r' + Calculator.keyStrokes[type]] !== undefined) {
					this.Stack.pushX();
					this.Stack.cards[0] = this.memoryregisters['r' + Calculator.keyStrokes[type]];
					this.displayBuffer = this.Stack.cards[0];
					this.operationDone = 1;
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
			if(Calculator.keyStrokes[type] === undefined) {
				this.fixpressed = false;
				$('mode_fix').removeClassName('on');
				return this.getDisplayBuffer();
			}
			if(type !== 'dot') {
				this.displayprecision = Calculator.keyStrokes[type];
			}
			if(type === 'dot') {

				$('mode_fix').removeClassName('on');
				
				if(this.displaymode !== 'fix') {
					this.fixpressed = false;
					return this.getDisplayBuffer(true);
				}
				
				this.displayprecision = 10;
				this.displaymode = 'normal';
				this.db.add('displaymode', this.displaymode);
				this.fixpressed = false;
				this.operationDone = 1;
				return this.getDisplayBuffer(true);
			}
			this.db.add('displayprecision', this.displayprecision);
			this.displaymode = 'fix';
			this.db.add('displaymode', this.displaymode);
			this.fixpressed = false;
			$('mode_sci').removeClassName('on');
			$('mode_eng').removeClassName('on');
			this.operationDone = 1;
			return this.getDisplayBuffer(true);
		}
		else {
			return 'NOOP';
		}
	},
	handleSCI: function(type) {
		if(this.scipressed) {
			if(Calculator.keyStrokes[type] === undefined) {
				this.scipressed = false;
				return this.getDisplayBuffer();
			}
			if(type !== 'dot') {
				this.displayprecision = Calculator.keyStrokes[type];
			}
			
			if(type === 'dot') {
				$('mode_sci').removeClassName('on');
				
				if(this.displaymode !== 'sci') {
					this.scipressed = false;
					return this.getDisplayBuffer(true);
				}
				
				this.displayprecision = 10;
				this.displaymode = 'normal';
				this.db.add('displaymode', this.displaymode);
				this.scipressed = false;
				this.operationDone = 1;
				return this.getDisplayBuffer(true);
			}
			
			this.db.add('displayprecision', this.displayprecision);
			this.displaymode = 'sci';
			this.db.add('displaymode', this.displaymode);
			this.scipressed = false;
			$('mode_fix').removeClassName('on');
			$('mode_eng').removeClassName('on');	
			this.operationDone = 1;
			return this.getDisplayBuffer(true);
		}
		else {
			return 'NOOP';
		}
	},
	
	handleENG: function(type) {
		if(this.engpressed) {

			if(Calculator.keyStrokes[type] === undefined) {
				this.engpressed = false;
				return this.getDisplayBuffer();
			}
			if(type !== 'dot') {
				this.displayprecision = Calculator.keyStrokes[type];
			}
			
			if(type === 'dot') {
				$('mode_eng').removeClassName('on');
				
				if(this.displaymode !== 'eng') {
					this.engpressed = false;
					return this.getDisplayBuffer(true);
				}
				
				this.displayprecision = 10;
				this.displaymode = 'normal';
				this.db.add('displaymode', this.displaymode);
				this.engpressed = false;
				this.operationDone = 1;
				return this.getDisplayBuffer(true);
				
			}
			
			this.db.add('displayprecision', this.displayprecision);
			this.displaymode = 'eng';
			this.db.add('displaymode', this.displaymode);
			this.engpressed = false;
			$('mode_fix').removeClassName('on');
			$('mode_sci').removeClassName('on');	
			this.operationDone = 1;
			return this.getDisplayBuffer(true);
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
			this.db.add('cmode', 'deg');
			return this.getDisplayBuffer();
		}

		if(type === 'five' && this.mode_g == true) {
			this.resetModes();
			$('mode_sci').addClassName('on');
			this.scipressed = true;
			return this.getDisplayBuffer();
		}
		if(type === 'six' && this.mode_g == true) {
			this.resetModes();
			$('mode_eng').addClassName('on');	
			this.engpressed = true;
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
			this.db.add('cmode', 'rad');
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
			this.db.add('cmode', 'grad');
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

		if(type === 'zero' && this.mode_g == true) {
			// to h.ms
			this.lastx = this.Stack.cards[0];
			var h;
			var m;
			var s;
			h = Math.floor(this.Stack.cards[0]);
			m = 60 * (this.Stack.cards[0] - h);
			h = h + Math.floor(m)/100;
			s = 60 * (m - Math.floor(m));
			h = h + s/10000;
			this.Stack.cards[0] = this.round(h);
			this.displayBuffer = this.Stack.cards[0].toString();
			this.operationDone = 1;
			this.resetModes();
			return this.displayBuffer;
		}
		
		if(type === 'dot' && this.mode_g == true) {
			this.lastx = this.Stack.cards[0];
			var h;
			var m;
			var s;
			h = Math.floor(this.Stack.cards[0]);
			m = (this.Stack.cards[0] - h) * 100;
			h = h + Math.floor(m)/60;
			s = (m - Math.floor(m)) * 100;
			h = h + s/3600;
			this.Stack.cards[0] = this.round(h);
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
			return this.getDisplayBuffer();
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
		// memory ops

		if((Calculator.keyStrokes[type] !== undefined) || type === 'divide' || type === 'plus' || type ==='minus' || type === 'multiply') {
			
			var storageResult = this.handleStorage(type);
			if(storageResult !== 'NOOP') {
				return storageResult;
			}
		}

		if(Calculator.keyStrokes[type] !== undefined) {			

			// FIX, SCI, ENG
			var fixResult = this.handleFIX(type);
			if(fixResult !== 'NOOP') {
				return fixResult;
			}
			var sciResult = this.handleSCI(type);
			if(sciResult !== 'NOOP') {
				return sciResult;
			}
			var engResult = this.handleENG(type);
			if(engResult !== 'NOOP') {
				return engResult;
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
			// leading zero but no dot after that removes the zero
			if(this.displayBuffer == '0' && type !== 'dot') {
				this.displayBuffer = Calculator.keyStrokes[type];
				return this.getDisplayBuffer();
			}
			this.displayBuffer = this.displayBuffer.toString() + Calculator.keyStrokes[type];
			this.Stack.cards[0] = parseFloat(this.getDisplayBuffer());
			this.Stack.stackDump();
			return this.getDisplayBuffer();
		}
		else {
			
			// damage control in case ENG, FIX or SCI were pressed
			if(this.engpressed) {
				this.engpressed = false;
				if(this.displaymode !== 'eng') {
					$('mode_eng').removeClassName('on');
				}
				return 'ERROR';
			}
			if(this.scipressed) {
				this.scipressed = false;
				if(this.displaymode !== 'sci') {
					$('mode_sci').removeClassName('on');
				}
				return 'ERROR';
			}
			if(this.fixpressed) {
				this.fixpressed = false;
				if(this.displaymode !== 'fix') {
					$('mode_fix').removeClassName('on');
				}
				return 'ERROR';
			}
			
			switch(type) {			
				case 'sigmaplus':
				if(this.mode_f) {
					
					// hp manual says we clear memory registers, statistics and stack
					
					this.statisticsregisters = [];
					this.memoryregisters['r2'] = 0;
					this.memoryregisters['r3'] = 0;
					this.memoryregisters['r4'] = 0;
					this.memoryregisters['r5'] = 0;
					this.memoryregisters['r6'] = 0;
					this.memoryregisters['r7'] = 0;
					this.db.add("memoryregisters", JSON.stringify(this.memoryregisters));
					this.db.add("statisticsregisters", JSON.stringify(this.statisticsregisters));
					this.Stack.clst();
					this.resetModes();
					this.displayBuffer = '';
				}
				else {
					if(this.mode_g){
						this.removeStatItem();
						this.db.add("statisticsregisters", JSON.stringify(this.statisticsregisters));
						this.Stack.cards[0] = this.statisticsregisters.length;
						this.displayBuffer = this.Stack.cards[0];
						this.operationDone = 1;
						this.resetModes();
						return this.getDisplayBuffer();
					}
					else {
						this.addStatItem();
						this.db.add("statisticsregisters", JSON.stringify(this.statisticsregisters));
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
					this.Stack.pushX();
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
						return this.getDisplayBuffer(true);
					}
				}
				break;
				case 'plus':
				if(this.mode_g == true) {
					this.resetModes();
					this.operationDone = 1;
					return this.getDisplayBuffer();
				}
				this.lastx = this.Stack.cards[0];
				this.Stack.dropOne(this.round(this.Stack.cards[0] + this.Stack.cards[1]));
				this.Stack.stackDump();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'minus':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					this.resetModes();
					// INT
					var tempVal = this.Stack.cards[0].toString();
					tempVal = tempVal.split('.');
					this.Stack.cards[0] = parseInt(tempVal[0]);
					this.displayBuffer = tempVal[0];
					this.operationDone = 1;
					return this.getDisplayBuffer();
				}
				if(this.mode_f == true) {
					//FRAC
					this.resetModes();
					var tempVal = this.Stack.cards[0].toString();
					tempVal = tempVal.split('.');
					if(tempVal.length > 0) {
						this.Stack.cards[0] = parseFloat('0.' + tempVal[1]);
						this.displayBuffer = '0.' + tempVal[1];
					}
					this.operationDone = 1;
					return this.getDisplayBuffer();
				}
				this.Stack.dropOne(this.round(this.Stack.cards[1] - this.Stack.cards[0]));
				this.Stack.stackDump();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'multiply':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					this.resetModes();
					this.Stack.cards[0] = this.round(this.Stack.cards[0] * 180 / Math.PI);
					this.displayBuffer = this.Stack.cards[0].toString();
					this.operationDone = 1;
					return this.getDisplayBuffer();
				}
				else {
					
					if(this.mode_f == true) {
					var newX = this.round(this.Stack.cards[0] * Math.cos(this.Stack.cards[1] * this.conversion));
					var newY = this.round(this.Stack.cards[0] * Math.sin(this.Stack.cards[1] * this.conversion));
					this.Stack.cards[0] = newX;
					this.Stack.cards[1] = newY;
					this.displayBuffer = this.Stack.cards[0].toString();
					this.operationDone = 1;
					this.resetModes();
					return this.getDisplayBuffer();
					}
					else {
						this.lastx = this.Stack.cards[0];
						this.Stack.dropOne(this.round(this.Stack.cards[1] * this.Stack.cards[0]));
						this.Stack.stackDump();
						this.displayBuffer = this.Stack.cards[0].toString();
						this.operationDone = 1;
						return this.getDisplayBuffer();
					}
				}
				break;
				case 'divide':			
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					this.resetModes();
					this.Stack.cards[0] = this.round(this.Stack.cards[0] * Math.PI / 180)
					;
					this.displayBuffer = this.Stack.cards[0].toString();
					this.operationDone = 1;
					return this.getDisplayBuffer();
				}
				else {
					if(this.mode_f == true) {
						//BLORK
						var r = Math.sqrt(Math.pow(this.Stack.cards[0], 2) + Math.pow(this.Stack.cards[1], 2));
								
						var t = null;
						
						if (this.Stack.cards[0] == 0) {
							if (this.Stack.cards[1] == 0) {
								t = 0;
							}
							else {
								if (this.Stack.cards[1] > 0) {
									t = Math.PI/2;
								}
								else {
									t = -Math.PI/2;
								}
							}
						}
						else {							
							// need to calculate t here to ensure x != 0
							t = Math.atan(this.Stack.cards[1] / this.Stack.cards[0]);
							if (t < 0) { 
								// 2nd or 4th quadrant
								if (this.Stack.cards[0] < 0) {
									// 2nd quadrant
									t = Math.PI + t;	
									// 4th qudrant, just use the value of t which is negative 
								}
							}
							else {
								// 1st or 3rd quadrant
								if (this.Stack.cards[0] > 0) {
									// 1st quadrant, just use the value of t which is positive
								}	
								else {
									// 3rd quadrant
									t = Math.PI + t;	
								}
							}
						}
						t= t / this.conversion;
						this.Stack.cards[0] = r;
						this.Stack.cards[1] = t;
						this.displayBuffer = this.Stack.cards[0];
						this.resetModes();
						this.operationDone = 1;
						return this.getDisplayBuffer();
					}
					else {
						this.Stack.dropOne(this.Stack.cards[1] / this.Stack.cards[0]);
						this.Stack.stackDump();
						this.displayBuffer = this.Stack.cards[0].toString();
						this.operationDone = 1;
					}
				}
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
					this.Stack.cards[0] = this.round(Math.log(this.Stack.cards[0]));
					this.operationDone = 1;
				}
				else {
					// e^x
					this.Stack.cards[0] = this.round(Math.pow(Math.E, this.Stack.cards[0]));
				}
				this.resetModes();
				this.displayBuffer = this.Stack.cards[0].toString();
				this.operationDone = 1;
				break;
				case 'tenx':
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					//log
					this.Stack.cards[0] = this.round(Math.log(parseFloat(this.Stack.cards[0]))/(Math.LN10));
				}
				else {
					// 10^x
					this.Stack.cards[0] = this.round(Math.pow(10, this.Stack.cards[0]));
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
							result = this.round(result / this.conversionConfig['tofactor']);
							this.Stack.cards[0] = result;
						}
						this.displayBuffer = this.Stack.cards[0].toString();
						this.convDone = 1;
						this.operationDone = 1;
					}
				}
				break;
				case 'hyp':
				
				if(this.mode_g == true) {
					this.resetModes();
					break;
				}
				else {
					if(this.mode_hyp) {
						this.mode_hyp = false;
						$('mode_hyp').removeClassName('on');
					}
					else {
						this.mode_hyp = true;
						$('mode_hyp').addClassName('on');
					}
				}
				break;
				case 'sin':
				console.log(this.cmode);
				// asin
				this.lastx = this.Stack.cards[0];
				if(this.mode_g == true) {
					if(this.mode_hyp) {	
						this.Stack.cards[0] = Math.log(this.Stack.cards[0] + Math.sqrt(this.Stack.cards[0]*this.Stack.cards[0]+1));
					}
					else {
						this.Stack.cards[0] = Math.asin(this.Stack.cards[0]) / this.conversion;
					}
				}
				else {
					if(this.mode_hyp) {						
						this.Stack.cards[0] = ((Math.exp(this.Stack.cards[0]) - Math.exp(-(this.Stack.cards[0]))) / 2);
					}
					else {
						if((parseInt(this.Stack.cards[0] / Math.PI) == this.Stack.cards[0] / Math.PI) && this.cmode == 'rad') {							
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
						this.Stack.cards[0] = (Math.log(this.Stack.cards[0] + Math.sqrt(this.Stack.cards[0]*this.Stack.cards[0]-1)));
					}
					else {
						this.Stack.cards[0] = Math.acos(this.Stack.cards[0]) / this.conversion;						
					}
				}
				else {	
					if(this.mode_hyp) {
						this.Stack.cards[0] = ((Math.exp(this.Stack.cards[0]) + Math.exp(-(this.Stack.cards[0])))/2);
					}
					else {
						if((parseInt(this.Stack.cards[0] / Math.PI) == this.Stack.cards[0] / Math.PI) && this.cmode == 'rad') {							
							this.Stack.cards[0] = -1;
						}
						else {
							this.Stack.cards[0] = Math.cos(this.Stack.cards[0] * this.conversion);	
							}					
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
						this.Stack.cards[0] = (0.5 * Math.log((1+this.Stack.cards[0])/(1-this.Stack.cards[0])));
					}
					else {
						this.Stack.cards[0] = Math.atan(this.Stack.cards[0]) / this.conversion;	
					}
				}
				else {
					if(this.mode_hyp) {
						this.Stack.cards[0] = (Math.exp(this.Stack.cards[0]) - Math.exp(-(this.Stack.cards[0]))) / (Math.exp(this.Stack.cards[0]) + Math.exp(-(this.Stack.cards[0])));
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
					this.Stack.cards[0] = this.round(Math.pow(this.Stack.cards[0], 3));
					this.resetModes();
				}
				else {
					this.Stack.cards[0] = this.round(Math.pow(this.Stack.cards[0], 2));
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
					this.Stack.cards[0] = this.round(Math.pow(this.Stack.cards[0], (1 / 3)));
					this.displayBuffer = this.Stack.cards[0].toString();
					this.resetModes();
				}
				else {
					this.Stack.cards[0] = this.round(Math.sqrt(this.Stack.cards[0]));
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
				this.operationDone = 1;
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
				this.operationDone = 1;
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

				if(this.enterPressed === 1) {
					this.displayBuffer = '';
					// keep going: this.Stack.backSpace();
					// clx
					this.Stack.cards[0] = 0;
					this.enterPressed = 0;
					return this.displayBuffer;
				}
				if(this.operationDone === 1) {
					this.displayBuffer = '';
					// keep going: this.Stack.backSpace();
					// cls
					this.Stack.cards[0] = 0;
					this.operationDone = 0;
					return this.displayBuffer;
				}
				if(this.displayBuffer.toString().length === 1) {
					this.Stack.cards[0] = 0;
					this.displayBuffer = '';
					return this.displayBuffer;
				}
				if(this.displayBuffer.toString().length > 0 && this.displayBuffer.toString() !== 0) {
					var cutBuffer = this.displayBuffer.toString();
					cutBuffer = cutBuffer.substring(0,cutBuffer.length - 1);
					this.displayBuffer = cutBuffer;
					if(this.displayBuffer === '-') {
						this.displayBuffer = '';
						this.Stack.cards[0] = 0;
						return this.displayBuffer;
					}
					this.Stack.cards[0] = parseFloat(this.displayBuffer);
					return this.displayBuffer;
				}
				if(this.displayBuffer.length === 0) {
					//this.Stack.backSpace();
					//this.displayBuffer = '';
					return this.displayBuffer;
				}
				break;
				case 'eex':
				if(this.displayBuffer.toString().indexOf('e') > 0) {
					return this.displayBuffer;
				}
				if(this.mode_g == true) {
					this.resetModes();
					this.displayBuffer = this.displayBuffer + 'e-';					
				}
				else {
					this.displayBuffer = this.displayBuffer + 'e';					
				}
				return this.displayBuffer;
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
	getDisplayMode: function(value) {
		if(value !== null) {
			eval('this.displaymode = "' + value + '"');
			switch(value) {
				case 'sci':
				$('mode_sci').addClassName('on');
				break;
				case 'eng':
				$('mode_eng').addClassName('on');
				break;
				case 'fix':
				$('mode_fix').addClassName('on');
				default:
				break;
			}
		}
	},
	getTrigMode: function(value) {
		if(value !== null) {
			eval('this.cmode = "' + value + '"');
			switch(value) {
				case 'rad':
				$('mode_rad').addClassName('on');
				this.conversion = 1.0;
				break;
				case 'deg':
				$('mode_deg').addClassName('on');
				this.conversion = Math.PI/180.0;
				break;
				case 'grad':
				$('mode_grad').addClassName('on');
				this.conversion = Math.PI/200.0;
				break;
				default:
				break;
			}
		}
		else {
			$('mode_rad').addClassName('on');
		}	
	},
	getDisplayPrecision: function(value) {
		if(value !== null) {
			eval('this.displayprecision = ' + value);
		}
	},
	setupMemDb: function() {
		this.db = new Mojo.Depot({name: 'scientificcalculator', version: 1, replace: false}, function(){}, function(){});
		this.db.get("memoryregisters", this.getMemoryRegisters.bind(this), this.getListFailed);
		this.db.get("statisticsregisters", this.getStatisticsRegisters.bind(this), this.getListFailed);
		this.db.get("conversionconfig", this.getConversionConfig.bind(this), this.getListFailed);
		this.db.get("hapticfeedback", this.getHapticFeedback.bind(this), this.getListFailed);
		this.db.get("displaystack", this.getStackDisplay.bind(this), this.getListFailed);
		this.db.get("displaymode", this.getDisplayMode.bind(this), this.getListFailed);
		this.db.get("displayprecision", this.getDisplayPrecision.bind(this), this.getListFailed);
		this.db.get("cmode", this.getTrigMode.bind(this), this.getListFailed);		
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