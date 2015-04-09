// only used to save code im not ready to delete...


    instrumentalness = trackInfo.audio_summary.instrumentalness
    liveness = trackInfo.audio_summary.liveness
    acousticness = trackInfo.audio_summary.acousticness

    barLabels = ["Instrumentalness", "Acousticness,", "Liveness"]
    barData = [instrumentalness, acousticness, liveness]

    barWidth = 15
    spacing = 5

    var heightScale = d3.scale.linear()
                        .domain([0, 1])
                        .range([0, h]);


    svg.selectAll("rect")
        .data(barData)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", function(d,i){
            return i * (barWidth+spacing) + topPadding;
        })
        .attr("width", function(d){
            return heightScale(d);
        })
        .attr("height", barWidth)
        .attr("fill", d3.rgb(150,150,150));