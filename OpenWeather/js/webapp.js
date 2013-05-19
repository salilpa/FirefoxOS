OpenWeatherMapRequest = function(options) {
	this.url = options.url ? options.url : 'http://api.openweathermap.org/data/2.5/forecast/daily';
	this.units = options.units ? options.units : 'metric';
	this.days = options.days ? options.days : 5;
	this.city = options.city ? options.city : null;
	this.lat = options.lat ? options.lat : null;
	this.lon = options.lon ? options.lon : null;
	this.cityId = options.cityId ? options.cityId : null;
	this.response = null;
	
	this.getURL = function(){
		if (this.citiId != null){
			return this.url + "?id=" + this.cityId + "&units=" + 
			this.units + "&cnt=" + this.days;
		}else if (this.city != null){
			return this.url + "?q=" + this.city + "&units=" + 
				this.units + "&cnt=" + this.days;
		}else if( this.lat != null && this.lon != null){
			return this.url + "?lat=" + this.lat + "&lon=" + this.lon + 
				"&units=" + this.units + "&cnt=" + this.days;
		}else{
			throw new Error("Incorrect Request");
		}
	};
	
	this.call = function(){
		var self = this;
		var xhr = new XMLHttpRequest({mozSystem: true});
        xhr.open("GET", self.getURL(), true);
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
            	console.log("Got response for " + self.getURL());
                self.response = JSON.parse(xhr.response);
            }
        };

        xhr.onerror = function () {
        	alert("Failed to reach OpenWeatherMap.org API server");
        };
        
        xhr.send();
	};
};

function renderResponse(request){
	$('#accordion').html('');
	$('#location-display').val(request.response.city.name);
	$('#location-display').data('city-id', request.response.city.id);
	$.each(request.response.list, function(i, el){
		renderAccordion(i, el, request.units);
	});
}

function renderProgressBar(time){
	// time is a number between 0 and 20
	var percentage = time * 100 / 20;
	var html = '';
	if (time >= 0 && time < 6){
		// normal
		html += '<div class="bar bar-success" style="width: ' + percentage + '%;"></div>';
	}else if (time >= 6 && time < 16){
		// warning
		percentage = percentage - 25;
		html += '<div class="bar bar-success" style="width: 25%;"></div>';
		html += '<div class="bar bar-warning" style="width: ' + percentage + '%;"></div>';
	}else if (time >= 16){
		//danger
		percentage = percentage - 80;
		html += '<div class="bar bar-success" style="width: 25%;"></div>';
		html += '<div class="bar bar-warning" style="width: 55%;"></div>';
		html += '<div class="bar bar-danger" style="width: ' + percentage + '%;"></div>';
	}
	
	$('#progress').html(html).show();
}

function renderAccordion(index, obj, units){
	var date = new Date(obj.dt * 1000);
	var day = date.getHours() <= 18 && date.getHours() > 6; // if we had sunset time
	var unit = units === 'metric' ? '°C' : '°F';
	var weather = obj.weather[0];
	var iconCode = weather.icon.substring(0,2);
	var icon = day ? iconCode + "d.png" : iconCode + "n.png";
	var acc = '<div class="accordion-group"><div class="accordion-heading">';
	acc += '<a class="accordion-toggle" data-toggle="collapse" ';
	acc += 'data-parent="#accordion" href="#collapse-';
	acc += index;
	acc += '"><img src="http://openweathermap.org/img/w/';
	acc += icon;
	acc += '" align="left">';
	acc += '<div><div class="date">';
	acc += date.toUTCString().substring(0,17).trim(); // this will fail for some edge case
	acc += '</div><div class="weather">';
	acc += weather.main + ' ' + obj.temp.day.toFixed() + unit;
	acc += '</div></div></a></div><div id="collapse-';
	acc += index;
	acc += '" class="accordion-body collapse"><div class="accordion-inner">';
	acc += '<p>Pressure: ' + obj.pressure + 'hpa</p>';
	acc += '<p>Humidity: ' + obj.humidity + '%</p>';
	acc += '<p>Wind: ' + obj.speed + 'm/s, ' + obj.deg + '°</p>';
	acc += '</div></div></div>';
	acc += '';
	$('#accordion').append(acc);
}

function clearSearchOptions(){
	window.lastCall = null;
	$('#location-display').removeData('lat').removeData('lon').removeData('city-id');
}

(function() {
	// set a global var with the last request date
	// with this we can check when to call the API again
	window.lastCall = null; 
	
	var locationDisplay = $('#location-display');
	$('#location-button').click(function(){
		navigator.geolocation.getCurrentPosition(function (position) {
			clearSearchOptions();
			var location = position.coords.latitude + ", " + position.coords.longitude;
			locationDisplay.val(location);
			locationDisplay.data('lat', position.coords.latitude);
			locationDisplay.data('lon', position.coords.longitude);
		},function (position) {
			alert("Failed to get your current location.");
        });
	});
	
	locationDisplay.change(function(){
		clearSearchOptions();
	});
	
	$('#search-button').click(function(){
		
		var now = new Date();
		if( window.lastCall != null ){
			var interval = now - window.lastCall;
			if (interval < 600000){ //10 minutes
				console.log("No need to call the API again");
				var timeleft = 10 - (interval / 60000 );
				alert("To reduce load on the OpenWeatherMap.org API you're only allowed to check the weather every 10 minutes. Please wait " + timeleft.toFixed() + " minutes and try again");
				return false;
			}
		}
		
		var request = new OpenWeatherMapRequest({});
		var location = locationDisplay.val();
		
		if( $('#imperial-button').hasClass('active') ){
			request.units = 'imperial';
		}else{
			request.units = 'metric';
		}
		
		if ( locationDisplay.data('city-id') != undefined ){
			request.cityId = locationDisplay.data('city-id');
		}
		
		if (locationDisplay.data('lat') == null){
			request.city = location;
		}else{
			request.lat = locationDisplay.data('lat');
			request.lon = locationDisplay.data('lon');
		}
		
		console.log("Getting Forecast data from " + request.getURL());
		
		request.call();
		
		var tries = 0;
		var intervalID = window.setInterval(function(){
			if (request.response != null){
				console.log("Got the response");
				try{
					renderResponse(request);
				}catch(err){
					alert("Woops. Something failed. Try again later.");
					console.log(err);
				}finally{
					window.clearInterval(intervalID);
					window.lastCall = new Date();
					$('#progress').hide();
				}
			}else if ( tries > 20){
				alert("Failed to reach OpenWeatherMap.org API server after 20 seconds");
				$('#progress').hide();
				window.clearInterval(intervalID);
			}else{
				console.log("Checking for response try " + tries);
				tries++;
				renderProgressBar(tries);
			}
		}, 1000);
	});
	
})();
