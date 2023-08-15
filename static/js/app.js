d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
  // Extract necessary data
  var samples = data.samples;
  var names = data.names;

  // Populate the dropdown menu with Test Subject IDs
  var dropdownMenu = d3.select("#selDataset");
  names.forEach(name => {
    dropdownMenu.append("option").attr("value", name).text(name);
  });

  // Initial function to initialize the page with the first subject data
  function init() {
    var selectedName = names[0];
    updateCharts(selectedName);
  }
  function optionChanged(selectedName) {
    updateCharts(selectedName); // Update all charts and metadata
  }

  // Function to update charts based on the selected name
  function updateCharts(selectedName) {
    var selectedSample = samples.find(sample => sample.id === selectedName);
    var top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    var top10OTUIds = selectedSample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    var top10OTULabels = selectedSample.otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart
    var barTrace = {
      x: top10SampleValues,
      y: top10OTUIds,
      text: top10OTULabels,
      type: "bar",
      orientation: "h"
    };

    var barLayout = {
      title: "Top 10 OTUs",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", [barTrace], barLayout);

    var bubbleTrace = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: "markers",
        marker: {
          size: selectedSample.sample_values,
          color: selectedSample.otu_ids,
          colorscale: "Earth"  // You can choose a different colorscale if desired
        }
      };
    
      var bubbleLayout = {
        title: "Sample Values vs OTU IDs",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" }
      };
    
      Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
    
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");  // Clear existing content

    var selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedName));

    Object.entries(selectedMetadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

  // Function to handle dropdown menu change
  function optionChanged(selectedName) {
    updateCharts(selectedName);
  }

  // Initialize the page
  init();

  // Set up event listener for dropdown menu change
  dropdownMenu.on("change", function() {
    var selectedName = dropdownMenu.property("value");
    optionChanged(selectedName);
  });
});