import {Buffer,Koc} from '@avickers/knockdown'
import L from 'leaflet'
import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'
import css from './css-leaflet'

import tracts from '../assets/tracts.json'

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
    this.map = L.map(el).setView([30.2672, -97.7431], 13)
    const CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    	subdomains: 'abcd',
    	maxZoom: 19
    }).addTo(this.map)

    L.geoJson(tracts, {style: this.style.bind(this), onEachFeature: this.onEachFeature.bind(this)}).addTo(this.map)

    var customControl = L.Control.extend({
      options: {
      position: 'topright'
      //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
      },
      onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')

        container.style.backdropFilter = 'invert(.7)'
        container.style.width = '30vw'
        container.style.height = '30px'
        container.style.marginRight = '370px'

        container.onclick = function(){
          console.log('buttonClicked')
        }
        return container
      },
    })
    this.map.addControl(new customControl())
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
    return htc > .35 ? 3
          : htc > .28  ? 2
          : htc > .20  ? 1
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
    const color = this.getColor(feature.properties['ACSPercents.pct_Hispanic']*1.0)
    const tier = this.getTier(feature.properties['ACSPercents.pct_Hispanic']*1.0)
    const hoverStyle = {
      fillColor: color === 'transparent'
      ? '#43b3ae'
      : color,
      fillOpacity: 0.9
    }

    const normalStyle = {
      fillColor: color === 'transparent'
      ? 'transparent'
      : color,
      fillOpacity: 0.6
    }

    function highlightFeature(ev) {
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
    mouseout: resetHighlight,
    })
  }

  style(feature) {
    const color = this.getColor(feature.properties['ACSPercents.pct_Hispanic']*1.0)
    return {
        fillColor: color,
        weight: 1,
        opacity: 0.7,
        color: color === 'transparent'
        ? '#c0c0c080'
        : color,
        dashArray: '1',
        fillOpacity: 0.6
    };
  }
}
customElements.define("map-base", BaseMap)
