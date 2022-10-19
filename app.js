/* Project
  1. Obtain user's location
  2. Map the location on Leaflet map
  3. Allow User to select a business type from a list and map 
  the 5 nearest locations on the map using Foursquare API
*/

/***************************************************************/

// Step 1: Obtain user's location

// Step 2: Create map focused on user's location

// Step 3: Create a input box below map to accept business type of interest

// Step 4: Clean and standardized user input

// Step 5: Use cleaned text in Geolocation API to identify local businesses

// Step 6: Filter

// fsq37tulbCKOQT7I5LzbIo5ilRLa8UyM6AUBsXb0PBJcvJc=

// map object
const myMap = {
  coordinates: [],
  businesses: [],
  map: {},
  markers: {},

  // build leaflet map
  buildMap() {
    this.map = L.map("map", {
      center: this.coordinates,
      zoom: 15,
    });

    // add openstreetmap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: "11",
    }).addTo(this.map);

    // create and add geolocation marker
    const marker = L.marker(this.coordinates);
    marker
      .addTo(this.map)
      .bindPopup("<p1><b>You are here</b><br></p1>")
      .openPopup();
  },

  // add business markers
  addMarkers() {
    for (var i = 0; i < this.businesses.length; i++) {
      this.markers = L.marker([this.businesses[i].lat, this.businesses[i].long])
        .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
        .addTo(this.map);
    }
  },
};

// get coordinates via geolocation api
async function getCoords() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return [pos.coords.latitude, pos.coords.longitude];
}

// get foursquare businesses
async function getFoursquare(business) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "fsq37tulbCKOQT7I5LzbIo5ilRLa8UyM6AUBsXb0PBJcvJc=",
    },
  };
  let limit = 5;
  let lat = myMap.coordinates[0];
  let lon = myMap.coordinates[1];
  let response = await fetch(
    `https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`,
    options
  );
  let data = await response.text();
  let parsedData = JSON.parse(data);
  let businesses = parsedData.results;
  console.log(parsedData);
  return businesses;
}

// process foursquare array
function processBusinesses(data) {
  let businesses = data.map((element) => {
    let location = {
      name: element.name,
      lat: element.geocodes.main.latitude,
      long: element.geocodes.main.longitude,
    };
    return location;
  });
  return businesses;
}

// event handlers
// window load
window.onload = async () => {
  const coords = await getCoords();
  myMap.coordinates = coords;
  myMap.buildMap();
};

// business submit button
document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();
  let business = document.getElementById("business").value;
  let data = await getFoursquare(business);
  myMap.businesses = processBusinesses(data);
  myMap.addMarkers();
});
