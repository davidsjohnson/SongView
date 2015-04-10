var URL_ECHONEST_API = "http://developer.echonest.com/api/v4/";
var API_KEY= 'WMROE86FA97XXFS4I';

function getSong(queryO, okAction, errorAction){
				
				var responseS = null;
				
				$.ajax({
				     url: URL_ECHONEST_API + 'song/search' + '?format=json&api_key='+API_KEY+'&bucket=tracks&bucket=id:spotify&bucket=audio_summary' 
				     ,
				     dataType: 'json', 
				     data: queryO,
				     success:function(json){
				    	 
				    	 if( json.response.status.code == 0 ){	
							okAction.call(this, json);	
						}else{
							console.log('Managed Error');
							errorAction.call(this);
						}
				     },
				     error:function(r,e){
				         errorAction.call(this,r,e);
				     }      
				});
}
			
			
function getTrack(){
	var responseS = null;
	$.getJSON(URL_ECHONEST_API + 'track/profile' + '?format=json&api_key='+API_KEY+'&id='+idTrack, 
	{}, 
	function(r) {					
	if( r.response.status.code == 0 ){
		okAction.call(this, r);						
	}else{
		errorAction.call(this);
	}
					
	});
}

function getPlaylistSong( songId, okAction, errorAction ){
	var responseS = null;
	$.getJSON(URL_ECHONEST_API + 'playlist/basic' + '?format=json&api_key='+API_KEY+'&song_id='+songId+'&type=song-radio', 
	{}, 
	function(r) {					
	if( r.response.status.code == 0 ){
		okAction.call(this, r);						
	}else{
		errorAction.call(this);
	}
					
	});
}