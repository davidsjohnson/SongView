//Width and height
var w = 500;
var h = 100;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var dataset = d3.csv("Miracle Of Mary.csv", function(data){
    dataset = data;
})

// //Create SVG element
// var svg = d3.select("body")
//             .append("svg")
//             .attr("width", w)
//             .attr("height", h);


// svg.selectAll("rect")
//    .data(dataset)
//    .enter()
//    .append("rect")
//    .attr("x", 0)
//    .attr("y", 0)
//    .attr("width", 20)
//    .attr("height", 100);