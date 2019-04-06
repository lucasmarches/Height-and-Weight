function updateFifthGraph() {
  //Select the variables that will be used
  let yearFifth = d3.select("#YearFifthGraph")._groups[0][0].value
  let variableFifth = d3.select("#VariableFifthGraph")._groups[0][0].value

  //Remove the previous graph in case it already exists
  d3.select("#graph5")
    .transition()
    .duration(100)
    .remove()

//THIRD GRAPH
  var fileFifth = "Data/described" + yearFifth + ".csv"
  d3.csv(fileFifth, function(d){
//Select the data for the state
    for (i=0;i < d.length ; i++){
      if (d[i]["UF_RESIDENCIA"] == variableFifth) {
        var stateFifth = d[i]
      }
    }

//Adjusts the SVG so the graph fits in it
    var widthFifth = 600
    var heightFifth = 600

    var marginFifth = {
                top: 30,
                left: 80,
                right: 30,
                bottom: 30
            };

//Creates the SVG
    var graph5 = d3.select("#divgraph5")
            .append("svg")
            .attr('id', 'graph5')
            .attr('width', widthFifth)
            .attr('height', heightFifth)
            .append("g")
            .attr("transform", "translate(" + marginFifth.left + "," + marginFifth.top + ")")

//Adjust the areas to be used in the scale
    widthFifth = widthFifth - marginFifth.left - marginFifth.right
    heightFifth = heightFifth - marginFifth.top - marginFifth.bottom

//Select the maximum value for the domain
    let valueMaxFifth = d[27]["SAMPLE_SIZE"]

//creates the scale
    var myScaleXFifth = d3.scaleLinear()
                          .range([0,widthFifth])
                          .domain([0, widthFifth]);

    var myScaleYFifth = d3.scaleLinear()
                          .range([0,heightFifth])
                          .domain([valueMaxFifth, 0])

  //Creates the y axis. This one does not need a x axis
    var yAxisFifth = d3.axisLeft(myScaleYFifth)
                        .ticks(5)

//Append the axis in the fifth graph
    graph5.append("g")
          .attr("class", "y axis")
          .call(yAxisFifth);

//Create the grid lines
    function make_y_axis(scale) {
      return d3.axisLeft(myScaleYFifth)
                  .ticks(5)
            }


    graph5.append("g")
          .attr("class", "grid")
          .call(make_y_axis()
          .tickSize(-widthFifth)
          .tickFormat("")
        )

//Create the two columns
// First, Brazil column
    graph5.append('rect')
          .attr('id',"column_brazil")
          .attr("width", myScaleXFifth(widthFifth - 120))
          .attr("height", myScaleYFifth(0))
          .attr("fill", "#449adb")
          .attr("y", myScaleYFifth(valueMaxFifth))
          .attr("x", myScaleXFifth(40))
          .style("opacity", 0.7)

//Append the label with the value for Brazil
    graph5.append('text')
          .text(valueMaxFifth)
          .attr('id',"label_brazil")
          .attr("class", "explanation")
          .style("font-size", "1rem")
          .attr("y", myScaleYFifth(valueMaxFifth) - 2)
          .attr("x", myScaleXFifth(widthFifth/3 + widthFifth/12))
          .style("opacity", 0.9)


//Append the label with the value for the selected state. it comes before in this case due to the mouseover effect
    graph5.append('text')
          .text(stateFifth.SAMPLE_SIZE)
          .attr('id',"label_state")
          .attr("class", "explanation")
          .style("font-size", "1rem")
          .attr("y", myScaleYFifth(stateFifth.SAMPLE_SIZE) - 2)
          .attr("x", myScaleXFifth(widthFifth/3 + widthFifth/12))
          .style("opacity", 0.9)


//Append the column for the selected state
    graph5.append('rect')
          .attr('id',"column_state")
          .attr("width", myScaleXFifth(widthFifth - 120))
          .attr("height", myScaleYFifth(0)- myScaleYFifth(stateFifth.SAMPLE_SIZE))
          .attr("fill", "#228B22")
          .attr("y", myScaleYFifth(stateFifth.SAMPLE_SIZE))
          .attr("x", myScaleXFifth(40))
          .style("opacity", 0.7)
          .on("mouseover", function (d) {
            d3.select("#label_state")
              .html(parseFloat(stateFifth.SAMPLE_SIZE *100 / valueMaxFifth).toFixed(2) + "% of the total")
              .attr("x", myScaleXFifth(widthFifth/3))
          })
          .on("mouseout", function (d) {
            d3.select("#label_state")
              .html(stateFifth.SAMPLE_SIZE)
              .attr("x", myScaleXFifth(widthFifth/3 + widthFifth/12))

          })

//Note to myself: closes the update and csv function
})}
