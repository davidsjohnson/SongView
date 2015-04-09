var currentPage = 1;
var maxSongs = 5000;
var maxRegsPerPage = 12;
var noregs = false;

function search(  ){
	
	
	$('#msg').hide();
	
	
	var txtSearch = $('#strQuery').val();
	var typeOption = $('#typeQuery  option:selected').val();
	
	
	if( txtSearch == "" ){
		$('#msg').show();
		$('#msg').html('Please insert some text for searching...');
		
		return;
	}
	
	//console.log( typeOption );
	var queryObj = {};
	if( typeOption == 'Artist and title' ){
		queryObj = {
				combined: txtSearch
		}
	}else if(typeOption == 'Artist'){
		queryObj = {
				artist: txtSearch
		}
	}else if(typeOption == 'Title'){
		queryObj = {
				title: txtSearch
		}
	}
	
	var initReg = 1;
	
	if(currentPage > 1){
		initReg = currentPage * maxRegsPerPage;
	}
	
	queryObj.start = initReg;
	queryObj.results = maxRegsPerPage;
	//queryObj.bucket = ['id:spotify','tracks'] ;
	
	tmpCurrentPage = currentPage;
	$('#loadingIndicator').show();
	getSong(
		queryObj, 
		function( r ){
			responseS = r;
			console.log(responseS);
			$('#loadingIndicator').hide();
			
			var listSongs = r.response.songs;
			$('#results').html('');
			if(listSongs.length > 0){
				
				
				
				
				$.each(listSongs, function( idx, obj ){
					
					
					
					if(obj.tracks.length > 0){
						console.log(obj);
						var foreign_id = obj.tracks[0].id;//foreign_id;
						
						$('#results').append('<div class="songItem">'+
								'<table><tbody>'+
									'<tr>'+
										'<td class="nameArtist">'+ obj.artist_name +'</td>'+
									'</tr>' +
									'<tr>'+
										'<td class="titleSong"><a href="detailRecommend.html?idSong='+foreign_id+'&title='+obj.title+'&artist='+obj.artist_name+'&sid='+obj.id+' ">'+ obj.title +'</a></td>' +
									'</tr>' +
								'</tbody></table>'+
						'</div>');
					}else{
						//console.log(" ZZZZZZZZZZZZ ");
						//console.log(obj.songs);
					}				
				});
				noregs = false;
			}else{
				noregs = true;
				$('#results').html('No songs found!!');
				console.log('No songs found');
			}
			
		}, 
		function(r, e){
			console.log('API ERROR');
			console.log(r);
			console.log(e);
			$('#msg').html( 'Some error was produced' );
			$('#msg').show();
		} 
	);
	
	//console.log(txtSearch + ' ' + typeOption);
	
}

function newSearch(){
	currentPage = 1;
	search( );
}


function backPageSongs( ){
	
	if(currentPage > 1){
		currentPage--;
		search(  );
	}else{
		currentPage = 1;
	}
	
}

function forwardPageSongs( ){
	
	var tmpVar = currentPage;
	if(noregs == false){
		currentPage++;
		search(  );
	}else{
		//currentPage = maxSongs;
	}
	
}