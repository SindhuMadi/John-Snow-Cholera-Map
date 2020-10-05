var height =600;
var width = 600;
//The SVG Container
var svgContainer = d3.select("body").append("svg")
                                    .attr("width", "600")
                                    .attr("height", "600");
var margin = {left:0, right:25, top:0, bottom:0};
var chartGroup1 = svgContainer.append("g")
                    .attr("transform","translate("+margin.left+","+margin.top+")");

d3.json("streets.json").get(function(error, data){

    for(var p=0;p<data.length;p++){
        var d =[];
        for(var j=0;j<data[p].length;j++){
          d.push({x:data[p][j].x, y: data[p][j].y});
        }
        //  console.log(d);
        var lineFunction = d3.line()
                              .x(function(d,i) { return d.x*30; })
                               .y(function(d,i) { return height - d.y*30; })
                                .curve(d3.curveLinear);

        //The line SVG Path we draw
        var lineGraph = chartGroup1.append("path")
                                    .attr("d", lineFunction(d))
                                    .attr("stroke", "blue")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "none");
        };

});

d3.csv("pumps.csv")
      .get(function(error, data){

        //console.log(data);
      chartGroup1.selectAll("circle")
        .data(data)
        .enter().append("circle")
                .attr("class","pumps")
                .attr("cx",function(d,i){return d.x*30;})
                .attr("cy",function(d,i){return height - d.y*30;})
                .attr("r","6")
                .attr("fill","green")
                .attr("stroke","black");

  });

  // chartGroup1.selectAll("rect")
  //             .enter().append("rect")
  //             .attr("class","legend")
  //             .attr("height","50")
  //             .attr("width","50")
  //             .attr("x",550)
  //             .attr("y",100)
  //             .attr("stroke","yellow");

var tooltip2 = d3.select("body").append("div").style("opacity","0").style("position","absolute");

d3.csv("test_deaths.csv")
      .get(function(error, data){
        console.log(data);
        chartGroup1.selectAll("circle")
          .data(data)
          .enter().append("circle")
                  .attr("class", "deaths_age_sex")
                  .attr("cx",function(d,i){return d.x*30;})
                  .attr("cy",function(d,i){return d.y*30;})
                  .attr("r","3")
                  .attr("stroke","black")
                  .attr("stroke-width",0.5)
                  .attr("fill",function(d,i){
                            if (d.gender==0){
                              return "blue";
                            } else{
                              return "red";
                            }
                          })
                  .on("mouseover", function(d){
                    d3.select(this)
                        .transition()
                          .attr("r","6");
                    tooltip2.style("opacity","1")
                            .style("left",d3.event.pageX+"px")
                            .style("top",d3.event.pageY+"px");
                          tooltip2.html("Age:"+d.age)+" <br> Gender:"+d.gender);
                  })
                  .on("mouseout", function(d){
                    d3.select(this)
                      .transition()
                        .attr("r","2.5");
                      tooltip.style("opacity","0");
                      //  this.style.fill="black";
                    //deaths_by_index();
                  });
        //console.log(data);


    function deaths_by_index(start_index = 0, end_index = data.length-1){
      new_data = data.slice(start_index, end_index);
      console.log(new_data);
      chartGroup1.selectAll(".deaths_age_sex").remove();
        chartGroup1.selectAll("circle")
                  .data(new_data)
                  .enter().append("circle")
                  .transition()
                  .duration(3000)
                .attr("class", "deaths_age_sex")
                .attr("cx",function(d,i){return d.x*30;})
                .attr("cy",function(d,i){return height - d.y*30;})
                .attr("r","3")
                .attr("stroke","black")
                .attr("stroke-width",0.5)
                .attr("fill",function(d,i){
                          if (d.gender==0){
                            return "blue";
                          } else{
                            return "red";
                          }
                        });
          };

var parseDate = d3.timeParse("%d-%b");
var formatMonth = d3.timeFormat('%d-%b');
d3.csv("deathdays.csv")
    .row(function(d){return {date: parseDate(d.date), deaths:Number(d.deaths)};})
    .get(function(error, data){

    var height = 300;
    var width = 500;
    var tooltip = d3.select("body").append("div").style("opacity","0").style("position","absolute");

    var max = d3.max(data, function(d){return d.deaths;});
    var minDate = d3.min(data, function(d){return d.date;});
    var maxDate = d3.max(data, function(d){return d.date;});

    var y = d3.scaleLinear()
                .domain([0, max])
                .range([height,0]);

    var x = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, width]);

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);

    var svg1 = d3.select("body").append("svg").attr("height","600").attr("width","600");

    var margin = {left:50, right:50, top:150, bottom:0};

    var chartGroup = svg1.append("g")
                      .attr("transform","translate("+margin.left+","+margin.top+")");

    var line = d3.line()
                  .x(function(d){return x(d.date); })
                  .y(function(d){return y(d.deaths); });

    chartGroup.append("path").attr("d", line(data));
    chartGroup.append("g").attr("class","x axis").attr("transform","translate(0,"+height+")").call(xAxis);
    chartGroup.append("g").attr("class","y axis").call(yAxis);

    chartGroup.append("text")
          .attr("x", (width / 2))
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text("Timeline Graph");

    chartGroup.selectAll("circle")
        .data(data)
        .enter().append("circle")
                .attr("class", function(d,i){return "grp"+i; })
                .attr("cx",function(d,i){return x(d.date);})
                .attr("cy",function(d,i){return y(d.deaths);})
                // .attr("height",function(d){return d.deaths*2.5;})
                // .attr("width","10")
                .attr("r","3")
                .on("mouseover", function(d){
                  d3.select(this)
                      .transition()
                        .attr("r","6");
                  tooltip.style("opacity","1")
                          .style("left",d3.event.pageX+"px")
                          .style("top",d3.event.pageY+"px");
                        tooltip.html("Date:"+formatMonth(d.date)+" <br> Number of Deaths:"+d.deaths);
                })
                .on("mouseout", function(d){
                  d3.select(this)
                    .transition()
                      .attr("r","3");
                    tooltip.style("opacity","0");
                      this.style.fill="black";
                  deaths_by_index();
                })
                .on("click", function(d,i){
                  var total_deaths = 0;
                  for(var x=0;x<i;x++){
                    total_deaths = total_deaths + data[x].deaths;
                  };

                //  console.log("Total Deaths: "+total_deaths);
                  var start_index = total_deaths;
                  var end_index = start_index + data[i].deaths;
                  //console.log("start_index:"+start_index);
                  //console.log("End_index:"+end_index);
                  deaths_by_index(start_index, end_index);
                });

});
  });
