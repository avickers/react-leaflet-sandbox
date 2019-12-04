import {Buffer,Koc} from '@avickers/knockdown'
import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'

const darkSilver = '#d4af37'

const meltedCopper = '#ce8544'
const copperShadow = '0px 1px 0px #a96e3a, 0px 2px 0px #85572f, 0px 3px 0px #634225, 0px 4px 0px #432d1c, 0px 6px 7px #001135'
const copperShadowSmall = '0px 1px 0px #a96e3a, 0px 2px 0px #85572f, 0px 3px 0px #634225, 0px 3px 3px #001135'
const metallicGold = '#d4af37'
const goldShadow = '0px 1px 0px #ae8f30, 0px 2px 0px #897129, 0px 3px 0px #655421, 0px 4px 0px #44391a, 0px 6px 7px #001135'
const goldShadowSmall = '0px 1px 0px #ae8f30, 0px 2px 0px #897129, 0px 3px 0px #655421, 0px 3px 3px #001135'
const metallicSilver = '#c4cace'
const silverShadow = '0px 1px 0px #a0a5a8, 0px 2px 0px #7e8284, 0px 3px 0px #5d6062, 0px 4px 0px #3e4041, 0px 6px 7px #001135'
const silverShadowSmall = '0px 1px 0px #a0a5a8, 0px 2px 0px #7e8284, 0px 3px 0px #5d6062, 0px 3px 3px #001135'
const verdigris = '#43b3ae'
const verdiShadow = '0px 1px 0px #3b938f, 0px 2px 0px #327470, 0px 3px 0px #295654, 0px 4px 0px #1f3a38, 0px 6px 7px #001135'
const verdiShadowSmall = '0px 1px 0px #3b938f, 0px 2px 0px #327470, 0px 3px 0px #295654, 0px 3px 3px #001135'

export default class Sidebar extends Koc {
  constructor() {
    super()
    const ko = this.ko()

    this.vm = {
      target: Buffer.set('panel',null)
      .watch(nv => {
        if(nv) {
          console.log(nv)
          this.vm.tier.set(nv.tier)
          this.vm.black.set(Number.parseFloat(nv.properties['ACSPercents.pct_BlackAloneOrCombo']*100).toPrecision(4))
          this.vm.hispanic.set(Number.parseFloat(nv.properties['ACSPercents.pct_Hispanic']*100).toPrecision(4))
          this.vm.id.set(nv.properties['TCCoATracts.NAMELSAD']||'')
          this.shadowRoot.querySelector('.card').classList.add('active')
          this.render()
        } else {
          this.vm.id.set('')
        }
      }),
      id: ko.observable(''),
      tier: ko.observable(0),
      black: ko.observable(0),
      hispanic: ko.observable(0)
    }

    this.html`
    <div class="container">
      <div class="card">
        <!-- <img src="https://wallazee.global.ssl.fastly.net/images/dynamic/items/383-1024.png" alt="Eiffel Tower"> -->
        <h1 class="engraved" data-bind="text: id"></h1>
        <div class="content">
          <div class="black">
            <div class="subheader">Black</div>
            <span class="textShadow">${this.vm.black}%</span>
          </div>
          <div class="hispanic">
            <div class="subheader">Hispanic</div>
            <span class="textShadow">${this.vm.hispanic}%</span>
          </div>
        </div>
      </div>
    </div>
    `
    ko.applyBindings(this.vm)
  }

  connectedCallback() {
    this.render()
  }

  //linear-gradient(rgb(93,94,170),rgb(93,66,103))
  render() {
    const tier = this.vm.tier.get()
    this.css`
    .container {
      -webkit-transform: perspective(900px);
      -webkit-transform-style: preserve-3d;
    }
    .card {
      text-align:center;
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 5px;
      padding-top: 0;
      height: 360px;
      background: linear-gradient(#E5E4E2,#FAF9F6);
      animation: animate 1s linear infinite;
      transition:.6s;
      transform: rotatex(75deg) translatey(-200px) translatez(-100px);
      box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.5);
      pointer-events: true;
      opacity: 0.9;
    }
    .card:hover{
      transform: rotatex(0deg);
      transition:.6s;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
    }
    .card img{
      transform: translateY(15px);
      width:180px;
      height:150px;
    }
    .card {
      color: #474c4d;
      font-family: Verdana;
    }
    .card.active {
      transform: rotatex(0deg);
      transition:.6s;
      transition-delay: 500ms;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
    }
    .engraved {
      text-align: center;
      font-size: 48px;
      font-family: "Montserrat Alternates";
      color: ${ tier === 0
      ? verdigris
      : tier === 1
      ? meltedCopper
      : tier === 2
      ? metallicSilver
      : metallicGold};
      text-shadow: ${ tier === 0
      ? verdiShadow
      : tier === 1
      ? copperShadow
      : tier === 2
      ? silverShadow
      : goldShadow};
    }
    .subheader {
      font-size: 24px;
    }
    .content {
      display: grid;
      grid-template-columns: 1hr 1fr;
      grid-template-areas:
            "asian black"
            "hispanic poverty"
            "b c";
      grid-template-rows: 1fr 1fr;
    }
    .black {
      grid-area: black
    }
    .hispanic {
      grid-area: hispanic
    }
    .textShadow {
      font-size: 26px;
      color: ${ tier === 0
      ? verdigris
      : tier === 1
      ? meltedCopper
      : tier === 2
      ? metallicSilver
      : metallicGold};
      text-shadow: ${ tier === 0
      ? 'none;'
      : tier === 1
      ? copperShadowSmall
      : tier === 2
      ? silverShadowSmall
      : goldShadowSmall};
    }
    `


  }
}
customElements.define("side-bar", Sidebar)
