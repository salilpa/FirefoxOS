(function() {
	console.log("App Init");
	
	Handlebars.registerHelper('stars', TVFrik.Helper.stars);
	Handlebars.registerHelper('episodeStatus', TVFrik.Helper.episodeStatus);
	Handlebars.registerHelper('header', TVFrik.Helper.header);
	Handlebars.registerHelper('footer', TVFrik.Helper.footer);
	
	console.log("Helpers registered");
	
	$(document).on('pagechange', function(event, obj){
		var page = $.mobile.path.parseUrl(obj.absUrl).hash;
		if(page){
			TVFrik.Templates.renderPage(page);
		}
	});
	
	// Initialize DB and API
	TVFrik.DB.load();
	
	// timeout after 10 seconds
	if ( $.mobile.path.parseUrl(document.URL).hash.length == 0){
		var tries = 0, steps = 10;
		var intervalId = window.setInterval(function(){
			if (tries < steps){
				tries++;
			}else{
				window.clearInterval(intervalId);
				$.mobile.navigate(TVFrik.Templates.templates.shows.target);
			}
			
		}, 1000);
		
		$(document).on(TVFrik.Events.databaseLoadedEvent.type, function(e){
			console.log(e.message);
			updateProgressBar(2);
			TVFrik.Controller.Update.update();
		});
		
		$(document).on(TVFrik.Events.apiUpdateEvent.type, function(e){
			console.log(e.message);
			updateProgressBar(3);
			TVFrik.Controller.Mirror.update();
		});
		
		$(document).on(TVFrik.Events.apiMirrorEvent.type, function(e){
			console.log(e.message);
			updateProgressBar(4);
			window.clearInterval(intervalId);
			$.mobile.navigate(TVFrik.Templates.templates.shows.target);
		});
	}
	
	$(document).on(TVFrik.Events.savedShowEvent.type, function(e){
		if (e.success){
			alert('Added "' + e.entity.name + '" to your shows');
		}else{
			alert('Failed to add show "' + e.entity.name + '"');
		}
	});
	
	$(document).on('renderShowsEvent', function(renderShowsEvent){
		console.log(renderShowsEvent.message);
		TVFrik.Controller.Show.renderShowsEventHandler();
	});
	
	$(document).on('renderSearchEvent', function(renderSearchEvent){
		console.log(renderSearchEvent.message);
		TVFrik.Controller.Show.renderSearchEventHandler();
	});
	
	$(document).on('renderSeasonsEvent', function(renderSeasonsEvent){
		console.log(renderSeasonsEvent.message);
		TVFrik.Controller.Show.renderSeasonsEventHandler(renderSeasonsEvent.showId);
	});
	
	$(document).on('renderSeasonEvent', function(renderSeasonEvent){
		console.log(renderSeasonEvent.message);
		TVFrik.Controller.Show.renderSeasonEventHandler(
			renderSeasonEvent.showId,
			renderSeasonEvent.season
		);
	});
	
	$(document).on('renderEpisodeEvent', function(renderEpisodeEvent){
		console.log(renderEpisodeEvent.message);
		TVFrik.Controller.Show.renderEpisodeEventHandler(
			renderEpisodeEvent.showId,
			renderEpisodeEvent.episodeId
		);
	});
	
	$(document).on('renderStatsEvent', function(renderStatsEvent){
		console.log(renderStatsEvent.message);
		TVFrik.Templates.renderStats();
	});
	
	$(document).on('renderToolsEvent', function(renderToolsEvent){
		console.log(renderToolsEvent.message);
		TVFrik.Templates.renderTools();
	});
	
})();

function updateProgressBar(step){
	var steps = 5;
	$('#progress-bar').val(step * 100/steps);
	$('#progress-bar').slider('refresh');
}