(function() {
	var display = $('#display');
	
	display.click(function(){
		$(this).html('');
	});
	
	$('#delete').click(function(){
		var current = display.html();
		setDisplay(current.substring(0, current.length-1));
	});
	
	$('.calculator-button').each(function(i, el) {
		$(this).click(function(ev) {
			var val = $(this).val();
			var disVal = display.html();
			if (val === '=') {
				resolve(display);
			} else {
				display.html(disVal + "" + val);
			}
		});
	});
	
	$('#sqrt').click(function(){
		var result = resolve(display);
		setDisplay(Math.sqrt(result));
	});
	
	$('#plus-minus').click(function(){
		var result = resolve(display);
		setDisplay(result * -1);
	});
	
	$('#shift').click(function(){
		console.log($(this).html());
		if ( $(this).html() === '&uarr;' ){
			$(this).html('&darr;');
		}else{
			$(this).html('&uarr;');
		}
	});
	
})();

function resolve(display){
	var disVal = display.html();
	var anon = new Function("return " + disVal);
	var result = anon();
	setDisplay(result);
	return result;
}

function setDisplay(value){
	$('#display').html(value.toString().substring(0,14));
}