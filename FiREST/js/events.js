FiREST.Events = {
	databaseLoadedEvent: {
		type: "databaseLoadedEvent",
		message: "Database Loaded",
		time: new Date()
	},
	renderRequestPageEvent: {
		type: "renderRequestPageEvent",
		message: "Rendering Request Page",
		time: new Date(),
		handler: function(e){
			FiREST.Templates.renderRequestPage();
		}
	},
	renderRequestsPageEvent: {
		type: "renderRequestsPageEvent",
		message: "Rendering Requests Page",
		time: new Date(),
		handler: function(e){
			var requests = [];
			FiREST.DB.getAll('request', function(event){
				var cursor = event.target.result;
				if (cursor) {
					requests.push(cursor.value);
					cursor.continue();
				}else{
					FiREST.Templates.renderRequestsPage(requests);
				}
			});
		}
	},
	renderHistoryPageEvent: {
		type: "renderHistoryPageEvent",
		message: "Rendering History Page",
		time: new Date(),
		handler: function(e){
			var history = [];
			FiREST.DB.getAll('history', function(event){
				var cursor = event.target.result;
				if (cursor) {
					history.push(cursor.value);
					cursor.continue();
				}else{
					FiREST.Templates.renderHistoryPage(history);
				}
			});
		}
	},
	renderAboutPageEvent: {
		type: "renderAboutPageEvent",
		message: "Rendering About Page",
		time: new Date(),
		handler: function(e){
			FiREST.Templates.renderAboutPage();
		}
	},
	responseReceivedEvent: {
		type: "responseReceivedEvent",
		message: "Response received",
		time: new Date(),
		handler: function(e){
			console.log(e);
		}
	},
	addHeaderEvent: {
		type: "addHeaderEvent",
		message: "Adding header",
		time: new Date(),
		handler: function(e){
			var option = $(this).val();
			var sign = null;
			if( option.length > 0 ){
				if (option === 'custom'){
					sign = prompt("Add a new HTTP Header");
				}else{
					var sign = option;
				}
				
			}
			
			if(sign != null && sign.length > 0){
				var uuid = FiREST.UUID();
				var elId = 'remove-' + uuid;
				var html = '<li id="' + uuid + '">';
				html += '<a href="#" class="request-header" id="' + elId + '" data-li-id="' + uuid + '">';
				html += sign;
				html += '</a></li>';
				$('#headers-list').append(html).listview('refresh');
				$('#' + elId).click(FiREST.Events.deleteHeaderEvent);
			}
		}
	},
	deleteHeaderEvent: {
		type: "deleteHeaderEvent",
		message: "Deleting header",
		time: new Date(),
		handler: function(e){
			if ( confirm("Are you sure you want to delete this header?") ){
				var liId = $(this).data('li-id');
				$("#" + liId).remove();
				$('#headers-list').listview('refresh');
			}
		}
	},
	sendRequestEvent: {
		type: "sendRequestEvent",
		message: "Sending Request",
		time: new Date(),
		url: null,
		handler: function(e){
			console.log(e);
			$.mobile.loading( "show", FiREST.Helper.Loader.sendRequest );
			var method = e.request.method;
			var url = e.request.url;
			var entryContent = e.request.content;
			
			var historyEntry = {
				uuid: FiREST.UUID(),
				datetime: new Date(),
				method: method,
				url: url,
				headers: e.request.headers,
				content: entryContent,
				response: null
			};
			
			var xhr = new XMLHttpRequest({mozSystem: true});
			xhr.open(method, url, true);
			
			$(e.request.headers).each(function(k,v){
				xhr.setRequestHeader(k, v);
			});
			
            xhr.onreadystatechange = function () {
            	$.mobile.loading( 'hide' );
            	var result = {
        			uuid: historyEntry.uuid,
        			response:{
            			status: xhr.status,
            			headers: xhr.getHeaders(),
            			body: xhr.response,
        			}
            	};
            	historyEntry.response = result.response;
            	
                if (xhr.readyState === 4 && xhr.status !== 0) {
                	$.mobile.navigate(FiREST.Templates.templates.response.target);
                	FiREST.Templates.renderResponsePage(result);
                }
                
                FiREST.DB.save('history', historyEntry);
                
            };

            xhr.onerror = function () {
                alert("Failed");
            };
            
            xhr.send(entryContent);
		}
	}, 
	deleteHistoryEvent: {
		type: "deleteHistoryEvent",
		message: "Deleting History",
		time: new Date(),
		handler: function(e){
			e.preventDefault();
			if ( confirm("Are you sure you want to delete this entry?") ){
				var hId = $(this).data('history-id');
				$("#" + hId).remove();
				$('#history-list').listview('refresh');
				FiREST.DB.remove('history', hId);
			}
		}
	}, 
	showHistoryEvent: {
		type: "showHistoryEvent",
		message: "Showing History",
		time: new Date(),
		handler: function(e){
			e.preventDefault();
			var hId = $(this).data('history-id');
			FiREST.DB.get('history', hId, function(event){
				console.log(event);
				$.mobile.navigate(FiREST.Templates.templates.entry.target);
	        	FiREST.Templates.renderHistoryEntryPage(event.target.result);
			});
		}
	},
	clearHistoryEvent: {
		type: "showHistoryEvent",
		message: "Showing History",
		time: new Date(),
		handler: function(e){
			e.preventDefault();
			
			if ( !confirm("Are you sure you want to clear the history?") ){
				return;
			}
			
			var hId = $(this).data('history-id');
			
			var history = [];
			FiREST.DB.getAll('history', function(event){
				var cursor = event.target.result;
				if (cursor) {
					history.push(cursor.value);
					cursor.continue();
				}else{
					FiREST.DB.remove('history', history.map(
						function(el){
							return el.uuid;
						})
					);
					$.mobile.navigate(FiREST.Templates.templates.history.target);
				}
			});
			
			FiREST.DB.get('history', hId, function(event){
				console.log(event);
				$.mobile.navigate(FiREST.Templates.templates.entry.target);
	        	FiREST.Templates.renderHistoryEntryPage(event.target.result);
			});
		}
	},
	selectMethodEvent: {
		type: "selectMethodEvent",
		message: "Selected HTTP Method event",
		time: new Date(),
		handler: function(e){
			var method = $(this).val();
			if (method === 'POST' || method === 'PUT'){
				$('#request-content-container').show();
			}else{
				$('#request-content-container').hide();
			}
		}
	},
	saveRequestEvent: {
		type: "saveRequestEvent",
		message: "Saving Request event",
		time: new Date(),
		handler: function(e){
			var hId = $(this).data('history-id');
			FiREST.DB.get('history', hId, function(event){
				var entry = event.target.result;
				var request = {
					content: entry.content,
					headers: entry.headers,
					method: entry.method,
					url: entry.url,
					uuid: FiREST.UUID()
				}
				FiREST.DB.save('request', request);
				alert("Request Saved");
			});
		}
	},
	showRequestEvent: {
		type: "showRequestEvent",
		message: "Showing Request event",
		time: new Date(),
		handler: function(e){
			console.log(e);
			var id = $(this).data('request-id');
			FiREST.DB.get('request', id, function(event){
				$.mobile.navigate(FiREST.Templates.templates.detail.target);
				FiREST.Templates.renderRequestDetailPage(event.target.result);
			});
		}
	},
	deleteRequestEvent: {
		type: "deleteRequestEvent",
		message: "Deleting Request",
		time: new Date(),
		handler: function(e){
			if ( confirm("Are you sure you want to delete this saved request?") ){
				var hId = $(this).data('request-id');
				FiREST.DB.remove('request', hId);
				$.mobile.navigate(FiREST.Templates.templates.requests.target);
			}
		}
	},
};

FiREST.registerEvents = function(){
	$.each(FiREST.Events, function(name, event){
		if(event.handler){
			$(document).on(event.type, event.handler);
		}
	});
};