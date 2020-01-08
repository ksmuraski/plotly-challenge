function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadata= `/metadata/${sample}`;
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(metadata).then(function(sample) {
    var samplemetadata=d3.select("#sample-metadata")
 
    // Use `.html("") to clear any existing metadata
    samplemetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(sample).forEach(function([key,value]) {
      var line=samplemetadata.append("p");
      line.text(`${key}:${value}`);
    })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 })

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartData=`/samples/${sample}`;
 
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(chartData).then(function(data) {
      var xData = data.otu_ids;
      var yData = data.sample_values;
      var size = data.sample_vales;
      var colour = data.otu_ids;
      var labels = data.otu_labels;
      var hover = data.otu_labels;

      var trace1 = {
        x: xData,
        y: yData,
        labels: labels,
        hovertext: hover,
        marker: {
          color: colour,
          size: size,
        }
      };

    var data = [trace1]
    var layout = {
      xaxis: {title:"OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout)
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var sampleValues=data.sample_values.slice(0,10);
    var labels=data.otu_ids.slice(0,10);
    var hover=data.otu_labels.slice(0,10)

    var data = [{
      values: sampleValues,
      labels: labels,
      hovertext: hover,
      type: "pie"
    }];
    Plotly.newPlot('pie', data)
 })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
