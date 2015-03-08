var URL_ECHONEST_API = "http://developer.echonest.com/api/v4/";
var API_KEY= 'WMROE86FA97XXFS4I';

function getSong(queryO, okAction, erroAction){
				
				var responseS = null;
				
				$.ajax({
				     url: URL_ECHONEST_API + 'song/search' + '?format=json&api_key='+API_KEY,
				     dataType: 'json', 
				     data: queryO,
				     success:function(json){
				    	 
				    	 if( json.response.status.code == 0 ){	
							okAction.call(this, json);	
						}else{
							errorAction.call(this);
						}
				     },
				     error:function(){
				         alert("Error");
				     }      
				});
}
			
			
function getTrackDetails(idTrack, okAction, erroAction){
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