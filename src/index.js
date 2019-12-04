import {Koc} from '@avickers/knockdown'
import Sidebar from './components/side-bar'
import MapBase from './components/map-base'

class App extends Koc {
  constructor() {
    const self = super()
    const ko = this.ko()
    this.html`
    <div class="container">
      <side-bar></side-bar>
      <map-base></map-base>
    </div>
    <canvas></canvas>
    `
  }

  connectedCallback() {
    this.css`
    .container {
      position: relative;
      height: 100vh;
    }
    side-bar {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      height: 100vh;
      width: 360px;
      background-color: #0005;
      z-index: 1001;
      backdrop-filter: invert(.7);
      pointer-events: none;
    }
    canvas{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      z-index: 2000;
      pointer-events: none;
    }
    `
    //this.fluid()
  }


}
customElements.define("ko-app", App)
