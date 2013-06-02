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
			var sign = prompt("Add a new HTTP Header");
			if(sign != null && sign.length > 0){
				var uuid = FiREST.UUID();
				var html = '<li id="' + uuid + '">';
				html += '<a href="#" class="request-header" data-li-id="' + uuid + '">';
				html += sign;
				html += '</a></li>';
				$('#headers-list').append(html).listview('refresh');
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
			var method = $('#select-http-method').val();
			var url = $('#request-url').val();
			var content = $('#request-content').val();
			
			var history = {
				uuid: FiREST.UUID(),
				datetime: new Date(),
				method: method,
				url: url,
				headers: {},
				content: content.length > 0 ? content : null,
				response: null
			};
			
			var xhr = new XMLHttpRequest({mozSystem: true});
			xhr.open(method, url, true);
			
			$('.request-header').each(function(){
				var header = $(this).html().trim().split(':');
				xhr.setRequestHeader(header[0], header[1]);
				history.headers[header[0]] = header[1];
			});
			
            xhr.onreadystatechange = function () {
            	var result = {
        			response:{
            			status: xhr.status,
            			headers: xhr.getHeaders(),
            			body: xhr.response,
        			}
            	};
            	history.response = result.response;
            	
                if (xhr.readyState === 4 && xhr.status !== 0) {
                	$.mobile.navigate(FiREST.Templates.templates.response.target);
                	FiREST.Templates.renderResponsePage(result);
                }
                
                FiREST.DB.save('history', history);
                
            };

            xhr.onerror = function () {
                alert("Failed");
            };
            
            xhr.send(content);
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
	}
};

FiREST.registerEvents = function(){
	$.each(FiREST.Events, function(name, event){
		if(event.handler){
			$(document).on(event.type, event.handler);
		}
	});
};