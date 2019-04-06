//Common function and resources
//Creates the tooltip
var div = d3.select("body")
              .append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

//Find the minimun number in an array
function findMax(array, variable) {
  let max = 0
  for (i=0;i<array.length;i++){
    if (Number(array[i][variable]) > max){max = Number(array[i][variable])}
  }
  return max
}

//Find the maximun value in the array
function findMin(array, variable) {
  let min = 200
  for (i=0;i<array.length;i++){
    if (Number(array[i][variable]) < min){
      min = Number(array[i][variable])
    }
  }
  return min
}

//Selected 5000 random entries in the dataset and return it in an array
function selectRandomData(lenArray) {
    var outputArray = [];
    for (var i = 0; i < 5000; i++) {
        var x = Math.floor((Math.random() * lenArray) + 1);
        outputArray.push(x);
    }
    return outputArray;
}

//Creates the graph
function updateFirstGraph() {
  //Clean the area for the first graph in case it is not the first time the function is called
  d3.select("#graph1")
    .transition()
    .duration(500)
    .remove()

  year = d3.select("#YearFirstGraph")._groups[0][0].value

//FIRST GRAPH
  var fileFirst = "Data/scatter" + year + ".csv"
  d3.csv(fileFirst, function(d){
    //Select 5000 entries in the whole dataset
    let randomIndex = selectRandomData(d.length)
    firstGraphData = []
    for (i=0; i < randomIndex.length; i++){
      firstGraphData.push(d[randomIndex[i]])
  }

  //Adjusts the SVG so the graph fits in it
    var widthFirst = 500
    var heightFirst = 500

    var marginFirst = {
        top: 30,
        left: 35,
        right: 30,
        bottom: 30
      };

    var graph1 = d3.select("#divgraph1")
      .append("svg")
      .attr('id', 'graph1')
      .attr('width', widthFirst)
      .attr('height', heightFirst)
      .append("g")
      .attr("transform", "translate(" + marginFirst.left + "," + marginFirst.top + ")")

//Adjust the areas to be used in the scale
    widthFirst = widthFirst - marginFirst.left - marginFirst.right
    heightFirst = heightFirst - marginFirst.top - marginFirst.bottom

//Find the min and max values of the variables to set the scale
    maxWeight = findMax(firstGraphData, "PESO")
    minWeight = findMin(firstGraphData, "PESO")
    maxHeight = findMax(firstGraphData, "ALTURA")
    minHeight = findMin(firstGraphData, "ALTURA")

//creates the scale
    var myScaleXfirst = d3.scaleLinear()
                    .range([0,widthFirst])
                    .domain([minWeight,maxWeight]);

    var myScaleYfirst = d3.scaleLinear()
                    .range([0,heightFirst])
                    .domain([maxHeight,minHeight])

//Creates the axis
    var xAxisFirst = d3.axisBottom(myScaleXfirst)
                    .tickFormat(function(d){return d + "kg"})
                    .ticks(8)

    var yAxisFirst = d3.axisLeft(myScaleYfirst)
                    .tickFormat(function(d){return d/100 + "m"})
                    .ticks(8)

//Append the axis in the first graph
    graph1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightFirst + ")")
    .call(xAxisFirst);

    graph1.append("g")
    .attr("class", "y axis")
    .call(yAxisFirst);

//Create the grid lines
    function make_x_axis(scale) {
      return d3.axisBottom(myScaleXfirst)
          .ticks(8)
    }

    function make_y_axis(scale) {
      return d3.axisLeft(myScaleYfirst)
          .ticks(8)
    }

//Put the grid lines on the graph
    graph1.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + heightFirst + ")")
            .call(make_x_axis()
                .tickSize(-heightFirst)
                .tickFormat("")
            )

    graph1.append("g")
            .attr("class", "grid")
            .call(make_y_axis()
                .tickSize(-widthFirst)
                .tickFormat("")
            )

//Creates the dots with the data
    graph1.selectAll(".dot")
      .data(firstGraphData)
      .enter()
      .append('circle')
      .attr("opacity", 0.9)
      .attr('r', 3)
      .attr('fill', "#449adb")
      .attr('stroke-width', 0.3)
      .attr("cy", function(d, i){ return myScaleYfirst(d["ALTURA"]);})
      .attr("cx", function(d, i){ return myScaleXfirst(d["PESO"]);})
      .on("mouseover", function (d) {
        div.style("opacity", 1)

        div.html(d["ALTURA"]/100 +"m and " + parseFloat(d["PESO"]) + " kg")
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY + 15) + "px");
      })
      .on("mouseout", function (d) {
        div.style("opacity", 0)

      })

//Note to myself: This two are the ending of the first graph function
})}
