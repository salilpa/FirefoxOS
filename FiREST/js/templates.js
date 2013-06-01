FiREST.Templates = {};

FiREST.Templates.templates = {
    request: {
    	template: 'request',
    	target: '#request',
    	data: {},
    },
    history: {
    	template: 'history',
    	target: '#history',
    	data: {}
    },
    response: {
    	template: 'response',
    	target: '#response',
    	data: {}
    },
    entry: {
    	template: 'entry',
    	target: '#entry',
    	data: {}
    },
};

FiREST.Templates.renderTemplate = function(tmpl_name, tmpl_data) {
	if ( !FiREST.Templates.renderTemplate.tmpl_cache ) { 
    	FiREST.Templates.renderTemplate.tmpl_cache = {};
    }
	
	if ( !FiREST.Global.caching ){
		FiREST.Templates.renderTemplate.tmpl_cache = {};
	}

    if ( !FiREST.Templates.renderTemplate.tmpl_cache[tmpl_name] ) {
    	var tmpl_dir = 'templates';
        var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';
        var template = FiREST.Templates.ajaxTemplate(tmpl_url);
        template = Handlebars.compile(template, tmpl_data);
    	FiREST.Templates.renderTemplate.tmpl_cache[tmpl_name] = template;
    }

    return FiREST.Templates.renderTemplate.tmpl_cache[tmpl_name](tmpl_data);
};

FiREST.Templates.ajaxTemplate = function(tmpl_url){
	var tmpl_string;
    $.ajax({
        url: tmpl_url,
        method: 'GET',
        dataType: 'html',
        async: false,
        success: function(data) {
            tmpl_string = data;
        }
    });
    return tmpl_string;
};

FiREST.Templates.renderPage = function(page){
	switch(page){
		case '#request':
			$.event.trigger(FiREST.Events.renderRequestPageEvent);
			break;
		case '#history':
			$.event.trigger(FiREST.Events.renderHistoryPageEvent);
			break;
	}
};

FiREST.Templates.renderRequestPage = function(){
	var template = this.templates.request;
	$(template.target).html(
		this.renderTemplate(
			template.template, {}
		)
	);
	$(template.target).trigger('pagecreate');
	
	$('.request-header').click(FiREST.Events.deleteHeaderEvent);
	$('#add-header-button').click(FiREST.Events.addHeaderEvent);
	
	$('#send-button').click(function(e){
		$.event.trigger(FiREST.Events.sendRequestEvent);
	});
};

FiREST.Templates.renderHistoryPage = function(history){
	var template = this.templates.history;
	$(template.target).html(
		this.renderTemplate(
			template.template, {history:history}
		)
	);
	$(template.target).trigger('pagecreate');
	
	$('.show-history-button').click(FiREST.Events.showHistoryEvent);
	$('.delete-history-button').click(FiREST.Events.deleteHistoryEvent);
	$('.clear-history-button').click(FiREST.Events.clearHistoryEvent);
};

FiREST.Templates.renderResponsePage = function(response){
	var template = this.templates.response;
	$(template.target).html(
		this.renderTemplate(
			template.template, response
		)
	);
	$(template.target).trigger('pagecreate');
};

FiREST.Templates.renderHistoryEntryPage = function(entry){
	var template = this.templates.entry;
	$(template.target).html(
		this.renderTemplate(
			template.template, entry
		)
	);
	$(template.target).trigger('pagecreate');
	
};