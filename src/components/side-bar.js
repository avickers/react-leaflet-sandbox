import {Buffer,Koc} from '@avickers/knockdown'
import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'
import Tract from './card-tract'

const darkSilver = '#d4af37'

export default class Sidebar extends Koc {
  constructor() {
    super()
    const ko = this.ko()

    // TODO for comparison deck
    // this.collection = new Map()
    // this.collection.has(cfg.id)
    // ? null
    // : this.collection.set(cfg.id, new Tract(cfg))
    this.vm = {
      target: Buffer.set('panel',null)
      .watch(nv => {
        if(nv) {
          const props = nv.properties
          const cfg = {
            id: props['TCCoATracts.NAMELSAD'],
            tier: nv.tier,
            asian: Number.parseFloat(props['ACSPercents.pct_AsianAloneOrCombo']*100).toPrecision(3),
            black: Number.parseFloat(props['ACSPercents.pct_BlackAloneOrCombo']*100).toPrecision(3),
            hispanic: Number.parseFloat(props['ACSPercents.pct_Hispanic']*100).toPrecision(3),
            poverty: Number.parseFloat(props['ACSPercents.pct_Poverty_Less100']*100).toPrecision(3)
          }
          //this.shadowRoot.querySelector('.card').classList.add('active')
          this.render(new Tract(cfg))
        } else {
          this.vm.id.set('')
        }
      })
    }
    ko.applyBindings(this.vm)
  }

  connectedCallback() {
    this.css`

    `
    this.render()
  }

  //linear-gradient(rgb(93,94,170),rgb(93,66,103))
  render(html) {
    this.html`${html}`
    let card = this.shadowRoot.querySelector('card-tract')
    if(card) {
      card.shadowRoot.querySelector('.card').classList.add('active')
    }
    // for(let tract of this.collection) {
    //   console.log(tract[1])
    //   this.html`
    //   ${tract[1]}
    //   `
    // }
  }
}
customElements.define("side-bar", Sidebar)
