var URL_ECHONEST_API = "http://developer.echonest.com/api/v4/";
var API_KEY= 'WMROE86FA97XXFS4I';

// var colors = [[232, 232, 25], [185, 216, 20], [139, 200, 15], [92, 184, 10], [46, 168, 5], [0, 153, 0], [0, 122, 20], [0, 91, 40], [0, 61, 61], [0, 30, 81]]

//load the track info if present
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


/*window.onload= ( function(){
    var urlVars = getUrlVars();
    
    console.log(urlVars);
    if( urlVars["idSong"] ){
        console.log('a');
        $('#trackID').val(urlVars["idSong"]);
    }
    
});*/

// Load n tracks at once to see check timbre...

trackIds = ["spotify:track:3UN6UkL6M0l8vfZS7OffZ6", 
            "spotify:track:4IFOBHso31fbBBeAgZCZyn", 
            "spotify:track:4EBisBBehGON4ESJsNZBsP", 
            "spotify:track:7c5EpKbPpL86QVaP8yla8e", 
            "spotify:track:4IRHwIZHzlHT1FQpRa5RdE",
            "spotify:track:7e8KTrlIt6SeImB3vM98ZF"]

            // "spotify:track:7Gu2gmZdFbQzTdqz0Plx6j",
            // "spotify:track:2zkZGzzWOzGwi1rtWv7mhZ",
            // "spotify:track:2xyKOfp9MtJDhJWGXDfFem",
            // "spotify:track:3o6RpCtAPejVvTckcd5JVt",
            // "spotify:track:7HRbgpb696qbFwNJZkNSc6",
            // "spotify:track:5JB5F9iGwQqALGClKdeOky",
            // "spotify:track:0lIu6mc6W3MOFiLp6q8et4",
            // "spotify:track:4Rw5ErjPrtzAa4lJz4KfxM"
            
var trackInfos = new Array(trackIds.length)
var trackDatas = new Array(trackIds.length)

window.onload=( function(){

    getTracks(0)
})

var tMax = [-100, -100, -100, -100];
var tMin = [100, 100, 100, 100];
function maxMinTimbre(segments){
    
    for(var i=0; i<segments.length; i++){
        var segment = segments[i];

        for(var j=0; j<tMax.length; j++){
            t = segment.timbre[j];
            if (t > tMax[j])
                tMax[j] = t;
            if (t <tMin[j])
                tMin[j] = t;
        }
    }
}


function getTrack(){

    var trackID = $('#trackID').val();

    // request the track analysis
    $.getJSON(URL_ECHONEST_API + 'track/profile' + '?format=json&api_key='+API_KEY+'&id='+trackID+"&bucket=audio_summary",   
        function(data) {
            // console.log(data)

            // analysis returned to URL. Now we need to get the full detailed data
            analysisUrl = data.response.track.audio_summary.analysis_url;
            $.getJSON(analysisUrl,
                function(trackData){
                    // generate visualization using full analysis data
                    generateSongView(data.response.track, trackData);
                });      
        });
}

function getTracks(idx){

    trackID = trackIds[idx]

    // request the track analysis
    $.getJSON(URL_ECHONEST_API + 'track/profile' + '?format=json&api_key='+API_KEY+'&id='+trackID+"&bucket=audio_summary",   
        function(data) {

            // analysis returned to URL. Now we need to get the full detailed data
            analysisUrl = data.response.track.audio_summary.analysis_url;
            $.getJSON(analysisUrl,
                function(trackData){

                    // Update Timbre Max Min
                    maxMinTimbre(trackData.segments);
                    // Add track data to arrays for generate all views at once
                    trackInfos[idx] = data.response.track
                    trackDatas[idx] = trackData

                    if(idx < trackIds.length-1){
                        getTracks(idx+1);
                    }
                    else{
                        generateSongViews()
                        console.log(tMax)
                        console.log(tMin)
                    }
                });      
        });
}

function generateSongViews(){

    for(var i=0; i<trackIds.length; i++){
        generateSongView(trackInfos[i], trackDatas[i])
    };
}

var trackCounter = 0
function generateSongView(trackInfo, trackData){

    // adding track Update Counter
    trackCounter++;

    // getting min/max timbre values for timbre normalization (using 
    // top 3 timbre values)
    // var tMax = [-100, -100, -100];
    // var tMin = [100, 100, 100];
    // for(var i=0; i<trackData.segments.length; i++){
    //     var segment = trackData.segments[i];

    //     for(var j=0; j<3; j++){
    //         t = segment.timbre[j];
    //         if (t > tMax[j])
    //             tMax[j] = t;
    //         if (t <tMin[j])
    //             tMin[j] = t;
    //     }
    // }

    //SVG Width and height
    var w = 1400;
    var h = 42;
    var sidePadding = 10;
    var bottomPadding = 5;

    //Individual Pitch Box Dimensions
    var rectW = 2;
    var rectH = 2;
    var horPitchPadding = 0;  // Horizontal Padding
    var vertPitchPadding = 1;


    // Loudness Dimensions (uses width of Pitch boxes)
    var loudnessPadding = 0;
    var loudnessMaxH = 11;

    // Loudness scale to convert Echonest Loudness values to Height
    var loudnessMin = -60;
    var loudnessMax = 0;
    var loudnessScale = d3.scale.linear()
                            .domain([loudnessMin, loudnessMax])
                            .range([0, loudnessMaxH]);

    // var hueScale = d3.scale.linear()
    //                     .domain([0, 360])
    //                     .range([0,360]);

    var rgbScale = d3.scale.linear()
                        .domain([0,1])
                        .range([0,255]);

    var colorScale = d3.scale.quantize()
                        .domain([.15, .85])
                        .range(colorbrewer.YlGnBu[81]);

    // var colorScale2 = d3.scale.quantize()
    //                     .domain([.15, .85])
    //                     .range(colors);


    // Create DIV to store Song Info and SVG
    // $("div.tracks").append("<div class='track'></div>").addClass(trackInfo.id)
    // including trackCounter to account for the same track being shown more than Once
    $('<div/>', {
        id: trackInfo.id + trackCounter,
        class: "track",
    }).appendTo('div.tracks');

    $("<h5>" + trackInfo.title + "</h5><h6>" + trackInfo.artist + "</h6>").appendTo("#" + trackInfo.id + trackCounter)

    //Create SVG element for drawing an individual SongVis
    var svg = d3.select("#" + trackInfo.id + trackCounter)
                .append("svg")
                .attr("width", w)
                .attr("height", h);
   

    // initialize counter and accumulators to 0
    var barIdx = 0;
    var barBreaks = 0;
    var segIdx= 0
    var numSegments = 0;
    var pitchTots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var loudnessTot = 0
    var timbreTots = [0, 0, 0]

    // for(; barIdx<trackData.bars.length; segIdx++){      // For all bars
    for(; segIdx<trackData.segments.length && barIdx<trackData.bars.length; segIdx++){  

        // Get necessary data
        bar = trackData.bars[barIdx];
        barEndTime = bar.start + bar.duration;
        segment = trackData.segments[segIdx];

        if (segment.start < barEndTime){
            // if next segment is within current bar
            // summarize the data

            for(var i=0;i<12;i++){  //update pitch totals for all 12 pitches
                pitchTots[i]+=segment.pitches[i]
            }
            loudnessTot += (segment.loudness_start + segment.loudness_max) / 2;  // get average loudness per segment
            timbreTots[0] += segment.timbre[0];
            timbreTots[1] += segment.timbre[1];
            timbreTots[2] += segment.timbre[2];
            numSegments +=1;
        }
        else{

            // add vertical padding for every 4 bars
            if (barIdx%4 === 0 && barIdx !=0){
                barBreaks += 0;
            }

            pitchAvg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            timbreAvg = [0, 0, 0]
            //generate averages of data
            for(var i=0;i<12;i++){
                pitchAvg[i] = pitchTots[i] / numSegments;
                pitchTots[i] = 0;  // done with value reset to 0
            }

            loudnessAvg = loudnessTot / numSegments;
            loudnessTot = 0  // done with total loud so reset it

            timbreAvg[0] = timbreTots[0] / numSegments;
            timbreAvg[1] = timbreTots[1] / numSegments;
            timbreAvg[2] = timbreTots[2] / numSegments;

            // done with timbre tots reset to 0
            timbreTots[0] = 0;
            timbreTots[1] = 0;
            timbreTots[2] = 0;

            numSegments = 0; // done with summarization reset numSegments
            barIdx += 1;     // and update bar idx


            // Normalize timbre values to convert to values for color
            var rgbVals =  [0, 0, 0];
            for (var i=0; i<3; i++){
                t = timbreAvg[i];
                tNorm = (t - tMin[i]) / (tMax[i] - tMin[i])                
                rgbVals[i] = tNorm
            }

            // Now Draw the 12 boxes representing pitch
            svg.selectAll("rect"+barIdx)
                .data(pitchAvg)
                .enter()
                .append("rect")
                .attr("x", function(d){
                    return sidePadding + ((barIdx-1) * rectW) + (barBreaks * vertPitchPadding);
                })
                .attr("y", function(d,i){
                    return h - bottomPadding - (i * (rectH + horPitchPadding));
                })
                .attr("width", rectW)
                .attr("height", rectH)
                .attr("fill", function(d){
                    // color = colorScale2((.2 * rgbVals[0] + .5 * rgbVals[1] + .30 * rgbVals[2] ))
                    // return d3.rgb(color[0], color[1], color[2])

                    return colorScale((.2 * rgbVals[0] + .5 * rgbVals[1] + .30 * rgbVals[2] ));
                })
                .attr("fill-opacity", function(d){
                    return d;
                });

            // Draw the box representing loudness
            svg.selectAll("loudRect"+barIdx)
                .data([loudnessAvg])
                .enter()
                .append("rect")
                .attr("x", function(d){
                    return sidePadding + ((barIdx-1) * rectW) + (barBreaks * vertPitchPadding);
                })
                .attr("y", function(d){
                    height = loudnessScale(d);
                    return h - bottomPadding - (11 * (rectH + horPitchPadding) - loudnessPadding) - height;
                })
                .attr("width", rectW)
                .attr("height", function(d){
                    return loudnessScale(d);
                })
                .attr("fill", function(d){
                    // color = colorScale2((.2 * rgbVals[0] + .5 * rgbVals[1] + .30 * rgbVals[2] ))

                    // console.log("color: ", color)

                    // return d3.rgb(color[0], color[1], color[2])

                    return colorScale((.2 * rgbVals[0] + .5 * rgbVals[1] + .30 * rgbVals[2] ));
                })
                .attr("fill-opacity", .6);



            // lineY = h - bottomPadding - (13 * (rectH + pitchPadding) - loudnessPadding) - loudnessMaxH
            // svg.append("line")
            //     .attr("x1", sidePadding)
            //     .attr("y1", lineY)
            //     .attr("x2", trackData.bars.length * rectW + sidePadding)
            //     .attr("y2", lineY)
            //     .attr("stroke", function(d){
            //         return d3.rgb(150, 150, 150);
            //     });

            // Done drawing boxes now store segment info for next bar...
            for(var i=0;i<12;i++){  //update pitch totals for all 12 pitches
                pitchTots[i]+=segment.pitches[i]
            }
            loudnessTot += (segment.loudness_start + segment.loudness_max) / 2;  // get average loudness per segment
            timbreTots[0] += segment.timbre[0];
            timbreTots[1] += segment.timbre[1];
            timbreTots[2] += segment.timbre[2];
            numSegments +=1;
        }
    }
}