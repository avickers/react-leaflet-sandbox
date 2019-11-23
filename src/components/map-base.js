import Leaflet from 'leaflet'
import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import Papa from 'papaparse'
import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'
//import supers from '../assets/super.json'
//import tracts from '../assets/tctracts.json'
import csv from '../assets/tc_lrs.csv'

export default class MapBase extends Component {
  constructor() {
    super()
    const idbAdapter = new LokiIndexedAdapter()
    this.db = new Loki('metadata.db', {
      adapter: idbAdapter,
    	autoload: true,
    	autoloadCallback : this.dbInit.bind(this)
    })
    this.state = {
      lat: 30.2672,
      lng: -97.7431,
      zoom: 11,
    }
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
      fillOpacity: 0.9,
      fillColor: 'orange',
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
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      </Map>
    )
  }
}

// <GeoJSON
//   data={supers.features}
//   style={this.geoJSONStyle}
//   onEachFeature={this.onEachFeature}
// />

// Marker template for use with events, etc.
// <Marker position={position}>
//   <Popup>
//
//   </Popup>
// </Marker>
