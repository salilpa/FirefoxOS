TVFrik.Templates = {};

TVFrik.Templates.templates = {
    shows: {
    	template: 'shows',
    	target: '#shows',
    	data: {shows:[]},
    },
    search: {
    	template: 'search',
    	target: '#search',
    	data: {}
    },
    seasons: {
    	template: 'seasons',
    	target: '#seasons',
    	data: {}
    },
    episodes: {
    	template: 'episodes',
    	target: '#episodes',
    	data: {}
    },
    episode: {
    	template: 'episode',
    	target: '#episode',
    	data: {}
    },
    stats: {
    	template: 'stats',
    	target: '#stats',
    	data: {}
    },
    tools: {
    	template: 'tools',
    	target: '#tools',
    	data: {}
    },
};

TVFrik.Templates.renderTemplate = function(tmpl_name, tmpl_data) {
	if ( !TVFrik.Templates.renderTemplate.tmpl_cache ) { 
    	TVFrik.Templates.renderTemplate.tmpl_cache = {};
    }
	
	if ( !TVFrik.Global.caching ){
		TVFrik.Templates.renderTemplate.tmpl_cache = {};
	}

    if ( !TVFrik.Templates.renderTemplate.tmpl_cache[tmpl_name] ) {
    	var tmpl_dir = 'templates';
        var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';
        var template = TVFrik.Templates.ajaxTemplate(tmpl_url);
        template = Handlebars.compile(template, tmpl_data);
    	TVFrik.Templates.renderTemplate.tmpl_cache[tmpl_name] = template;
    }

    return TVFrik.Templates.renderTemplate.tmpl_cache[tmpl_name](tmpl_data);
};

TVFrik.Templates.ajaxTemplate = function(tmpl_url){
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

TVFrik.Templates.renderPage = function(page){
	switch(page){
		case '#shows':
			$.event.trigger('renderShowsEvent');
			break;
		case '#search':
			$.event.trigger('renderSearchEvent');
			break;
		case '#stats':
			$.event.trigger('renderStatsEvent');
			break;
		case '#tools':
			$.event.trigger('renderToolsEvent');
			break;
	}
};

TVFrik.Templates.renderShows = function(shows){
	var template = this.templates.shows;
	$(template.target).html(
		this.renderTemplate(
			template.template, {
				shows:shows
			}
		)
	);
	$(template.target).trigger('pagecreate');
	
	$('.show-button').click(function(e){
		var event = TVFrik.Events.renderSeasonsEvent;
		event.showId = parseInt($(this).data('show'));
		$.event.trigger(event);
	});
};

TVFrik.Templates.renderSearch = function(){
	var template = TVFrik.Templates.templates.search;
	$(template.target).html(TVFrik.Templates.renderTemplate(template.template, template.data));
	$(template.target).trigger('pagecreate');
	$('#search-field').change(TVFrik.Controller.Search.searchHandler);
};

TVFrik.Templates.renderSeasons = function(show, seasons){
	var template = TVFrik.Templates.templates.seasons;
	$(template.target).html(
		TVFrik.Templates.renderTemplate(
			template.template, {
				show: show, seasons: seasons
			}
		)
	);
	$(template.target).trigger('pagecreate');
	
	$('.season-button').click(function(e){
		var event = TVFrik.Events.renderSeasonEvent;
		event.showId = parseInt($(this).data('show'));
		event.season = parseInt($(this).data('season'));
		$.event.trigger(event);
	});
};

TVFrik.Templates.renderSeason = function(show, season, episodes){
	var template = TVFrik.Templates.templates.episodes;
	$(template.target).html(
		this.renderTemplate(
			template.template, {
				show: show,
				season: season,
				episodes: episodes
			}
		)
	);
	$(template.target).trigger('pagecreate');
	
	$('.episode-button').click(function(e){
		var event = TVFrik.Events.renderEpisodeEvent;
		event.showId = parseInt($(this).data('show'));
		event.season = parseInt($(this).data('season'));
		event.episodeId = parseInt($(this).data('episode'));
		$.event.trigger(event);
	});
};

TVFrik.Templates.renderEpisode = function(show, episode){
	var template = TVFrik.Templates.templates.episode;
	$(template.target).html(
		this.renderTemplate(
			template.template, {
				show:show,
				episode:episode
			}
		)
	);
	$(template.target).trigger('pagecreate');
	
	$('#watched-checkbox, #downloaded-checkbox').click(function(e){
		$(this).attr("checked", !$(this).attr("checked"));
		var event = TVFrik.Events.changeEpisodeStateEvent;
		event.showId = parseInt($(this).data('show'));
		event.episodeId = parseInt($(this).data('episode'));
		event.status = $(this).data('status');
		$.event.trigger(event);
	});
};

TVFrik.Templates.renderStats = function(){
	var template = TVFrik.Templates.templates.stats;
	$(template.target).html(TVFrik.Templates.renderTemplate(template.template, template.data));
	$(template.target).trigger('pagecreate');
};

TVFrik.Templates.renderTools = function(){
	var template = TVFrik.Templates.templates.tools;
	$(template.target).html(TVFrik.Templates.renderTemplate(template.template, template.data));
	$(template.target).trigger('pagecreate');
};