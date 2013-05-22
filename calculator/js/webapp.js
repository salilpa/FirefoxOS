(function() {
	var display = $('#display');
	
	display.click(function(){
		$(this).html('');
	});
	
	$('#delete').click(function(){
		var current = display.html();
		display.html(current.substring(0, current.length-1));
	});
	
	$('.calculator-button').each(function(i, el) {
		$(this).click(function(ev) {
			var val = $(this).val();
			var disVal = display.html();
			if (val === '=') {
				resolve(disVal);
			} else {
				display.html(disVal + "" + val);
			}
		});
	});
	
	$('#shift').click(function(){
		if ( $(this).hasClass('active') ){
			$(this).removeClass('active').html('&uarr;');
		}else{
			$(this).addClass('active').html('&darr;');
		}
		
		$('.calculator-button').toggle();
		$('.operator-button').toggle();
	});
	
	$('.operator-button').click(function(e){
		var expr = display.html();
		var result = resolve(expr);
		result = applyOperator(expr, result, e.target.id);
		setDisplay(result);
	});
	
})();

function resolve(expr){
	try {
		var anon = new Function("return " + expr);
		var result = anon();
		setDisplay(result);
		return result;
	} catch (e) {
		console.log("Invalid Expression " + expr);
	}
	return NaN;
}

function setDisplay(value){
	var display = $('#display');
	if ( isNaN(value) ){
		display.html('ERR');
	}else{
		display.html(value.toString().substring(0,14));
	}
}

function applyOperator(expr, value, operator){
	if ( isNaN(value) ) return '';
	
	var result = NaN;
	if ( operator === 'sqrt' ){
		result = Math.sqrt(value);
	}else if ( operator === 'x2'){
		result = Math.pow(value,2);
	}else if ( operator === 'x3'){
		result = Math.pow(value,3);
	}else if ( operator === 'cos'){
		result = Math.cos(value);
	}else if ( operator === 'sin'){
		result = Math.sin(value);
	}else if ( operator === 'tan'){
		result = Math.tan(value);
	}else if ( operator === 'acos'){
		result = Math.acos(value);
	}else if ( operator === 'asin'){
		result = Math.asin(value);
	}else if ( operator === 'atan'){
		result = Math.atan(value);
	}else if ( operator === 'exp'){
		result = Math.exp(value);
	}else if ( operator === 'log'){
		result = Math.log(value);
	}else if ( operator === 'plus-minus'){
		result = value * -1;
	}else if ( operator === 'factorial'){
		result = factorial(value);
	}else if ( operator === 'percent'){
		result = percentage(expr);
	}else if ( operator === 'pow'){
		result = powerOfExpression(expr);
	}
	return result;
}

function factorial(value){
	if ( value < 0 ) return NaN;
	if ( value === 0 ) return 1;
	return value * factorial(value - 1);
}

function percentage(expr){
	var result = NaN;
	var vals = expr.split(/([-+\/\*])/);
	if ( vals.length === 3 ){
		var x = parseNumber(vals[0]);
		var y = parseNumber(vals[2]);
		var op = vals[1];
		
		if ( !isNaN(x) && !isNaN(y) ){
			y = ( x * y ) / 100;
			result = resolve(x + op + y);
		}
	}
	return result;
}

function powerOfExpression(expr){
	var result = NaN;
	var vals = expr.split(/(\^)/);
	if ( vals.length === 3 ){
		var x = parseNumber(vals[0]);
		var y = parseNumber(vals[2]);
		
		if ( !isNaN(x) && !isNaN(y) ){
			result = Math.pow(x, y);
		}
	}
	return result;
}

function parseNumber(expr){
	try {
		if ( contains(expr, '.') ){
			return parseFloat(expr);
		}else{
			return parseInt(expr);
		}
	} catch (e) {
		console.log("Failed to parse number " + expr);
	}
	return NaN;
}

function contains(str, expr){
	return str.indexOf(expr) !== -1;
}