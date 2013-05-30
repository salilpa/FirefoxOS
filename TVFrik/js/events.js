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
		time: new Date()
	},
	renderSearchEvent: {
		type: "renderSearchEvent",
		message: "Rendering Search Page",
		time: new Date(),
	},
	renderShowsEvent: {
		type: "renderShowsEvent",
		message: "Rendering Shows Page",
		time: new Date(),
	},
	renderSeasonsEvent: {
		type: "renderSeasonsEvent",
		message: "Rendering seasons for show",
		time: new Date(),
		showId: null,
	},
	renderSeasonEvent: {
		type: "renderSeasonEvent",
		message: "Rendering Episode list for Season",
		time: new Date(),
		showId: null,
		seasonId: null
	},
	renderEpisodeEvent: {
		type: "renderEpisodeEvent",
		message: "Rendering Episode",
		time: new Date(),
		showId: null,
		season: null,
		episodeId: null
	},
	renderStatsEvent: {
		type: "renderStatsEvent",
		message: "Rendering Stats Page",
		time: new Date(),
	},
	renderToolsEvent: {
		type: "renderToolsEvent",
		message: "Rendering Tools Page",
		time: new Date(),
	},
	changeEpisodeStateEvent: {
		type: "changeEpisodeStateEvent",
		message: "Changing episode state",
		time: new Date(),
		showId: null,
		episodeId: null,
		status: null
	}
};