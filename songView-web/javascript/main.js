

function generateSongView(){

    var trackCSV = $('#csvFilename').val();

    //SVG Width and height
    var w = 1400;
    var h = 100;
    var sidePadding = 10;
    var bottomPadding = 10;

    //Individual Pitch Box Dimensions
    var rectW = 1;
    var rectH = 4;
    var pitchPadding = 1;  // Veritical Padding

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

    // Get Track Data from CSV (Just temporary until this handles JSON response)
    d3.text(trackCSV, function(text) {
        var songdata = d3.csv.parseRows(text).map(function(row) {
            return row.map(function(value) {
                return +value;
            });
        });      

        // On Callback draw the vis

        // For all segements
        for(var idx=0; idx<songdata.length; idx++){

            // UPDATE to summarize the data
            // Draw the 12 boxes representing pitch
            svg.selectAll("rect"+idx)
                .data(songdata[idx].slice(0,12))
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
                .data(songdata[idx].slice(12, 13))
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
                });
        };
    });
}