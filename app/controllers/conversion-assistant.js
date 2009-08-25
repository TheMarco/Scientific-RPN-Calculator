/*
Copyright 2009 by Marco van Hylckama Vlieg
All Rights Reserved.
License information: http://creativecommons.org/licenses/by-nc-nd/3.0/us/
DO NOT DISTRIBUTE Palm .ipk PACKAGES OF THIS SOFTWARE
*/

var ConversionAssistant = Class.create({

	initialize : function(calculator) {
		this.calculator = calculator;
	},
	setup: function() {		
		this.controller.setupWidget("apply",		
		this.attributes = {
			disabledProperty: 'disabled'
		},

		this.model = {
			buttonLabel : "Apply",
			buttonClass: 'primary',
			disabled: false
		});
		this.controller.listen('apply', Mojo.Event.tap, this.onApplyClick.bindAsEventListener(this));

		this.property = new Array();
		this.unit = new Array();
		this.factor = new Array();

		this.property[0] = "Acceleration";
		this.unit[0] = new Array("Meter/sq.sec (m/sec^2)", "Foot/sq.sec (ft/sec^2)", "G (g)", "Galileo (gal)", "Inch/sq.sec (in/sec^2)");
		this.factor[0] = new Array(1, .3048, 9.806650, .01, 2.54E-02);

		this.property[1] = "Area";
		this.unit[1] = new Array("Square meter (m^2)", "Acre (acre)", "Are", "Barn (barn)", "Hectare", "Rood", "Square centimeter", "Square kilometer", "Circular mil", "Square foot (ft^2)", "Square inch (in^2)", "Square mile (mi^2)", "Square yard (yd^2)");
		this.factor[1] = new Array(1, 4046.856, 100, 1E-28, 10000, 1011.71413184285, .0001, 1000000, 5.067075E-10, 9.290304E-02, 6.4516E-04, 2589988, .8361274);

		this.property[2] = "Torque";
		this.unit[2] = new Array("Newton-meter (N m)", "Dyne-centimeter(dy cm)", "Kgrf-meter (kgf m)", "lbf-inch (lbf in)", "lbf-foot (lbf ft)");
		this.factor[2] = new Array(1, .0000001, 9.806650, .1129848, 1.355818);

		this.property[3] = "Electricity";
		this.unit[3] = new Array("Coulomb (Cb)", "Abcoulomb", "Ampere hour (A hr)", "Faraday (F)", "Statcoulomb", "Millifaraday (mF)", "Microfaraday (mu-F)", "Picofaraday (pF)");
		this.factor[3] = new Array(1, 10, 3600, 96521.8999999997, .000000000333564, 96.5219, 9.65219E-02, 9.65219E-05);

		this.property[4] = "Energy";
		this.unit[4] = new Array("Joule (J)", "BTU (mean)", "BTU (thermochemical)", "Calorie (SI) (cal)", "Calorie (mean)(cal)", "Calorie (thermo)", "Electron volt (eV)", "Erg (erg)", "Foot-pound force", "Foot-poundal", "Horsepower-hour", "Kilocalorie (SI)(kcal)", "Kilocalorie (mean)(kcal)", "Kilowatt-hour (kW hr)", "Ton of TNT", "Volt-coulomb (V Cb)", "Watt-hour (W hr)", "Watt-second (W sec)");
		this.factor[4] = new Array(1, 1055.87, 1054.35, 4.1868, 4.19002, 4.184, 1.6021E-19, .0000001, 1.355818, 4.214011E-02, 2684077.3, 4186.8, 4190.02, 3600000, 4.2E9, 1, 3600, 1);

		this.property[5] = "Force";
		this.unit[5] = new Array("Newton (N)", "Dyne (dy)", "Kilogram force (kgf)", "Kilopond force (kpf)", "Kip (k)", "Ounce force (ozf)", "Pound force (lbf)", "Poundal");
		this.factor[5] = new Array(1, .00001, 9.806650, 9.806650, 4448.222, .2780139, 4.4482216153, .138255);

		this.property[6] = "Force / Length";
		this.unit[6] = new Array("Newton/meter (N/m)", "Pound force/inch (lbf/in)", "Pound force/foot (lbf/ft)");
		this.factor[6] = new Array(1, 175.1268, 14.5939);

		this.property[7] = "Length";
		this.unit[7] = new Array("Meter (m)", "Angstrom (A')", "Astronomical unit (AU)", "Caliber (cal)", "Centimeter (cm)", "Kilometer (km)", "Ell", "Em", "Fathom", "Furlong", "Fermi (fm)", "Foot (ft)", "Inch (in)", "League (int'l)", "League (UK)", "Light year (LY)", "Micrometer (mu-m)", "Mil", "Millimeter (mm)", "Nanometer (nm)", "Mile (int'l nautical)", "Mile (UK nautical)", "Mile (US nautical)", "Mile (US statute)", "Parsec", "Pica (printer)", "Picometer (pm)", "Point (pt)", "Rod", "Yard (yd)");
		this.factor[7] = new Array(1, 1E-10, 1.49598E11, .000254, .01, 1000, 1.143, 4.2323E-03, 1.8288, 201.168, 1E-15, .3048, .0254, 5556, 5556, 9.46055E+15, .000001, .0000254, .001, 1E-9, 1852, 1853.184, 1852, 1609.344, 3.08374E+16, 4.217518E-03, 1E-12, .0003514598, 5.0292, .9144);

		this.property[8] = "Light";
		this.unit[8] = new Array("Lumen/sq.meter (Lu/m^2)", "Lumen/sq.centimeter", "Lumen/sq.foot", "Foot-candle (ft-cdl)", "Foot-lambert", "Candela/sq.meter", "Candela/sq.centimeter", "Lux (lux)", "Phot");
		this.factor[8] = new Array(1, 10000, 10.76391, 10.76391, 10.76391, 3.14159250538575, 31415.9250538576, 1, 10000);

		this.property[9] = "Mass";
		this.unit[9] = new Array("Kilogram (kgr)", "Gram (gr)", "Milligram (mgr)", "Microgram (mu-gr)", "Carat (metric)(ct)", "Hundredweight (long)", "Hundredweight (short)", "Pound mass (lbm)", "Pound mass (troy)", "Ounce mass (ozm)", "Ounce mass (troy)", "Slug", "Ton (assay)", "Ton (long)", "Ton (short)", "Ton (metric)", "Tonne");
		this.factor[9] = new Array(1, .001, 1e-6, .000000001, .0002, 50.80235, 45.35924, .4535924, .3732417, .02834952, .03110348, 14.5939, .02916667, 1016.047, 907.1847, 1000, 1000);

		this.property[10] = "Mass Flow";
		this.unit[10] = new Array("Kilogram/second (kgr/sec)", "Pound mass/sec (lbm/sec)", "Pound mass/min (lbm/min)");
		this.factor[10] = new Array(1, .4535924, .007559873);

		this.property[11] = "Density & Mass capacity";
		this.unit[11] = new Array("Kilogram/cub.meter", "Grain/galon", "Grams/cm^3 (gr/cc)", "Pound mass/cubic foot", "Pound mass/cubic-inch", "Ounces/gallon (UK,liq)", "Ounces/gallon (US,liq)", "Ounces (mass)/inch", "Pound mass/gal (UK,liq)", "Pound mass/gal (US,liq)", "Slug/cubic foot", "Tons (long,mass)/cub.yard");
		this.factor[11] = new Array(1, .01711806, 1000, 16.01846, 27679.91, 6.236027, 7.489152, 1729.994, 99.77644, 119.8264, 515.379, 1328.939);

		this.property[12] = "Power";
		this.unit[12] = new Array("Watt (W)", "Kilowatt (kW)", "Megawatt (MW)", "Milliwatt (mW)", "BTU (SI)/hour", "BTU (thermo)/second", "BTU (thermo)/minute", "BTU (thermo)/hour", "Calorie (thermo)/second", "Calorie (thermo)/minute", "Erg/second", "Foot-pound force/hour", "Foot-pound force/minute", "Foot-pound force/second", "Horsepower(550 ft lbf/s)", "Horsepower (electric)", "Horsepower (boiler)", "Horsepower (metric)", "Horsepower (UK)", "Kilocalorie (thermo)/min", "Kilocalorie (thermo)/sec");
		this.factor[12] = new Array(1, 1000, 1000000, .001, .2930667, 1054.35, 17.5725, .2928751, 4.184, 6.973333E-02, .0000001, .0003766161, .02259697, 1.355818, 745.7, 746, 9809.5, 735.499, 745.7, 69.7333, 4184);

		this.property[13] = "Pressure & Stress";
		this.unit[13] = new Array("Newton/sq.meter", "Atmosphere (normal)", "Atmosphere (techinical)", "Bar", "Centimeter mercury(cmHg)", "Centimeter water (4'C)", "Decibar", "Kgr force/sq.centimeter", "Kgr force/sq.meter", "Kip/square inch", "Millibar", "Millimeter mercury(mmHg)", "Pascal (Pa)", "Kilopascal (kPa)", "Megapascal (Mpa)", "Poundal/sq.foot", "Pound-force/sq.foot", "Pound-force/sq.inch (psi)", "Torr (mmHg,0'C)");
		this.factor[13] = new Array(1, 101325, 98066.5, 100000, 1333.22, 98.0638, 10000, 98066.5, 9.80665, 6894757, 100, 133.3224, 1, 1000, 1000000, 47.88026, 47.88026, 6894.757, 133.322);

		this.property[14] = "Temperature";
		this.unit[14] = new Array("Degrees Celsius ('C)", "Degrees Fahrenheit ('F)", "Degrees Kelvin ('K)", "Degrees Rankine ('R)");

		// factor for [1] and [3] explicitly set wrong to be able to distinguish the values
		// 3 = 0.5555555555 and 2 = 1

		this.factor[14] = new Array(1,  2, 3, 0.555555555555);
		this.tempIncrement = new Array(0, -32, -273.15, -491.67);

		this.property[15] = "Time";
		this.unit[15] = new Array("Second (sec)", "Day (mean solar)", "Day (sidereal)", "Hour (mean solar)", "Hour (sidereal)", "Minute (mean solar)", "Minute (sidereal)", "Month (mean calendar)", "Second (sidereal)", "Year (calendar)", "Year (tropical)", "Year (sidereal)");
		this.factor[15] = new Array(1, 8.640E4, 86164.09, 3600, 3590.17, 60, 60, 2628000, .9972696, 31536000, 31556930, 31558150);

		this.property[16] = "Velocity & Speed";
		this.unit[16] = new Array("Meter/second (m/sec)", "Foot/minute (ft/min)", "Foot/second (ft/sec)", "Kilometer/hour (kph)", "Knot (int'l)", "Mile (US)/hour (mph)", "Mile (nautical)/hour", "Mile (US)/minute", "Mile (US)/second", "Speed of light (c)", "Mach (STP)(a)");
		this.factor[16] = new Array(1, 5.08E-03, .3048, .2777778, .5144444, .44707, .514444, 26.8224, 1609.344, 299792458, 340.0068750);

		this.property[17] = "Viscosity";
		this.unit[17] = new Array("Newton-second/meter", "Centipoise", "Centistoke", "Sq.foot/second", "Poise", "Poundal-second/sq.foot", "Pound mass/foot-second", "Pound force-second/sq.foot", "Rhe", "Slug/foot-second", "Stoke");
		this.factor[17] = new Array(1, .001, .000001, 9.290304E-02, .1, 1.488164, 1.488164, 47.88026, 10, 47.88026, .0001);

		this.property[18] = "Volume & Capacity";
		this.unit[18] = new Array("Cubic Meter (m^3)", "Cubic centimeter", "Cubic millimeter", "Acre-foot", "Barrel (oil)", "Board foot", "Bushel (US)", "Cup", "Fluid ounce (US)", "Cubic foot", "Gallon (UK)", "Gallon (US,dry)", "Gallon (US,liq)", "Gill (UK)", "Gill (US)", "Cubic inch (in^3)", "Liter (new)", "Liter (old)", "Ounce (UK,fluid)", "Ounce (US,fluid)", "Peck (US)", "Pint (US,dry)", "Pint (US,liq)", "Quart (US,dry)", "Quart (US,liq)", "Stere", "Tablespoon", "Teaspoon", "Ton (register)", "Cubic yard");
		this.factor[18] = new Array(1, .000001, .000000001, 1233.482, .1589873, .002359737, .03523907, .0002365882, .00002957353, .02831685, .004546087, .004404884, .003785412, .0001420652, .0001182941, .00001638706, .001, .001000028, .00002841305, .00002957353, 8.8097680E-03, .0005506105, 4.7317650E-04, .001101221, 9.46353E-04, 1, .00001478676, .000004928922, 2.831685, .7645549);

		this.property[19] = "Volume Flow";
		this.unit[19] = new Array("Cubic meter/second", "Cubic foot/second", "Cubic foot/minute", "Cubic inches/minute", "Gallons (US,liq)/minute)");
		this.factor[19] = new Array(1, .02831685, .0004719474, 2.731177E-7, 6.309020E-05);

		var propertychoices = [];

		for(i=0;i<this.property.length;i++) {
			propertychoices.push({label: this.property[i], value: i});
		}
		this.propertymodel={
			value: this.calculator.conversionConfig['property'],
			choices: propertychoices
		};
		this.controller.setupWidget("property",{}, this.propertymodel);

		Mojo.Event.listen($("property"),Mojo.Event.propertyChange,this.onPropertyChange.bind(this));

		var fromitems = [];
		for(i=0;i<this.unit[this.calculator.conversionConfig['propertyindex']].length;i++) {
			fromitems.push({label: this.unit[this.calculator.conversionConfig['propertyindex']][i], value: this.factor[this.calculator.conversionConfig['propertyindex']][i]});
		}

		toFactorValue = this.calculator.conversionConfig['tovalue'];
		fromFactorValue = this.calculator.conversionConfig['fromvalue'];

		this.frommodel={value: fromFactorValue, choices: fromitems};
		this.tomodel={value: toFactorValue, choices: fromitems};
		this.controller.setupWidget("convertfrom",{},this.frommodel);		
		this.controller.setupWidget("convertto",{},this.tomodel);
	},

	onPropertyChange: function() {
		var selectedItem = this.propertymodel.value;
		var newfromitems = [];

		for(i=0;i<this.unit[selectedItem].length;i++) {
			newfromitems.push({label: this.unit[selectedItem][i], value: this.factor[selectedItem][i]});
		}
		this.frommodel.choices = newfromitems;
		this.tomodel.choices = newfromitems;
		this.tomodel.value = 1;
		this.frommodel.value = 1;
		this.controller.modelChanged(this.frommodel, this); 
		this.controller.modelChanged(this.tomodel, this); 
	},

	onApplyClick: function(event) {

		// set to value in case nothing has changed for the property

		if(typeof(this.propertymodel.value) !== 'number') {
			for(i=0;i<this.property.length;i++) {
				if(this.property[i] === this.propertymodel.value) {
					this.propertymodel.value = i;
					break;
				}
			}
		}

		var convertfromindex = '';
		for(i=0;i<this.unit[this.propertymodel.value].length;i++) {

			if(this.factor[this.propertymodel.value][i] == this.frommodel.value) {
				convertfromindex = i;
				break;
			}
		}


		var converttoindex = '';
		for(i=0;i<this.unit[this.propertymodel.value].length;i++) {		
			if(this.factor[this.propertymodel.value][i] == this.tomodel.value) {
				converttoindex = i;
				break;
			}
		}

		this.calculator.setConversions(
			this.frommodel.value, 
			this.tomodel.value, 
			this.property[$('property').getElementsByTagName('INPUT')[0].value], 
			this.propertymodel.value, 
			this.unit[this.propertymodel.value][convertfromindex], 
			this.unit[this.propertymodel.value][converttoindex]
		);

		this.controller.stageController.popScene();
	},
	cleanup: function() {
		this.unit = null;
		this.property = null;
		this.factor = null;
		this.calculator = null;
		this.frommodel = null;
		this.propertymodel = null;
		this.tomodel = null;
		var applyClickBind = this.onApplyClick.bindAsEventListener(this);
		var propertyChangeBind = this.onPropertyChange.bind(this);
		this.controller.stopListening('property', Mojo.Event.propertyChange, propertyChangeBind);
		this.controller.stopListening('apply', Mojo.Event.tap, applyClickBind);
	}
});