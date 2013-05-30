TVFrik.Controller = {};

TVFrik.Controller.Show = {
	renderShowsEventHandler: function(){
		var shows = [];
		TVFrik.DB.getAll('show', function(event){
			var cursor = event.target.result;
			if (cursor) {
				// calculate unwatched show episodes
				var show = cursor.value;
				show.unwatched = 0;
				for ( var j = 0; j < show.episodes.length; j++ ) {
					if (!show.episodes[j].watched){
						show.unwatched += 1;
					}
				}
				shows.push(show);
				cursor.continue();
			} else {
				TVFrik.Templates.renderShows(shows);
			}
		});
	},
	renderSeasonsEventHandler: function(showId){
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			var seasons = [];
			for ( var int = 0; int < show.seasons.length; int++) {
				seasons.push({
					show: show.apiId,
					season: show.seasons[int],
					unwatched: 0
				});
			}
			
			for (var i = 0; i < show.episodes.length; i++){
				var ep = show.episodes[i];
				if(!ep.watched){
					seasons[ep.season].unwatched += 1;
				}
			}
			TVFrik.Templates.renderSeasons(show, seasons);
		});
	},
	renderSeasonEventHandler: function(showId, season){
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			var episodes = [];
			for ( var i = 0; i < show.episodes.length; i++) {
				var episode = show.episodes[i];
				if( episode.season === season ){
					episode.show = show.apiId;
					episodes.push(episode);
				}
			}
			TVFrik.Templates.renderSeason(show, season, episodes);
		});
	},
	renderEpisodeEventHandler: function(showId, episodeId){
		TVFrik.DB.get('show', showId, function(event){
			var show = event.target.result;
			for ( var i = 0; i < show.episodes.length; i++) {
				var episode = show.episodes[i];
				if( episode.apiId === episodeId ){
					episode.show = show.apiId;
					TVFrik.Templates.renderEpisode(show, episode);
				}
			}
		});
	},
	renderSearchEventHandler: function(){
		TVFrik.Templates.renderSearch();
	}
};

TVFrik.Controller.Update = {
	update: function(){
		var action = TVFrik.API.routes.time;
		action.handler = this.apiHandler;
		TVFrik.API.call(action);
	},
	apiHandler: function(response){
		response = JXON.build(response);
		var lastUpdate = new Date(response.items.time * 1000);
		TVFrik.DB.save('config', {
			key: 'lastUpdate',
			value: lastUpdate
		}, TVFrik.Events.apiUpdateEvent);
	}
};

TVFrik.Controller.Mirror = {
	update: function(){
		var action = TVFrik.API.routes.mirrors;
		action.handler = this.apiHandler;
		TVFrik.API.call(action);
	},
	apiHandler: function(response){
		response = JXON.build(response);
		var mirror = response.mirrors.mirror.mirrorpath;
		TVFrik.DB.save('config', {
			key: 'mirror',
			value: mirror
		}, TVFrik.Events.apiMirrorEvent);
	}
};

TVFrik.Controller.Search = {
	search: function(search){
		var action = TVFrik.API.routes.searchByName;
		action.params.seriesname = search;
		action.handler = this.resultHandler;
		TVFrik.API.call(action);
	},
	searchHandler: function(e){
		e.preventDefault();
		var search = $(this).val();
		TVFrik.Controller.Search.search(search);
	},
	resultHandler: function(response){
		response = JXON.build(response);
		var html = "";
		$.each(response.data.series, function(){
			html += '<li><a href="#" class="add-dialog" id="';
			html += this.seriesid;
			html += '">';
			html += this.seriesname;
			html += '</a></li>';
		});
		
		$('#search-results').html(html);
		$('#search-results').listview("refresh");
		
		$('.add-dialog').click(TVFrik.Controller.Search.addShowHandler);
	},
	addShowHandler: function(e){
		var name = $(this).html();
		var id = $(this).attr('id');
		e.preventDefault();
		if (confirm('Add "' + name + '" show to your shows?')){
			console.log("Add show " + id);
			var action = TVFrik.API.routes.serie;
			action.params.seriesid = 71663;
			action.params.all = true;
			action.handler = function(response){
				response = JXON.build(response);
				var show = TVFrik.DB.Show(response.data);
				console.log(show);
				TVFrik.DB.save('show', show, TVFrik.Events.savedShowEvent);
			};
			TVFrik.API.call(action);
		}
	}
}