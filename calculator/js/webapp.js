(function() {
	var display = $('#display');
	
	display.click(function(){
		$(this).html('');
	});
	
	$('.calculator-button').each(function(i, el) {
		$(this).click(function(ev) {
			var val = $(this).val();
			var disVal = display.html();
			if (val === '=') {
				var anon = new Function("return " + disVal);
				display.html(anon());
			} else {
				display.html(disVal + "" + val);
			}
		});
	});
})();
