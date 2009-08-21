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
	},
	toScientific: function(s,eng){
		var exponentVal=0;
		var isNegative=false;
		if(s.length>0&&s.charAt(0)=='-'){
			isNegative=true;
			s=s.substring(1,s.length);
		}
		var regex_splitter=s.split(new RegExp('[eE]'));
		if(regex_splitter.length>1){
			exponentVal=parseInt(regex_splitter[1]);
			s=regex_splitter[0];
		}
		regex_splitter=s.split(/[\.]/);
		if(regex_splitter.length>1){
			s=regex_splitter[0]+regex_splitter[1];
			exponentVal+=regex_splitter[0].length-1;
		}else{
			exponentVal+=s.length-1;
		}
		var leadingZeros=0;
		for(leadingZeros=0;leadingZeros<s.length&&s.charAt(leadingZeros)=='0';leadingZeros++){
			exponentVal=exponentVal-1;
		}
		s=s.substring(leadingZeros,s.length);
		var moveDecimal;
		if(eng){
			if(exponentVal>=0){
				moveDecimal=(exponentVal%3)+1;
			}else{
				moveDecimal=4-((-exponentVal)%3);
				if(moveDecimal==4){
					moveDecimal=1;
				}
			}
			exponentVal-=(moveDecimal-1);
		}else{
			moveDecimal=1;
		}
		var trailingZeros='';
		for(var i=s.length;i<moveDecimal;i++){
			trailingZeros+='0';
		}
		return(
			(isNegative?'-':'')+
			((s.length==0)?'0':s.substring(0,moveDecimal))+
			((s.length<=moveDecimal)?trailingZeros:('.'+s.substring(moveDecimal,s.length)))+
			((s.length==0||exponentVal==0)?'':('e'+exponentVal))
		);
	}
}