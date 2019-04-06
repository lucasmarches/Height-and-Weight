//Find the minimun number in an array
function findMaxThird(array, variable) {
  let max = 0
  for (i=0;i<array.length;i++){
    if (Number(array[i][variable]) > max){max = Number(array[i][variable])}
  }
  return max
}

//Find the maximun value in the array
function findMinThird(array, variable) {
  let min = 200
  for (i=0;i<array.length;i++){
    if (Number(array[i][variable]) < min){
      min = Number(array[i][variable])
    }
  }
  return min
}

//The following function was adapted from https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
//Sort an array of objects
function compare(a,b) {
  if (a["AVG"] > b["AVG"])
    return -1;
  if (a["AVG"] < b["AVG"])
    return 1;
  return 0;
}

//Function that creates the third graph
function updateThirdGraph() {
  //Select the options provided by the user
  let year = d3.select("#YearThirdGraph")._groups[0][0].value
  let variableThird = d3.select("#VariableThirdGraph")._groups[0][0].value

//Remove the previous graph in case it already exists
  d3.select("#graph3")
    .transition()
    .duration(100)
    .remove()

//THIRD GRAPH
  var fileThird = "Data/described" + year + ".csv"
  d3.csv(fileThird, function(d){
//Create the selectors for each variable based on the option provided by the user
    let varMin = "MIN_" + variableThird
    let varMax = "MAX_" + variableThird
    let varAvg = "AVG_" + variableThird

    //Select and sort the data so the graph is in descending order for the average
    thirdGraphData = []
    categories = []
    for (i=0; i < d.length; i++){
      temp = {
            "UF": d[i]["UF_RESIDENCIA"],
            "AVG" : Number(d[i][varAvg]),
            "MAX" : Number(d[i][varMax]),
            "MIN" : Number(d[i][varMin])
        }
      thirdGraphData.push(temp)
    }
    thirdGraphData.sort(compare)
    for (i=0; i < thirdGraphData.length; i++){
      categories.push(thirdGraphData[i]["UF"])
      }

//Adjusts the SVG so the graph fits in it
    var widthThird = 600
    var heightThird = 600

    var marginThird = {
            top: 30,
            left: 30,
            right: 30,
            bottom: 30
        };

    var graph3 = d3.select("#divgraph3")
            .append("svg")
            .attr('id', 'graph3')
            .attr('width', widthThird)
            .attr('height', heightThird)
            .append("g")
            .attr("transform", "translate(" + marginThird.left + "," + marginThird.top + ")")

//Adjust the areas to be used in the scale
    widthThird = widthThird - marginThird.left - marginThird.right
    heightThird = heightThird - marginThird.top - marginThird.bottom

//Defines the min and the max. It will be the biggest max number and the smaller min number
    maxValue = findMaxThird(thirdGraphData, "MAX")
    minValue = findMinThird(thirdGraphData, "MIN")

//creates the scale
    var myScaleXThird = d3.scaleLinear()
                          .range([0,widthThird])
                          .domain([minValue - 5,maxValue + 5]);

    var myScaleYThird = d3.scaleBand()
                        .range([0,heightThird])
                        .paddingInner(0.1)
                        .domain(categories)

//Creates the axis
    var xAxisThird = d3.axisTop(myScaleXThird)
                        .tickFormat(function(d){
                          if (variableThird == "HEIGHT")
                            {return d/100 + "m"}
                          else {return d + "kg"}
                        }).ticks(5)

    var yAxisThird = d3.axisLeft(myScaleYThird)

//Append the axis in the third graph
    graph3.append("g")
          .attr("class", "x axis")
          .call(xAxisThird);

    graph3.append("g")
          .attr("class", "y axis")
          .call(yAxisThird);

//Create the grid line. Only vertical ones are necessary since it is a dot plot
    function make_x_axis(scale) {
      return d3.axisTop(myScaleXThird)
                .ticks(5)
                    }

//Put the grid lines on the graph
    graph3.append("g")
          .attr("class", "grid")
          .call(make_x_axis()
            .tickSize(-heightThird)
            .tickFormat("")
          )

//Creates the bars
    var bars = graph3.selectAll(".bar")
                .data(thirdGraphData);

    var newBars = bars.enter()
                    .append('rect')
                    .attr('id',function(d,i){return "bar" + i})
                    .attr("width", function(d){return myScaleXThird(d.MAX) - myScaleXThird(d.MIN)})
                    .attr("height", myScaleYThird.bandwidth()/10)
                    .attr("fill", "#449adb")
                    .attr("y", function(d, i){ return myScaleYThird(categories[i]) + myScaleYThird.bandwidth()/2})
                    .attr("x", function(d) {return myScaleXThird(d.MIN)})
                    .attr("opacity", 0.8)


    newBars.merge(bars)

//Cretes the average dash on the dash
    var dash = graph3.selectAll(".bar")
            .data(thirdGraphData);

    var newDash = dash.enter()
                .append('rect')
                .attr('id',function(d,i){return "bar" + i})
                .attr("width", 1)
                .attr("height", myScaleYThird.bandwidth()/2)
                .attr("fill", "#000000")
                .attr("y", function(d,i) {return myScaleYThird(categories[i]) + myScaleYThird.bandwidth()/3})
                .attr("x", function(d) {return myScaleXThird(d.AVG)})
                .attr("opacity", 0.8)


    newDash.merge(dash)

//To select the tooltip div
    var div = d3.select(".tooltip")

//Creates the dot on the minimum value
    graph3.selectAll(".dotMin")
          .data(thirdGraphData)
          .enter()
          .append('circle')
          .attr("opacity", 0.9)
          .attr('r', 3)
          .attr('fill', "#000000")
          .attr('stroke-width', 0.3)
          .attr("cy", function(d, i){ return myScaleYThird(categories[i]) + myScaleYThird.bandwidth()/2})
          .attr("cx", function(d, i){ return myScaleXThird(d.MIN);})
          .on("mouseover", function (d) {
            div.style("opacity", 1)
            if (variableThird == "HEIGHT")
              {div.html(d.MIN/100 + " m ")}
            else {div.html(d.MIN + " kg ")}
            div.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 15) + "px")
          })
          .on("mouseout", function (d) {
            div.style("opacity", 0)

          })

//Creates the dot on the maximum value
    graph3.selectAll(".dotMax")
          .data(thirdGraphData)
          .enter()
          .append('circle')
          .attr("opacity", 0.9)
          .attr('r', 3)
          .attr('fill', "#000000")
          .attr('stroke-width', 0.3)
          .attr("cy", function(d, i){ return myScaleYThird(categories[i]) + myScaleYThird.bandwidth()/2})
          .attr("cx", function(d, i){ return myScaleXThird(d.MAX);})
          .on("mouseover", function (d) {
            div.style("opacity", 1)
            if (variableThird == "HEIGHT")
              {div.html(d.MAX/100 + " m ")}
            else {div.html(d.MAX + " kg ")}
            div.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 15) + "px")
          })
          .on("mouseout", function (d) {
            div.style("opacity", 0)

          })


//Note to myself: closes the update function and the csv
})}
