import {Buffer,Koc} from '@avickers/knockdown'
import mapboxgl from 'mapbox-gl'
import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'
import css from './css-mapbox'

import tracts from '../../assets/tracts.json'

export default class BaseMap extends Koc {
  constructor() {
    super()
    this.db = new Loki('metadata.db', {
      //adapter: idbAdapter,
      env: 'BROWSER',
      autoload: true,
      autoloadCallback : this.dbInit.bind(this)
    })
    this.container = document.createElement('div')
    this.container.style.height = '100vh'
    this.html`<div id="map" style="height: 100vh; width: 100%; padding-right: 0px;"></div>`
  }

  connectedCallback() {
    this.css`${css}`
    const el = this.shadowRoot.querySelector('#map')
    mapboxgl.accessToken = process.env.MAPBOX
    this.map = new mapboxgl.Map({
      container: el,
      style: `https://api.maptiler.com/maps/positron/style.json?key=${process.env.MAPTILER}`,
      center: [-97.7431, 30.2672],
      zoom: 9
    })

    this.map.on('load', () => {
      this.map.addSource('tracts', {
        type: 'geojson',
        data: tracts
      })

      this.map.addLayer({
        'id': 'tracts-layer',
        'type': 'fill',
        'source': 'tracts',
        'layout': {
          'visibility': 'visible'
        },
        'paint': {
          'fill-color': {
            'property': 'ACSPercents.pct_Hispanic',
            'stops': [
                [.4437, 'transparent'],
                [.5251, '#deebf7'],
                [.6555, '#9ecae1'],
                [1, '#3182bd']
            ]
          },
          'fill-outline-color': '#c0c0c0',
          'fill-opacity': 0.9
        }
      })

      this.map.on('click', 'tracts-layer', (e) => {
        console.log(e)
        const tier = {tier:1}
        const payload = {...e.features[0], ...tier}
        Buffer.get('panel').set(payload)
      })

      this.map.on('mouseenter', 'tracts-layer', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      })

        // Change it back to a pointer when it leaves.
      this.map.on('mouseleave', 'tracts-layer', () => {
        this.map.getCanvas().style.cursor = '';
      })
    })
    //this.map = L.map(el, { touchExtend: true }).setView([30.2672, -97.7431], 13)
    // const CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    // 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    // 	subdomains: 'abcd',
    // 	maxZoom: 19
    // }).addTo(this.map)
    //
    // L.geoJson(tracts, {style: this.style.bind(this), onEachFeature: this.onEachFeature.bind(this)}).addTo(this.map)

    // var customControl = L.Control.extend({
    //   options: {
    //   position: 'topright'
    //   //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    //   },
    //   onAdd: function (map) {
    //     var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
    //
    //     container.style.backdropFilter = 'invert(.7)'
    //     container.style.width = '30vw'
    //     container.style.height = '30px'
    //     container.style.marginRight = '370px'
    //
    //     container.onclick = function(){
    //       console.log('buttonClicked')
    //     }
    //     return container
    //   },
    // })
    // this.map.addControl(new customControl())
  }

  disconnectedCallback() {

  }

  dbInit() {
    let meta = this.db.getCollection("metadata")
    if (meta === null) {
      meta = this.db.addCollection("metadata")
      // do things
    } else {
      // do different things
    }
  }

  getTier(htc) {
    return htc > 39.39 ? 3
          : htc > 31.57  ? 2
          : htc > 27.63  ? 1
          : 0;
  }

  getColor(htc) {
    let color
    switch (this.getTier(htc)) {
      case 1:
        color = '#ce8544'
        break;
      case 2:
        color = '#c0c0c0'
        break;
      case 3:
        color = '#d4af37'
        break;
      default:
        color = 'transparent'
    }
    return color
  }

  onEachFeature(feature, layer) {
    const color = this.getColor(100 - feature.properties['ACSPercents.MRR2010'])
    const tier = this.getTier(100 - feature.properties['ACSPercents.MRR2010'])
    const hoverStyle = {
      fillColor: color === 'transparent'
      ? '#43b3ae'
      : color,
      fillOpacity: 0.33
    }

    const normalStyle = {
      fillColor: color === 'transparent'
      ? 'transparent'
      : color,
      fillOpacity: 0.7
    }

    function highlightFeature(ev) {
      console.log(ev)
      let obj = { tier: tier}
      let payload = {...feature, ...obj}
      Buffer.get('panel').set(payload)
      layer.setStyle(hoverStyle)
    }

    function resetHighlight() {
      //Buffer.get('panel').set(null)
      layer.setStyle(normalStyle)
    }

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    })
    this.map.on({
      touchstart: highlightFeature
    })
  }

  style(feature) {
    const color = this.getColor(100 - feature.properties['ACSPercents.MRR2010'])
    return {
        fillColor: color,
        weight: 1,
        opacity: 0.9,
        color: color === 'transparent'
        ? '#c0c0c080'
        : color,
        dashArray: '1',
        fillOpacity: 0.7
    };
  }
}
customElements.define("map-base", BaseMap)
