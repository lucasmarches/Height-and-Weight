//Find the minimun number in an array
function findMaxFourth(array) {
  let max = 0
  for (i=0;i<array.length;i++){
    if (Number(array[i]) > max){max = Number(array[i])}
  }
  return max
}

//Find the maximun value in the array
function findMinFourth(array) {
  let min = 200
  for (i=0;i<array.length;i++){
    if (Number(array[i]) < min){
      min = Number(array[i])
    }
  }
  return min
}


//Function that creates the fourth graph based on the option provided by the user
function updateFourthGraph() {
  //Select the options provided by the user
  let variableFourth = d3.select("#VariableFourthGraph")._groups[0][0].value

  //Remove the previous graph in case it already exists
  d3.select("#graph4")
    .transition()
    .duration(100)
    .remove()

//THIRD GRAPH
  var fileThird = "Data/avg_" + variableFourth + "_by_year.csv"
  d3.csv(fileThird, function(d){
    //set the domain for x axis
    fourthGraphXDomain = ["2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"]
    valuesFourth = []
    //Defines the max and minimum value for the y axis
    for (i=0; i < d.length; i++){
      for (i2=0; i2 < fourthGraphXDomain.length; i2 ++){
        valuesFourth.push(Number(d[i][fourthGraphXDomain[i2]]))
      }
    }
    maxValue = findMaxFourth(valuesFourth)
    minValue = findMinFourth(valuesFourth)

    //Adjusts the SVG so the graph fits in it
    var widthFourth = 700
    var heightFourth = 600

    var marginFourth = {
                top: 30,
                left: 40,
                right: 50,
                bottom: 30
            };

    var graph4 = d3.select("#divgraph4")
                .append("svg")
                .attr('id', 'graph4')
                .attr('width', widthFourth)
                .attr('height', heightFourth)
                .append("g")
                .attr("transform", "translate(" + marginFourth.left + "," + marginFourth.top + ")")

  //Adjust the areas to be used in the scale
    widthFourth = widthFourth - marginFourth.left - marginFourth.right
    heightFourth = heightFourth - marginFourth.top - marginFourth.bottom

  //Creates the scales
    let step = widthFourth/9
    var myScaleXFourth = d3.scaleOrdinal()
                          .range([0, step, 2*step, 3*step, 4*step, 5*step, 6*step,7*step,8*step, widthFourth])
                          .domain(fourthGraphXDomain);

    var myScaleYFourth = d3.scaleLinear()
                          .range([heightFourth, 0])
                          .domain([minValue - 1, maxValue + 1]);

  //Creates the axis
    var xAxisFourth = d3.axisBottom(myScaleXFourth)
                        .ticks(5)

    var yAxisFourth = d3.axisLeft(myScaleYFourth)
                        .tickFormat(function(d){
                          if (variableFourth == "height") {return d/100 + "m"}
                          else {return d + "kg"}
                        })

  //Append the axis in the fourth graph
    graph4.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + heightFourth + ")")
          .call(xAxisFourth);

    graph4.append("g")
          .attr("class", "y axis")
          .call(yAxisFourth);

  //Create the grid lines
    function make_x_axis(scale) {
      return d3.axisBottom(myScaleXFourth)
                    .ticks(10)
              }

    function make_y_axis(scale) {
      return d3.axisLeft(myScaleYFourth)
                    .ticks(10)
              }

  //Put the grid lines on the graph
    graph4.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + heightFourth + ")")
          .call(make_x_axis()
            .tickSize(-heightFourth)
            .tickFormat("")
          )

    graph4.append("g")
          .attr("class", "grid")
          .call(make_y_axis()
            .tickSize(-widthFourth)
            .tickFormat("")
          )

  //To select the tooltip div
    var div = d3.select(".tooltip")


//Append the value of the national average
    if (variableFourth == "height")
      {nationalAvgFourth = parseFloat(d[27][2017]/100).toFixed(3) + "m"}
    else {nationalAvgFourth = parseFloat(d[27][2017]).toFixed(2) + "kg"}

    graph4.append("text")
        .text(nationalAvgFourth)
        .attr("class", "explanation")
        .attr("id", "national_label")
        .style("font-size", "0.7rem")
        .attr("y", myScaleYFourth(d[27][2017]))
        .attr("x", myScaleXFourth("2017")+ 1)

  //Append the label with the final value that will appear on a mouseover
  graph4.selectAll(".labelFourth")
        .data(d)
        .enter()
        .append("text")
        .text(function(d) {
          if (d.UF_RESIDENCIA == "BR") { return ""}
          else {
            if (variableFourth == "height") {return parseFloat(d["2017"] / 100).toFixed(3) + "m"}
            else {return parseFloat(d["2017"]).toFixed(2) + "kg"}
          }
        })
        .attr("class", "explanation")
        .attr("id", function (d,i){
          return "labelFourth" + i
        })
        .style("font-size", "0.7rem")
        .attr("y", function(d,i) {
          return myScaleYFourth(d[2017])
        })
        .attr("x", myScaleXFourth("2017")+ 1)
        .attr("opacity", 0)

    //Define the line generator
    var line = d3.line()
                  .curve(d3.curveMonotoneX)
                  .x(function(d) {return myScaleXFourth(d.x); })
                  .y(function(d) {return myScaleYFourth(d.y); })

    var lines = graph4.selectAll(".line")
                .data(d);

    var newlines = lines.enter()
                        .append('path')
                        .attr("fill", "none")
                        .attr("id", function(d,i){
                          return "line" + i
                        })
                        .attr("stroke", function(d){
                          if (d.UF_RESIDENCIA == "BR") {return "#228B22"}
                          else {return "#fde7ed"}
                        }).attr("opacity",function(d){
                          if (d.UF_RESIDENCIA == "BR") {return "1"}
                          else {return "0.8"}
                        })
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-width", 3)
                        .attr("d", function(d){
                          let tempArray = []
                          for (i=0; i< fourthGraphXDomain.length; i++){
                            let tempObj = {
                              x : fourthGraphXDomain[i],
                              y : d[fourthGraphXDomain[i]]
                            }
                            tempArray.push(tempObj)
                          }
                          return line(tempArray)
                        }).on("mouseover", function (d, i ) {
                            d3.select("#line" + i)
                              .attr("stroke",function(d){
                                if (d.UF_RESIDENCIA == "BR") {return "#228B22"}
                                else {return "#449adb"}
                            })

                        //For the tooltip on mouseover
                            div.style("opacity", 1)
                              .html(d.UF_RESIDENCIA)
                              .style("left", (d3.event.pageX) + "px")
                              .style("top", (d3.event.pageY + 15) + "px")

                        //For the label on mouseover
                            d3.select("#labelFourth" + i)
                              .attr("opacity", 1)

                            d3.select("#national_label")
                              .attr("opacity", 0)

                        }).on("mouseout", function (d, i) {
                            d3.select("#line" + i)
                              .attr("stroke", function(d){
                                if (d.UF_RESIDENCIA == "BR") {return "#228B22"}
                                else{return "#fde7ed"}
                            })

                            div.style("opacity", 0)

                            d3.select("#labelFourth" + i)
                              .attr("opacity", 0)

                            d3.select("#national_label")
                              .attr("opacity", 1)
                        })


//Note to myself: closes the update and csv callback functions
})}
