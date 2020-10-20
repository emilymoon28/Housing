console.log("hello world")

console.log("does this work")

//setup api
const url="/api/v1.0/table";

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 660 - margin.left - margin.right,
        height = 440 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var titleChunk = d3.select("#title_chunk")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", (height + margin.top + margin.bottom)/5)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var svg = d3.select("#my_dataviz")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    //Read the data
      d3.json(url, function(data) {
        // List of groups (here I have one group per column)
        var allStates = d3.map(data, function(d){return(d.state)}).keys()
        console.log(allStates)
    
        // add the options to the button
        d3.select("#selectButton")
          .selectAll('myOptions')
           .data(allStates)
          .enter()
          .append('option')
          .text(function (d) { return d; }) // text showed in the menu
          .attr("value", function (d) { return d; }) // corresponding value returned by the button
          .style("background-color", "#ccc")
    
        //A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
          .domain(allStates)
          .range(["#214869"]);

        var myColor2 = d3.scaleOrdinal()
          .domain(allStates)
          .range(["#b2b7ba"]);
    
        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
          .domain(d3.extent(data, function(d) { return d.year; }))
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).ticks(10));
          
    
        // Add Y axis
        //If it doesn't work, enter the yMax manually
        var y = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return +d.smocapi_35ormore_m_perc; })])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y).ticks(5));


    
        // Initialize line with first group of the list
        var line = svg
          .append('g')
          .append("path")
            .datum(data.filter(function(d){return d.state==allStates[0]}))
            .attr("d", d3.line()
              .x(function(d) { return x(d.year) })
              .y(function(d) { return y(+d.smocapi_35ormore_m_perc) })
            )
            .attr("stroke", function(d){ return myColor("valueZ") })
            .style("stroke-width", 4)
            .style("fill", "none")

        var line2 = svg
          .append('g')
          .append("path")
            .datum(data.filter(function(d){return d.state==allStates[0]}))
            .attr("d", d3.line()
              .x(function(d) { return x(d.year) })
              .y(function(d) { return y(+d.smocapi_35more_nm_perc) })
            )
            .attr("stroke", function(d){ return myColor2("valueZ") })
            .style("stroke-width", 4)
            .style("fill", "none")
            

    
        // A function that update the chart
        function update(selectedGroup) {
    
          // Create new data with the selection?
          var dataFilter = data.filter(function(d){return d.state==selectedGroup})
    
          // Give these new data to update line
          line
              .datum(dataFilter)
              .transition()
              .duration(1000)
              .attr("d", d3.line()
                .x(function(d) { return x(d.year) })
                .y(function(d) { return y(+d.smocapi_35ormore_m_perc) })
              )
              .attr("stroke", function(d){ return myColor(selectedGroup) })

          line2
              .datum(dataFilter)
              .transition()
              .duration(1000)
              .attr("d", d3.line()
                .x(function(d) { return x(d.year) })
                .y(function(d) { return y(+d.smocapi_35more_nm_perc) })
              )
              .attr("stroke", function(d){ return myColor2(selectedGroup) })
        }
    
        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)

            titleChunk.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0)
            .attr("text-anchor", "middle")  
            .attr("fill", "white")
            .style("font-size", "24px")  
            .text(`State Selected: ${selectedOption}`)
            .attr("transform", "translate(0,60)");
    
        })

        titleChunk.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0)
        .attr("text-anchor", "middle")  
        .attr("fill", "white")
        .style("font-size", "24px")  
        .text(`Ownership Costs (SMOCAPI) By State`);

        titleChunk.append("text")
        .attr("x", (width / 2))             
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "white")  
        .style("font-size", "24px")  
        .text("2010-2019"); 

        titleChunk.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0)
        .attr("text-anchor", "middle")  
        .attr("fill", "white")
        .style("font-size", "24px")  
        .text(`Ownership Costs (SMOCAPI) In ${selectedOption}`);

        titleChunk.append("text")
        .attr("x", (width / 2))             
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "white")  
        .style("font-size", "24px")  
        .text("2010-2019"); 

        // Handmade legend
        svg.append("circle").attr("cx",20)
          .attr("cy",330).attr("r", 6)
          .style("fill", "#214869")
        svg.append("circle")
          .attr("cx",20).attr("cy",360)
          .attr("r", 6).style("fill", "#b2b7ba")
        svg.append("text")
          .attr("x", 30).attr("y", 330)
          .text("upkeep costs with mortgage")
          .style("font-size", "15px")
          .style("fill", "white")
          .attr("alignment-baseline","middle")
        svg.append("text")
          .attr("x", 30).attr("y", 360)
          .text("upkeep costs without mortgage")
          .style("font-size", "15px")
          .style("fill", "white")
          .attr("alignment-baseline","middle")

        

    })

    