var URL_ECHONEST_API = "http://developer.echonest.com/api/v4/";
var API_KEY= 'WMROE86FA97XXFS4I';

var pi = Math.PI;

function getTrack(){

    var trackID = $('#trackID').val();

    // request the track analysis
    $.getJSON(URL_ECHONEST_API + 'track/profile' + '?format=json&api_key='+API_KEY+'&id='+trackID+"&bucket=audio_summary",   
        function(data) {
            // generate visualization using trackInfo
            generateMoodGlyph(data.response.track);     
        });
}


trackCounter = 0
function generateMoodGlyph(trackInfo){

    // Load values to use for encoding.  All Values range from 0-1

    energy = trackInfo.audio_summary.energy
    danceability = trackInfo.audio_summary.danceability
    valence = trackInfo.audio_summary.valence


    // Added for Testing....
    console.log("Energy: " + energy)
    console.log("Danceability: " + danceability)
    console.log("Valence: " + valence)

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
    }).appendTo('div.tracks');

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

}