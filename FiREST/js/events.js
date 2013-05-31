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
			FiREST.DB.getAll('history', function(event){
				console.log(event);
				FiREST.Templates.renderHistoryPage(event.target.result.value);
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
			
			var history = {
				uuid: FiREST.UUID(),
				datetime: new Date(),
				method: method,
				url: url,
				headers: {},
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
            			body: xhr.response
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
            xhr.send();
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