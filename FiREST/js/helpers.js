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

FiREST.Helper.footer = function(page){
	var buttons = [
        {title:'Request', icon:'icon-rocket', url: '#request'},
        {title:'Saved', icon:'icon-download-alt', url: '#requests'},
        {title:'History', icon:'icon-tasks', url: '#history'},
        {title:'About', icon:'icon-star', url: '#about'},
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

FiREST.Helper.historyStatus = function(history){
	var res = "";
	if (history.response.status === 0){
		res = '<i class="ui-icon-icon-flag" style="color: red;"></i>';
	}else if (history.response.status === 200){
		res = '<i class="ui-icon-icon-ok-sign"></i>';
	}else{
		res = '<i class="ui-icon-icon-info-sign"></i>';
	}
	return new Handlebars.SafeString(res);
}

FiREST.Helper.builtInHeaders = {
	headers: {
		acceptJson: 'Accept: application/json',
		acceptXml: 'Accept: application/xml',
		acceptText: 'Accept: text/plain',
		contentJson: 'Content-Type: application/json',
		contentXml: 'Content-Type: application/xml',
		contentForm: 'Content-Type: application/x-www-form-urlencoded',
		acceptCharsetUTF8: 'Accept-Charset: utf-8',
		acceptCharsetISO: 'Accept-Charset: iso-8859-1',
		noCache: 'Cache-Control: no-cache',
	},
	helper: function(){
		var res = "";
		$.each(FiREST.Helper.builtInHeaders.headers, function(k, v){
			res += '<option value="' + v + '">' + v + '</option>';
		});
		return new Handlebars.SafeString(res);
	}
};

FiREST.Helper.Loader = {
	sendRequest: {
		text:'Sending Request', 
		textonly: true, 
		textVisible: true, 
		theme: 'a'
	}
}
