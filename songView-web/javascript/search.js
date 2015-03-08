
function search(){
	
	var txtSearch = $('#strQuery').val();
	var typeOption = $('#typeQuery  option:selected').val();
	
	var queryObj = {};
	if( typeOption == 'Description' ){
		queryObj = {
				description: txtSearch
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
					$('#results').append('<div class="songItem">'+
							'<table><tbody>'+
								'<tr>'+
									'<td class="nameArtist">'+ obj.artist_name +'</td>'+
								'</tr>' +
								'<tr>'+
									'<td class="titleSong">'+ obj.title +'</td>' +
								'</tr>' +
							'</tbody></table>'+
					'</div>');
				});
				
			}else{
				
				$('#results').html('No songs found!!');
				console.log('No songs found');
			}
			
		}, 
		function(r){ 
			console.log(r);
		} 
	);
	
	console.log(txtSearch + ' ' + typeOption);
	
}