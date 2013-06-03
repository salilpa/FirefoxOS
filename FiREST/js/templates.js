FiREST.Templates = {};

FiREST.Templates.templates = {
    request: {
    	template: 'request',
    	target: '#request',
    },
    requests: {
    	template: 'requests',
    	target: '#requests',
    },
    history: {
    	template: 'history',
    	target: '#history',
    },
    about: {
    	template: 'about',
    	target: '#about',
    },
    response: {
    	template: 'response',
    	target: '#response',
    },
    entry: {
    	template: 'entry',
    	target: '#entry',
    },
    detail: {
    	template: 'detail',
    	target: '#entry',
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
		case '#requests':
			$.event.trigger(FiREST.Events.renderRequestsPageEvent);
			break;
		case '#history':
			$.event.trigger(FiREST.Events.renderHistoryPageEvent);
			break;
		case '#about':
			$.event.trigger(FiREST.Events.renderAboutPageEvent);
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
	try {
		$(template.target).trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}
	
	$('#add-header-button').change(FiREST.Events.addHeaderEvent);
	$('#request-http-method').change(FiREST.Events.selectMethodEvent);
	$('#send-button').click(function(e){
		var event = FiREST.Events.sendRequestEvent
		event.request = {
			method: $('#request-http-method').val(),
			url: $('#request-url').val(),
			content: $('#request-content').val(),
			headers: {},
		};
		
		$('.request-header').each(function(){
			var header = $(this).html().trim().split(':');
			event.request.headers[header[0]] = header[1];
		});
		
		$.event.trigger(event);
	});
	$('#clear-session-button').click(function(e){
		console.log(document.cookie);
		document.cookie = '';
		alert("Session cleared");
	});
};

FiREST.Templates.renderRequestsPage = function(requests){
	var template = this.templates.requests;
	$(template.target).html(
		this.renderTemplate(
			template.template, {requests: requests}
		)
	);
	try {
		$(template.target).trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}
	$('.show-request-button').click(FiREST.Events.showRequestEvent)
}

FiREST.Templates.renderHistoryPage = function(history){
	var template = this.templates.history;
	$(template.target).html(
		this.renderTemplate(
			template.template, {history:history}
		)
	);
	try {
		$(template.target).trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}
	
	$('.show-history-button').click(FiREST.Events.showHistoryEvent);
	$('.delete-history-button').click(FiREST.Events.deleteHistoryEvent);
	$('.clear-history-button').click(FiREST.Events.clearHistoryEvent);
};

FiREST.Templates.renderAboutPage = function(){
	var template = this.templates.about;
	$(template.target).html(this.renderTemplate(template.template),{});
	try {
		$(template.target).trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}
	$('.link-button').click(function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		var activity = new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: url
			}
		});
 
		activity.onsuccess = function() {
		  console.log("Page visited");
		};
		 
		activity.onerror = function() {
		  console.log(this.error);
		};
	});
};

FiREST.Templates.renderResponsePage = function(response){
	var template = this.templates.response;
	$(template.target).html(
		this.renderTemplate(
			template.template, response
		)
	);
	try {
		$(template.target).trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}
	
	$('#save-request-button').click(FiREST.Events.saveRequestEvent);
};

FiREST.Templates.renderHistoryEntryPage = function(entry){
	var template = this.templates.entry;
	$(template.target).html(
		this.renderTemplate(
			template.template, entry
		)
	);
	try {
		$(template.target).trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}
	$('.delete-history-button').click(FiREST.Events.deleteHistoryEvent);
};

FiREST.Templates.renderRequestDetailPage = function(request){
	var template = this.templates.detail;
	$(template.target).html(
		this.renderTemplate(
			template.template, request
		)
	);
	try {
		$(template.target).trigger('pagecreate');
	} catch (e) {
		console.log(e);
	}
	$('#resend-request-button').click(function(e){
		var event = FiREST.Events.sendRequestEvent
		event.request = request;
		$.event.trigger(event);
	});
	
	$('#delete-request-button').click(FiREST.Events.deleteRequestEvent);
};