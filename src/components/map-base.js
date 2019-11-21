import Leaflet from 'leaflet'
import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import supers from '../assets/super.json'

export default class MapBase extends Component {
  constructor() {
    super()
    this.state = {
      lat: 30.2672,
      lng: -97.7431,
      zoom: 13,
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
        <GeoJSON
          data={supers.features}
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
