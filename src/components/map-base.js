import Leaflet from 'leaflet'
import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import Papa from 'papaparse'
import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'
//import supers from '../assets/super.json'
import tracts from '../assets/tctracts.json'
import csv from '../assets/tc_lrs.csv'

export default class MapBase extends Component {
  constructor() {
    super()
    this.db = null
    this.state = {
      lat: 30.2672,
      lng: -97.7431,
      zoom: 11,
    }
  }

  componentDidMount() {
    const idbAdapter = new LokiIndexedAdapter()
    this.db = new Loki('metadata.db', {
      adapter: idbAdapter,
      autoload: true,
      autoloadCallback : this.dbInit.bind(this)
    })
  }

  dbInit() {
    let meta = this.db.getCollection("metadata")
    if (meta === null) {
      meta = this.db.addCollection("metadata")
      Papa.parse(csv, {
        download: true,
        header: true,
        complete: data => {
          meta.insert(data.data)
          this.db.saveDatabase()
        }
      })
      console.log(meta)
    } else {
      console.log(meta)
    }
  }

  geoJSONStyle() {
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: Math.random(),
      fillColor: 'silver',
    }
  }

  onEachFeature(feature, layer) {
    const popupContent = `<Popup> TBD </Popup>`
    layer.bindPopup(popupContent)
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        />
        <TileLayer
          url='https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.png'
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
        />
        <GeoJSON
          data={tracts.features}
          style={this.geoJSONStyle}
          onEachFeature={this.onEachFeature}
        />
      </Map>
    )
  }
}

// Marker template for use with events, etc.
// <Marker position={position}>
//   <Popup>
//
//   </Popup>
// </Marker>
