import L from 'leaflet'
import React, { Component, Suspense } from 'react'
import { Map, MapControl, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import ReactLoading from "react-loading"
import Legend from './legend'
import Papa from 'papaparse'
import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'
import tracts from '../assets/tctracts.json'
import csv from '../assets/tc_lrs.csv'

export default class MapBase extends Component {
  constructor() {
    super()
    this.db = null
    this.state = {
      isLoading: false,
      lat: 30.2672,
      lng: -97.7431,
      zoom: 11,
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    })
    //const idbAdapter = new LokiIndexedAdapter()
    this.db = new Loki('metadata.db', {
      //adapter: idbAdapter,
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
          this.setState({
            loadData: true,
            isLoading: false,
            coll: meta
          })
        }
      })
    } else {
      this.setState({
        loadData: true,
        isLoading: false,
        coll: meta
      })
    }
  }

  onEachFeature(feature, layer) {
    const coll = this.state.coll
    let results = coll.find({'NAMELSAD': feature.properties.NAMELSAD})
    const popupContent = `<Popup> Low Response Projection: ${results[0]['Low_Response_Score']||'N/A'} </Popup>`
    layer.bindPopup(popupContent)
  }

  geoStyle(feature) {
    const coll = this.state.coll
    let results = coll.find({'NAMELSAD': feature.properties.NAMELSAD})
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: results[0]['Low_Response_Score']*0.02,
      fillColor: 'silver'
    }
  }

  render() {
    const { isLoading, loadData } = this.state
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url='https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
        />
        <TileLayer
          url='https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png'
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
        />
        {loadData && (
          <Suspense fallback={<ReactLoading type="spinningBubble" color="green" />}>
            <GeoJSON
              data={tracts.features}
              style={this.geoStyle.bind(this)}
              onEachFeature={this.onEachFeature.bind(this)}
            />
          </Suspense>
       )}
       <Legend />
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
