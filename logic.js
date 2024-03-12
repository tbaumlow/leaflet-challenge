// Function to create the map
function createMap(earthquakeData) {
    // Create a tile layer with the desired map background (e.g., OpenStreetMap)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create the map and set the initial view
    const map = L.map('map', {
      center: [0, 0], // Initial center coordinates
      zoom: 2, // Initial zoom level
      layers: [tileLayer] // Add the tile layer as the base layer
    });
  
    // Add markers for earthquake data
    for (const earthquake of earthquakeData.features) {
      const coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
      const magnitude = earthquake.properties.mag;
      const depth = earthquake.geometry.coordinates[2];
  
      // Customize marker based on magnitude and depth
      const marker = L.circleMarker(coordinates, {
        radius: magnitude * 2, // Adjust the size based on magnitude
        color: getColor(depth), // Get color based on depth
        fillOpacity: 0.7
      });
  
      // Add popup with additional information
      marker.bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`);
      
      // Add the marker to the map
      marker.addTo(map);
    }
  
    // Create a legend
    const legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [0, 10, 30, 50, 70, 90]; // Customize depth intervals
  
      for (let i = 0; i < depths.length - 1; i++) {
        div.innerHTML +=
          `<i style="background:${getColor(depths[i] + 1)}"></i> ${depths[i]}-${depths[i + 1]} km <br>`;
      }
  
      return div;
    };
  
    // Add legend to the map
    legend.addTo(map);
  }
  
  // Function to get color based on depth
  function getColor(depth) {
    return depth > 90 ? '#80ff00' :
           depth > 70 ? '#bfff00' :
           depth > 50 ? '#ffff00' :
           depth > 30 ? '#ffbf00' :
           depth > 10 ? '#ff8000' :
                        '#ff4000';
  }
  
  // Fetch earthquake data from the USGS GeoJSON feed
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
  
  fetch(url)
    .then(response => response.json())
    .then(data => createMap(data));
