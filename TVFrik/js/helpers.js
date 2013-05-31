TVFrik.Helper = {};

TVFrik.Helper.compare = function (lvalue, operator, rvalue, options) {

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

TVFrik.Helper.stars = function(rating){
	var res = "";
	for (var i = 0; i <= 10; i++){
		if (i < rating){
			res += '<i class="ui-icon-icon-star"></i>';
		}else{
			res += '<i class="ui-icon-icon-star-empty"></i>';
		}
	}
	return new Handlebars.SafeString(res);
};

TVFrik.Helper.episodeStatus = function(episode){
	var res = "";
	
	if (episode.watched){
		res = '<span class="episode-status watched"><i class="ui-icon-icon-eye-open"></i></span>';
	}else if (episode.downloaded){
		res = '<span class="episode-status downloaded"><i class="ui-icon-icon-cloud-download"></i></span>';
	}else{
		res = '<span class="episode-status unwatched"><i class="ui-icon-icon-eye-close"></i></span>';
	}
	
	return new Handlebars.SafeString(res);
};

TVFrik.Helper.header = function(title, options){
	var hasBackButton = options.hash['hasBackButton'] === "true";
	return TVFrik.Templates.renderTemplate('header',{
		title: title,
		hasBackButton: hasBackButton
	});
};

TVFrik.Helper.footer = function(page){
	var buttons = [
        {title:'My Shows', icon:'icon-facetime-video', url: '#shows'},
        {title:'Add Show', icon:'icon-plus', url: '#search'},
        {title:'Stats', icon:'icon-th-list', url: '#stats'},
        {title:'Tools', icon:'icon-wrench', url: '#tools'},
    ];
	
	$.each(buttons, function(){
		this.active = this.url === page;
	});
	
	return TVFrik.Templates.renderTemplate('footer',{
		buttons: buttons
	});
};