var URL_ECHONEST_API = "http://developer.echonest.com/api/v4/";
var API_KEY= 'WMROE86FA97XXFS4I';

function getTrack(){

    var trackID = $('#trackID').val();

    // request the track analysis
    $.getJSON(URL_ECHONEST_API + 'track/profile' + '?format=json&api_key='+API_KEY+'&id='+trackID+"&bucket=audio_summary",   
        function(data) {
            console.log(data)

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

    // getting min/max timbre values for timbre normalization
    var tMax = [-100, -100, -100];
    var tMin = [100, 100, 100];
    for(var i=0; i<songData.segments.length; i++){
        var segment = songData.segments[i];

        for(var j=0; j<3; j++){
            t = segment.timbre[j];
            if (t > tMax[j])
                tMax[j] = t;
            if (t <tMin[j])
                tMin[j] = t;
        }
    }

    //SVG Width and height
    var w = 1400;
    var h = 100;
    var sidePadding = 10;
    var bottomPadding = 25;

    //Individual Pitch Box Dimensions
    var rectW = 3;
    var rectH = 3;
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
   

    // initialize counter and accumulators to 0
    var barIdx = 0;
    var segIdx= 0
    var numSegments = 0;
    var pitchTots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var loudnessTot = 0
    var timbreTots = [0, 0, 0]

    for(; barIdx<songData.bars.length; segIdx++){      // For all bars

        // Get necessary data
        bar = songData.bars[barIdx];
        barEndTime = bar.start + bar.duration;
        segment = songData.segments[segIdx];

        if (segment.start < barEndTime){
            // if next segment is within current bar
            // summarize the data

            for(var i=0;i<12;i++){  //update pitch totals for all 12 pitches
                pitchTots[i]+=segment.pitches[i]
            }
            loudnessTot += (segment.loudness_start + segment.loudness_max) / 2;  // get average loudness per segment
            timbreTots[0] = segment.timbre[0];
            timbreTots[1] = segment.timbre[1];
            timbreTots[2] = segment.timbre[2];
            numSegments +=1;
        }
        else{
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


            // Generate color
            var rgbVals =  [0, 0, 0];
            for (var i=0; i<3; i++){
                t = timbreAvg[i];
                if (t < tMin[i])
                    // tNorm = (tMin[i] - t) / (tMax[i] - tMin[i]);
                    tNorm = t/tMax[i];
                else
                    //tNorm = (t - tMin[i]) / (tMax[i] - tMin[i]);
                    tNorm = t/tMax[i];
                
                rgbVals[i] = tNorm;
                console.log(rgbVals)
            }

            // Now Draw the 12 boxes representing pitch
            svg.selectAll("rect"+barIdx)
                .data(pitchAvg)
                .enter()
                .append("rect")
                .attr("x", function(d){
                    return sidePadding + ((barIdx-1) * rectW);
                })
                .attr("y", function(d,i){
                    return h - bottomPadding - (i * (rectH + pitchPadding));
                })
                .attr("width", rectW)
                .attr("height", rectH)
                .attr("fill", function(d){
                    return d3.rgb(rgbVals[0] * 360, rgbVals[1], rgbVals[2]);
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
                    return sidePadding + ((barIdx-1) * rectW);
                })
                .attr("y", function(d){
                    height = loudnessScale(d);
                    return h - bottomPadding - (13 * (rectH + pitchPadding) - loudnessPadding) - height;
                })
                .attr("width", rectW)
                .attr("height", function(d){
                    return loudnessScale(d);
                })
                .attr("fill", function(d){
                    return d3.rgb(rgbVals[0], rgbVals[1], rgbVals[2]);
                });

            // // Draw the box representing loudness
            // svg.selectAll("loudRect2"+barIdx)
            //     .data([loudnessAvg])
            //     .enter()
            //     .append("rect")
            //     .attr("x", function(d){
            //         return sidePadding + ((barIdx-1) * rectW);
            //     })
            //     .attr("y", function(d){
            //         height = loudnessScale(d);
            //         return h - loudnessMaxH - bottomPadding + height;
            //     })
            //     .attr("width", rectW)
            //     .attr("height", function(d){
            //         return loudnessScale(d);
            //     })
            //     .attr("fill", function(d){
            //         return d3.rgb(rgbVals[0], rgbVals[1], rgbVals[2]);
            //     });


            // lineY = h - bottomPadding - (13 * (rectH + pitchPadding) - loudnessPadding) - loudnessMaxH
            // svg.append("line")
            //     .attr("x1", sidePadding)
            //     .attr("y1", lineY)
            //     .attr("x2", songData.bars.length * rectW + sidePadding)
            //     .attr("y2", lineY)
            //     .attr("stroke", function(d){
            //         return d3.rgb(150, 150, 150);
            //     });

            // Done drawing boxes now store segment info for next bar...
            for(var i=0;i<12;i++){  //update pitch totals for all 12 pitches
                pitchTots[i]+=segment.pitches[i]
            }
            loudnessTot += (segment.loudness_start + segment.loudness_max) / 2;  // get average loudness per segment
            timbreTots[0] = segment.timbre[0];
            timbreTots[1] = segment.timbre[1];
            timbreTots[2] = segment.timbre[2];
            numSegments +=1;
        }
    }
}