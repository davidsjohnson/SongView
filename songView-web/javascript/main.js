var URL_ECHONEST_API = "http://developer.echonest.com/api/v4/";
var API_KEY= 'WMROE86FA97XXFS4I';

function getTrack(){

    var trackID = $('#trackID').val();

    // request the track analysis
    $.getJSON(URL_ECHONEST_API + 'track/profile' + '?format=json&api_key='+API_KEY+'&id='+trackID+"&bucket=audio_summary",   
        function(data) {

            // analysis returned to URL. Now we need to get the full detailed data
            analysisUrl = data.response.track.audio_summary.analysis_url;
            $.getJSON(analysisUrl,
                function(songData){
                    // generate visualization using full analysis data
                    generateSongView(songData)
                });      
        });
}

function generateSongView(songData){

    //SVG Width and height
    var w = 1400;
    var h = 100;
    var sidePadding = 10;
    var bottomPadding = 10;

    //Individual Pitch Box Dimensions
    var rectW = 1;
    var rectH = 4;
    var pitchPadding = 1;  // Vertical Padding

    // Loudness Dimensions (uses width of Pitch boxes)
    var loudnessPadding = 7;
    var loudnessMaxH = 15;

    // Loudness scale to convert Echonest Loudness values to Height
    var loudnessMin = -60;
    var loudnessMax = 0;
    var loudnessScale = d3.scale.linear()
                            .domain([loudnessMin, loudnessMax])
                            .range([0, loudnessMaxH]);


    //Create SVG element for drawing an individual SongVis
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
   


    // For all segements
    for(var idx=0; idx<songData.segments.length; idx++){

        // UPDATE to summarize the data
        // Draw the 12 boxes representing pitch
        svg.selectAll("rect"+idx)
            .data(songData.segments[idx].pitches)
            .enter()
            .append("rect")
            .attr("x", function(d){
                return sidePadding + (idx * rectW);
            })
            .attr("y", function(d,i){
                return h - bottomPadding - (i * (rectH + pitchPadding));
            })
            .attr("width", rectW)
            .attr("height", rectH)
            .attr("fill", "teal")
            .attr("fill-opacity", function(d){
                return d;
            });

        // Draw the box representing loudness
        svg.selectAll("loudRect"+idx)
            .data([(songData.segments[idx].loudness_max + songData.segments[idx].loudness_start)/2])
            .enter()
            .append("rect")
            .attr("x", function(d){
                return sidePadding + (idx * rectW);
            })
            .attr("y", function(d){
                height = loudnessScale(d);
                return h - bottomPadding - (13 * (rectH + pitchPadding) - loudnessPadding) - height;
            })
            .attr("width", rectW)
            .attr("height", function(d){
                return loudnessScale(d);
            })
            .attr("class", "loudness");

        lineY = h - bottomPadding - (13 * (rectH + pitchPadding) - loudnessPadding) - loudnessMaxH
        svg.append("line")
            .attr("x1", sidePadding)
            .attr("y1", lineY)
            .attr("x2", songData.segments.length * rectW + sidePadding)
            .attr("y2", lineY)
            .attr("class", "loudness");
    };
}