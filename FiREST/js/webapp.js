(function() {
	console.log("App Init");
	
	Handlebars.registerHelper('footer', FiREST.Helper.footer);
	Handlebars.registerHelper('headers', FiREST.Helper.HTTPheaders);
	Handlebars.registerHelper('historyStatus', FiREST.Helper.historyStatus);
	Handlebars.registerHelper('builtInHeaders', FiREST.Helper.builtInHeaders.helper);
	
	console.log("Helpers registered");
	
	$(document).on('pagechange', function(event, obj){
		var page = $.mobile.path.parseUrl(obj.absUrl).hash;
		if(page){
			FiREST.Templates.renderPage(page);
		}
	});
	
	// Initialize DB and API
	FiREST.DB.load();
	
	// timeout after 10 seconds
	if ( $.mobile.path.parseUrl(document.URL).hash.length == 0){
		var tries = 0, steps = 10;
		var intervalId = window.setInterval(function(){
			if (tries < steps){
				tries++;
			}else{
				window.clearInterval(intervalId);
				$.mobile.navigate(FiREST.Templates.templates.request.target);
			}
			
		}, 1000);
		
		$(document).on(FiREST.Events.databaseLoadedEvent.type, function(e){
			updateProgressBar(5);
			window.clearInterval(intervalId);
			$.mobile.navigate(FiREST.Templates.templates.request.target);
		});
		
	}
	
	FiREST.registerEvents();
	
})();

function updateProgressBar(step){
	var steps = 5;
	$('#progress-bar').val(step * 100/steps);
	$('#progress-bar').slider('refresh');
}

FiREST.UUID = function (){
	var ts = new Date().getTime().toString();
	return Math.floor((1 + Math.random()) * 0x10000).toString(16) + ts;
};

XMLHttpRequest.prototype.getHeaders = function(){
	var header = this.getAllResponseHeaders().split(/\s/);
	var headers = [];
	for(var i = 0; i < header.length; i++ ){
		var h = header[i];
		if(/^[A-Z]\S+:$/.test(h)){
			headers.push(h.replace(/:$/,''));
		}
	}
	
	var result = {};
	
	for ( var i = 0; i < headers.length; i++ ) {
		var h = headers[i];
		result[h] = this.getResponseHeader(h);
	}
	
	return result;
	
};