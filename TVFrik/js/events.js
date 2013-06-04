TVFrik.Events = {
	databaseLoadedEvent: {
		type: "databaseLoadedEvent",
		message: "Database Loaded",
		time: new Date()
	},
	apiUpdateEvent: {
		type: "apiUpdateEvent",
		message: "Database Loaded",
		time: new Date()
	},
	apiMirrorEvent: {
		type: "apiMirrorEvent",
		message: "API Updated",
		time: new Date()
	},
	savedShowEvent: {
		type: "savedShowEvent",
		message: "Correctly saved show",
		time: new Date(),
		handler: function(e){
			if (e.success){
				alert('Added "' + e.entity.name + '" to your shows');
			}else{
				alert('Failed to add show "' + e.entity.name + '"');
			}
		}
	},
	renderSearchEvent: {
		type: "renderSearchEvent",
		message: "Rendering Search Page",
		time: new Date(),
		handler: function(e){
			TVFrik.Controller.Show.renderSearchEventHandler();
		}
	},
	renderShowsEvent: {
		type: "renderShowsEvent",
		message: "Rendering Shows Page",
		time: new Date(),
		handler: function(e){
			TVFrik.Controller.Show.renderShowsEventHandler();
		}
	},
	renderSeasonsEvent: {
		type: "renderSeasonsEvent",
		message: "Rendering seasons for show",
		time: new Date(),
		showId: null,
		handler: function(e){
			TVFrik.Controller.Show.renderSeasonsEventHandler(e.showId);
		}
	},
	renderSeasonEvent: {
		type: "renderSeasonEvent",
		message: "Rendering Episode list for Season",
		time: new Date(),
		showId: null,
		seasonId: null,
		handler: function(e){
			TVFrik.Controller.Show.renderSeasonEventHandler(e.showId, e.season);
		}
	},
	renderEpisodeEvent: {
		type: "renderEpisodeEvent",
		message: "Rendering Episode",
		time: new Date(),
		showId: null,
		season: null,
		episodeId: null,
		handler: function(e){
			TVFrik.Controller.Show.renderEpisodeEventHandler(e.showId, e.episodeId);
		}
	},
	renderStatsEvent: {
		type: "renderStatsEvent",
		message: "Rendering Stats Page",
		time: new Date(),
		handler: function(e){
			TVFrik.Templates.renderStats();
		}
	},
	renderToolsEvent: {
		type: "renderToolsEvent",
		message: "Rendering Tools Page",
		time: new Date(),
		handler: function(e){
			TVFrik.Templates.renderTools();
		}
	},
	changeEpisodeStateEvent: {
		type: "changeEpisodeStateEvent",
		message: "Changing episode state",
		time: new Date(),
		showId: null,
		episodeId: null,
		status: null,
		handler: function(e){
			TVFrik.Controller.Show.changeStatusEventHandler(
				e.showId,
				e.episodeId,
				e.status
			);
		}
	}
};

TVFrik.registerEvents = function(){
	$.each(TVFrik.Events, function(name, event){
		if(event.handler){
			$(document).on(event.type, event.handler);
		}
	});
};