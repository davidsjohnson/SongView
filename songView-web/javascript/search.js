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
					
						
						var audio_summary = obj.audio_summary;
						
						
						var trackInfo = new Object();
						trackInfo.id = foreign_id;
						trackInfo.artist =  obj.artist_name;
						trackInfo.title  =  obj.title;
						trackInfo.audio_summary = audio_summary;
						
						
						$('#results').append('<div class="songItem">'+
								'<table><tbody>'+
									'<tr>'+
										'<td class="nameArtist" colspan="2">'+ obj.artist_name +'</td>'+
									'</tr>' +
									'<tr >'+
										'<td class="titleSong"><a href="detailRecommend.html?idSong='+foreign_id+'&title='+obj.title+'&artist='+obj.artist_name+'&sid='+obj.id+' ">'+ obj.title +'</a></td>' +
										'<td id="glyph'+ foreign_id +'" class="glyph"></td>' +
									'</tr>' +
								'</tbody></table>'+
						'</div>');
						
						var g = generateMoodGlyphVol(trackInfo, '#glyph' + foreign_id);
						
						//console.log(g);
						//$('body').append(g);
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


function generateMoodGlyphVol(trackInfo, placeholder){

    // Load values to use for encoding.  All Values range from 0-1

    energy = trackInfo.audio_summary.energy;
    danceability = trackInfo.audio_summary.danceability;
    valence = trackInfo.audio_summary.valence;


    // Added for Testing....
    console.log("Energy: " + energy);
    console.log("Danceability: " + danceability);
    console.log("Valence: " + valence);

    w = 250;
    h = 100;



    axisPadding = 20
    arcPadding = 40
    maxRadius = 35
    maxArcs = 5


    var radiusScale = d3.scale.linear()
                        .domain([0, 1])
                        .range([8, maxRadius]);

    var cxScale = d3.scale.linear()
                    .domain([0,1])
                    .range([arcPadding, w-arcPadding])

    var arcScale = d3.scale.linear()
                     .domain([0,1])
                     .range([0,maxArcs])

    var arcSizeScale = d3.scale.linear()
                        .domain([0,1])
                        .range([25,35])

    var arcWidthScale = d3.scale.linear()
                        .domain([0,1])
                        .range([1,4])

    $('<div/>', {
        id: trackInfo.id + trackCounter,
        class: "track",
    }).appendTo(placeholder);

    $("<h5>" + trackInfo.title + "</h5><h6>" + trackInfo.artist + "</h6>").appendTo("#" + trackInfo.id + trackCounter)

    //Create SVG element for drawing an individual SongVis
    var svg = d3.select("#" + trackInfo.id + trackCounter)
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    cx = Math.round(cxScale(valence))
    cy = (h - axisPadding) / 2
    radius = Math.round(radiusScale(energy))
    
    numArcs = Math.round(arcScale(danceability))
    arcSpacing = Math.round(arcWidthScale(energy))
    arcWidth = Math.round(arcSpacing)
    initialArcSize = Math.round(arcSizeScale(energy))


    tickVals = ["Sad :(", "", "Happy :)"]
    xAxis = d3.svg.axis()
              .scale(cxScale)
              .orient("bottom")
              .ticks(3)
              .tickSize(4)
              .tickFormat(function(d,i){
                return tickVals[i];
              });

    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - axisPadding) + ")")
        .call(xAxis);

    svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", radius)
        .attr("fill", d3.rgb(175,175,175));

    svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", radius-2)
        .attr("fill", d3.rgb(50,50,50));

    svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", radius/8)
        .attr("fill", d3.rgb(150,150,150));


    for (var i=0; i < numArcs; i++){

        arcSize = initialArcSize + (i*7)

        var arcR = d3.svg.arc()
            .innerRadius(radius + arcSpacing + i * ( arcWidth + arcSpacing))
            .outerRadius(radius + arcSpacing + arcWidth + i * (arcSpacing + arcWidth))
            .startAngle((90 - arcSize/2) * (pi/180)) //converting from degs to radians
            .endAngle((90 + arcSize/2) * (pi/180));

        var arcL = d3.svg.arc()
            .innerRadius(radius + arcSpacing + i * ( arcWidth + arcSpacing))
            .outerRadius(radius + arcSpacing + arcWidth + i * (arcSpacing + arcWidth))
            .startAngle((270 - arcSize/2) * (pi/180)) //converting from degs to radians
            .endAngle((270 + arcSize/2) * (pi/180));

        svg.append("path")
            .attr("d", arcR)
            .attr("fill", d3.rgb(50,50,50))
            .attr("transform", "translate(" + cx + "," + cy + ")");

        svg.append("path")
            .attr("d", arcL)
            .attr("fill", d3.rgb(50,50,50))
            .attr("transform", "translate(" + cx + "," + cy + ")");
    }

    trackCounter++;
    
    return $('#'+trackInfo.id + trackCounter);
}