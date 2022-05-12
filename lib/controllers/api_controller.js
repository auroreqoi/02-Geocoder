import { Controller } from "@hotwired/stimulus";
import mapboxgl from "mapbox-gl";

export default class extends Controller {
  static targets = ["input", "coordinate"];

  connect() {
    this.fetchApi('Space Needle Seattle');
  }

  fetchApi(query) {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=pk.eyJ1IjoiYXVyb3JlcW9pIiwiYSI6ImNsMnVobTkwcjAyNmkzZG96ZzEzM244bXkifQ.o8ydSJ-o-KbMNUUZv7VPYw`)
      .then(response => response.json())
      .then(data => this.insertApi(data));
  }

  insertApi(data) {
    const apiTag = `${data.features[0].geometry.coordinates}`;
    this.coordinateTarget.insertAdjacentHTML('beforeend', apiTag);

    mapboxgl.accessToken = 'pk.eyJ1IjoiYXVyb3JlcW9pIiwiYSI6ImNsMnVobTkwcjAyNmkzZG96ZzEzM244bXkifQ.o8ydSJ-o-KbMNUUZv7VPYw';
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y",
      pitch: 65,
      bearing: 70,
      center: [data.features[0].geometry.coordinates[0], data.features[0].geometry.coordinates[1]],
      zoom: 12
    });

    new mapboxgl.Marker()
      .setLngLat([data.features[0].geometry.coordinates[0], data.features[0].geometry.coordinates[1]])
      .addTo(map);

    map.on('load', () => {
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
    })

  }

  search(event) {
    event.preventDefault();
    this.coordinateTarget.innerHTML = '';
    this.fetchApi(this.inputTarget.value);
  }
}
