import {Koc} from '@avickers/knockdown'

const meltedCopper = '#ce8544'
const copperShadow = '0px 1px 0px #a96e3a, 0px 2px 0px #85572f, 0px 3px 0px #634225, 0px 4px 0px #432d1c, 0px 6px 7px #001135'
const copperShadowSmall = '0px 1px 0px #a96e3a, 0px 2px 0px #85572f, 0px 3px 0px #634225, 0px 3px 3px #001135'
const metallicGold = '#d4af37'
const goldShadow = '0px 1px 0px #ae8f30, 0px 2px 0px #897129, 0px 4px 0px #655421, 0px 6px 7px #001135'
const goldShadowSmall = '0px 1px 0px #ae8f30, 0px 2px 0px #897129, 0px 3px 0px #655421, 0px 3px 3px #001135'
const metallicSilver = '#c4cace'
const silverShadow = '0px 1px 0px #a0a5a8, 0px 2px 0px #7e8284, 0px 4px 0px #5d6062, 0px 6px 7px #001135'
const silverShadowSmall = '0px 1px 0px #a0a5a8, 0px 2px 0px #7e8284, 0px 3px 0px #5d6062, 0px 3px 3px #001135'
const verdigris = '#43b3ae'
const verdiShadow = '0px 1px 0px #3b938f, 0px 2px 0px #327470, 0px 3px 0px #295654, 0px 4px 0px #1f3a38, 0px 6px 7px #001135'
const verdiShadowSmall = '0px 1px 0px #3b938f, 0px 2px 0px #327470, 0px 3px 0px #295654, 0px 3px 3px #001135'

export default class Tract extends Koc {
  constructor(obj) {
    super()
    const {id,tier,mrr,asian,black,hispanic,poverty,under5} = obj
    this.key = id

    const ko = this.ko()

    this.vm = {
      id: ko.observable(id),
      tier: ko.observable(tier),
      mrr: ko.observable(mrr),
      asian: ko.observable(asian||0),
      black: ko.observable(black||0),
      hispanic: ko.observable(hispanic||0),
      poverty: ko.observable(poverty||0),
      under5: ko.observable(under5||0)
    }

    this.deciles = {
      asian: {
        decile_7: 8.42,
        decile_8: 10.84,
        decile_9: 14.32
      },
      black: {
        decile_7: 10.36,
        decile_8: 14.66,
        decile_9: 20.60
      },
      hispanic: {
        decile_7: 44.37,
        decile_8: 52.51,
        decile_9: 65.55
      },
      poverty: {
        decile_7: 18.34,
        decile_8: 22.85,
        decile_9: 34.94
      },
      mrr: {
        decile_7: 27.63,
        decile_8: 31.57,
        decile_9: 39.39
      }
    }

    this.html`
    <div class="contain">
      <div class="card">
        <h1 class="engraved" data-bind="text: id"></h1>
        <div class="content">
          <div class="asian">
            <div class="subheader">Asian</div>
            <span class="textShadow">${this.vm.asian}%</span>
          </div>
          <div class="black">
            <div class="subheader">Black</div>
            <span class="textShadow">${this.vm.black}%</span>
          </div>
          <div class="hispanic">
            <div class="subheader">Hispanic</div>
            <span class="textShadow">${this.vm.hispanic}%</span>
          </div>
          <div class="poverty">
            <div class="subheader">Poverty</div>
            <span class="textShadow">${this.vm.poverty}%</span>
          </div>
          <div class="mrr">
            <div class="subheader">Unresponsive (2010)</div>
            <span class="textShadow">${this.vm.mrr}%</span>
          </div>
        </div>
      </div>
    </div>
    `
    ko.applyBindings(this.vm)
  }

  connectedCallback() {
    const tier = this.vm.tier.get(),
    asian = this.vm.asian.get(),
    black = this.vm.black.get(),
    hispanic = this.vm.hispanic.get(),
    poverty = this.vm.poverty.get()
    this.css`
    .contain {
      -webkit-transform: perspective(900px);
      -webkit-transform-style: preserve-3d;
    }
    .card {
      text-align:center;
      margin-top: 0px;
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
    .card h1{
      margin-top: 0;
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
    @media (max-width: 760px) {
      .card h1 {
        font-size: 36px;
        margin-bottom: 5px;
      }
    }
    .content {
      display: grid;
      grid-template-columns: 1hr 1fr;
      grid-template-areas:
            "asian black"
            "hispanic poverty"
            "mrr mrr";
      grid-template-rows: 1fr 1fr;
      grid-gap: 10px 20px;
    }
    .asian {
      grid-area: asian
    }
    .asian .textShadow {
      font-size: 26px;
      color: ${ asian < this.deciles.asian.decile_7
      ? verdigris
      : asian < this.deciles.asian.decile_8
      ? meltedCopper
      : asian < this.deciles.asian.decile_9
      ? metallicSilver
      : metallicGold};
      text-shadow: ${ asian < this.deciles.asian.decile_7
      ? 'none'
      : asian < this.deciles.asian.decile_8
      ? copperShadowSmall
      : asian < this.deciles.asian.decile_9
      ? silverShadowSmall
      : goldShadowSmall};
    }
    .black {
      grid-area: black
    }
    .black .textShadow {
      font-size: 26px;
      color: ${ black < this.deciles.black.decile_7
      ? verdigris
      : black < this.deciles.black.decile_8
      ? meltedCopper
      : black < this.deciles.black.decile_9
      ? metallicSilver
      : metallicGold};
      text-shadow: ${ black < this.deciles.black.decile_7
      ? 'none'
      : black < this.deciles.black.decile_8
      ? copperShadowSmall
      : black < this.deciles.black.decile_9
      ? silverShadowSmall
      : goldShadowSmall};
    }
    .hispanic {
      grid-area: hispanic
    }
    .hispanic .textShadow {
      font-size: 26px;
      color: ${ hispanic < this.deciles.hispanic.decile_7
      ? verdigris
      : hispanic < this.deciles.hispanic.decile_8
      ? meltedCopper
      : hispanic < this.deciles.hispanic.decile_9
      ? metallicSilver
      : metallicGold};
      text-shadow: ${ hispanic < this.deciles.hispanic.decile_7
      ? 'none'
      : hispanic < this.deciles.hispanic.decile_8
      ? copperShadowSmall
      : hispanic < this.deciles.hispanic.decile_9
      ? silverShadowSmall
      : goldShadowSmall};
    }
    .poverty {
      grid-area: poverty
    }
    .poverty .textShadow {
      font-size: 26px;
      color: ${ poverty < this.deciles.poverty.decile_7
      ? verdigris
      : poverty < this.deciles.poverty.decile_8
      ? meltedCopper
      : poverty < this.deciles.poverty.decile_9
      ? metallicSilver
      : metallicGold};
      text-shadow: ${ poverty < this.deciles.poverty.decile_7
      ? 'none'
      : poverty < this.deciles.poverty.decile_8
      ? copperShadowSmall
      : poverty < this.deciles.poverty.decile_9
      ? silverShadowSmall
      : goldShadowSmall};
    }
    .mrr {
      grid-area: mrr
    }
    .mrr .textShadow {
      font-size: 26px;
      color: ${ tier === 0
      ? verdigris
      : tier === 1
      ? meltedCopper
      : tier === 2
      ? metallicSilver
      : metallicGold};
      text-shadow: ${ tier === 0
      ? 'none'
      : tier === 1
      ? copperShadowSmall
      : tier === 2
      ? silverShadowSmall
      : goldShadowSmall};
    }
    `
  }
}
customElements.define("card-tract", Tract)
