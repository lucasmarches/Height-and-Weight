//Common resources

//The following function was adapted from https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
//Sort an array of objects
function compare(a,b) {
  if (a["AVG"] > b["AVG"])
    return -1;
  if (a["AVG"] < b["AVG"])
    return 1;
  return 0;
}

//Function that creates the second graph
function updateSecondGraph() {
//Grab the options made by the user
  let year = d3.select("#YearSecondGraph")._groups[0][0].value
  let variable = d3.select("#VariableSecondGraph")._groups[0][0].value

//Clean the div where the graph appears
  d3.select("#graph2")
    .transition()
    .duration(100)
    .remove()

//SECOND GRAPH
  var fileSecond = "Data/described" + year + ".csv"
  d3.csv(fileSecond, function(d){
//Select and sort the data so the graph is in descending order
    secondGraphData = []
    categoriesSecond = []
    for (i=0; i < d.length; i++){
      temp = {
        "UF": d[i]["UF_RESIDENCIA"],
        "AVG" : Number(d[i][variable])
    }
      secondGraphData.push(temp)
}
    secondGraphData.sort(compare)
    for (i=0; i < secondGraphData.length; i++){
      categoriesSecond.push(secondGraphData[i]["UF"])
  }

//Adjusts the SVG so the graph fits in it
    var widthSecond = 500
    var heightSecond = 600

    var marginSecond = {
      top: 30,
      left: 30,
      right: 50,
      bottom: 30
  };

    var graph2 = d3.select("#divgraph2")
      .append("svg")
      .attr('id', 'graph2')
      .attr('width', widthSecond)
      .attr('height', heightSecond)
      .append("g")
      .attr("transform", "translate(" + marginSecond.left + "," + marginSecond.top + ")")

//Adjust the areas to be used in the scale
    widthSecond = widthSecond - marginSecond.left - marginSecond.right
    heightSecond = heightSecond - marginSecond.top - marginSecond.bottom

//Defines the min and the max. Since its sorted, it is the Second and the last value of the array
    maxValue = Number(secondGraphData[0]["AVG"])
    minValue = Number(secondGraphData[27]["AVG"])

//creates the scale
    var myScaleXSecond = d3.scaleLinear()
                      .range([0,widthSecond])
                      .domain([minValue - 1,maxValue]);

    var myScaleYSecond = d3.scaleBand()
                    .range([0,heightSecond])
                    .paddingInner(0.1)
                    .domain(categoriesSecond)

//Creates the axis
    var xAxisSecond = d3.axisTop(myScaleXSecond)
                      .tickFormat(function(d){
                        if (variable == "AVG_HEIGHT")
                          {return d/100 + "m"}
                        else {return d + "kg"}
                      })
                      .ticks(5)

    var yAxisSecond = d3.axisLeft(myScaleYSecond)

//Append the axis in the second graph
    graph2.append("g")
      .attr("class", "x axis")
      .call(xAxisSecond);

    graph2.append("g")
      .attr("class", "y axis")
      .call(yAxisSecond);

//Create the grid line. Only vertical ones are necessary since it is a bar graph
    function make_x_axis(scale) {
      return d3.axisTop(myScaleXSecond)
                .ticks(5)
          }

//Put the grid lines on the graph
    graph2.append("g")
        .attr("class", "grid")
        .call(make_x_axis()
          .tickSize(-heightSecond)
          .tickFormat("")
        )

//Creates the bars
    var bars = graph2.selectAll(".bar")
                .data(secondGraphData);

    var newBars = bars.enter()
                    .append('rect')
                    .attr('id',function(d,i){ return "bar" + i})
                    .attr("width", 0)
                    .attr("height", myScaleYSecond.bandwidth())
                    .attr("fill", function (d) {
                      if (d.UF == "BR") {
                        window.xLabelPosition = d["AVG"]
                        return "#228B22"
                      }else {return"#449adb"}
                    })
                    .attr("y", function(d, i){ return myScaleYSecond(categoriesSecond[i]) + 0.5})
                    .attr("x", myScaleXSecond(minValue - 1))
                    .attr("opacity", 0.8)
                    .on("mouseover", function (d,i) {
                      d3.select("#bar" + i)
                        .attr("stroke", "black")
                        .attr("stroke-width", "1px")
                        .attr("opacity", 0.6)

                      d3.select("#label" + i)
                          .attr("opacity", 0.8)
                    })
                    .on("mouseout", function (d,i) {
                      d3.select("#bar" + i)
                        .attr("stroke", "none")
                        .attr("opacity", 0.8)

                      d3.select("#label" + i)
                          .attr("opacity", 0)
                    });

    newBars.merge(bars)
      .transition()
      .duration(800)
      .attr("width", function(d) {
        return myScaleXSecond(d["AVG"])
      })

//Create the label for the national average
    var labelNationalAvg = graph2.append('text')

    var newLabelNationalAvg = labelNationalAvg.attr('class',"label")
                      .attr("y", myScaleYSecond("BR") + myScaleYSecond.bandwidth() - 4)
                      .attr("x", myScaleXSecond(minValue + (xLabelPosition - minValue)/3))
                      .attr("opacity", 0)
                      .text("National average")

//Create the label for each bar
    newLabelNationalAvg.merge(labelNationalAvg)
          .transition()
          .duration(2000)
          .attr("opacity", 0.8)

//Creates the label with the variable value
    var labels = graph2.selectAll(".labels_values")
                .data(secondGraphData);

    var newLabels = labels.enter()
                            .append('text')
                            .attr('class',"label_bar")
                            .attr("id", function(d,i){ return "label" + i})
                            .attr("y", function(d, i){ return myScaleYSecond(categoriesSecond[i]) + myScaleYSecond.bandwidth() - 2})
                            .attr("x", function(d,i){ return myScaleXSecond(d["AVG"]) + 3})
                            .attr("opacity", 0)


    newLabels.merge(labels)
              .text(function(d,i){
                if (variable == "AVG_HEIGHT") {
                  return Number(d["AVG"]/100).toFixed(4) + " m"
              }else { return Number(d["AVG"]).toFixed(2) + " kg"}
              })


//Note to myself: closes the csv function
})}
