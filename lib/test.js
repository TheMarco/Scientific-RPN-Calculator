<script type="text/javascript" src="utils.js"></script>
<input type="text" id="number" name="number" />
<input type="text" id="result" name="result" />
<input type="button" value="do it" onClick="render()"/>
<script type="text/javascript">

function render() {
	var number = document.getElementById('number').value;
	document.getElementById('result').value = do_sci(number);
}

function do_sci(number) {
	sciResult = Utils.toScientific(number, false);
	return sciResult;
}


</script>