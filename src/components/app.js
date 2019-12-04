import {Koc} from '@avickers/knockdown'
import MapBase from './map-base'

export default class App extends Koc {
  constructor() {
    super()
    const ko = this.ko()
    this.html`<map-base></map-base>`
  }
}
customElements.define("ko-app", App)
