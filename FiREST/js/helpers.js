FiREST.Helper = {};

FiREST.Helper.compare = function (lvalue, operator, rvalue, options) {

    var operators, result;
    
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    
    result = operators[operator](lvalue, rvalue);
    
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

};

FiREST.Helper.header = function(title, options){
	var hasBackButton = options.hash['hasBackButton'] === "true";
	return FiREST.Templates.renderTemplate('header',{
		title: title,
		hasBackButton: hasBackButton
	});
};

FiREST.Helper.footer = function(page){
	var buttons = [
        {title:'Request', icon:'icon-rocket', url: '#request'},
        {title:'History', icon:'icon-tasks', url: '#history'},
    ];
	
	$.each(buttons, function(){
		this.active = this.url === page;
	});
	
	return FiREST.Templates.renderTemplate('footer',{
		buttons: buttons
	});
};

FiREST.Helper.HTTPheaders = function(headers){
	var res = "";
	$.each(headers, function(k,v){
		res += '<li>' + k + ': ' + v + '</li>';
	});
	
	return new Handlebars.SafeString(res);
};