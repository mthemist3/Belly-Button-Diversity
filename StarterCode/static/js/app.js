
function getChart(sample) {
    d3.json("samples.json").then(function(data)  {
      // console.log(data)
      // Grab values from the data json object to build the plots
      var siftedArray= data.samples.filter(S => S.id == sample);
      var sift= siftedArray[0];
    // Slicing top 10 values and reversing the order
      var values = sift.sample_values;
      console.log(values)
    // Slicing top 10 ids and mapping to a name/reversing order
      var ids = sift.otu_ids;
      console.log(ids)
    // Slicing labels to match the above
      var labels = sift.otu_labels;
      console.log(labels)


      // ------------------------------------
      // Bar Chart
      // ------------------------------------

      // Slicing data for x,y,and text values in order to pull the max top 10 values
      var bar_info =[
        {
          y:ids.slice(0, 10).map(otuID => `OTU - ${otuID}`).reverse(),
          x:values.slice(0,10).reverse(),
          text:labels.slice(0,10).reverse(),
          // Styling as a bar chart and changing orientation to horizontal
          type:"bar",
          orientation:"h"
    
        }
      ];
    // Required to create a Layout for the chart
      var barLayout = {
        title: "Top 10 Belly Button Bacteria Cultures",
        margin: { t: 40, l: 100 }
      };

    Plotly.newPlot("bar", bar_info, barLayout);
      
    
// ------------------------------------
// Bubble Chart
// ------------------------------------
    
    // Required to create a Layout for the chart
    var bubbleLayout = {
      margin: { t: 5 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };
    // Added some chart information and referenced the correct values
      var DataBubble = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];
    // Plotted the bubble chart using the information above
    Plotly.newPlot("bubble", DataBubble, bubbleLayout);

  });
};

// Using very similar code as above to filter through the keys and append information to the panel in the html
function getMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var siftedArray= data.metadata.filter(S => S.id == sample);
    var sift= siftedArray[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    // sifting through metadeta for key and associated value and appending
    Object.entries(sift).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  })
}

// Initializing function
function init() {

  // Taking the names of each sample to fill the dropdown
  d3.json("samples.json").then((data) => {
    data.names.forEach((sample) => {
      d3.select("#selDataset")
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Using the first sample to create the initial plots for bar and pie chart
    const firstSample = sampleName[0];
    getChart(firstSample);
    getMetadata(firstSample);
  });
  }
  // Switching sample to switch plots for the graphs
  function optionChanged(newSample) {
    getChart(newSample);
    getMetadata(newSample);
  }
  

  init();