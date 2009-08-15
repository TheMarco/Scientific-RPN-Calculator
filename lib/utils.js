var Utils = {
	renderStackInfo: function(stack) {

		return '<span class="indicator truncating-text">b:' + stack[4].toString() + '</span><span class="indicator truncating-text">a:' + stack[3].toString() + '</span><span class="indicator truncating-text">z:' + stack[2].toString() + '</span><span class="indicator truncating-text">y:' + stack[1].toString() + '</span>';
	},
	renderDisplay: function(data) {
		//return data;

		if(data.toString() == 'undefined' || data.toString() == 'NaN' || data.toString() == 'Infinity' || data.toString() == '-Infinity' || data == 'ERROR') {
			return '<span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit"></span><span class="digit ne"></span><span class="digit nr"></span><span class="digit nr"></span><span class="digit n0"></span><span class="digit nr"></span>';
		}
		data = data.toString();

		var output = '';
		var dotpos = -1;

		for(i=0;i<21-(data.length);i++) {
			output = output + '<span class="digit"></span>';
		}
		for(j=0;j<data.length;j++) {
			if(data[j] === '.') {
				if(j != (data.length-1)) {
					output = output + '<span class="digit dotn' + data[j+1] + '"></span>';
					j++;
				}
			}
			else {
				if(data[j] === '-') {
					output = output + '<span class="digit nminus"></span>';
				}
				else {
					if(data[j] === '+') {
						// do nothing with a +
					}
					else {
						output = output + '<span class="digit n' + data[j] + '"></span>';
					}
				}
			}
		}
		return output;
	}
}