import { MapControl, withLeaflet } from "react-leaflet"
import L from "leaflet"

class Legend extends MapControl {
  createLeafletElement(props) {}

  componentDidMount() {
    // get color depending on population density value
    const getColor = d => {
      return d > 80
        ? "#c0c0c0e6"
        : d > 70
        ? "#c0c0c0CC"
        : d > 60
        ? "#c0c0c099"
        : d > 50
        ? "#c0c0c080"
        : d > 40
        ? "#c0c0c066"
        : d > 30
        ? "#c0c0c04d"
        : d > 20
        ? "#c0c0c01A"
        : "#c0c0c000"
    };

    const legend = L.control({ position: "bottomright" })

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend")
      const grades = [80,70,60,50,40,30,20]
      let labels = []
      let from
      let to

      for (let i = 0; i < grades.length; i++) {
        from = grades[i]
        to = grades[i + 1]

        labels.push(
          `<i style="background:${getColor(from + 1)}"></i>
          ${from === 80 ? 'high' : from === 20 ? 'low' : ''}`
        );
      }

      div.innerHTML = labels.join("<br>")
      return div
    };

    const { map } = this.props.leaflet
    legend.addTo(map)
  }
}

export default withLeaflet(Legend)
