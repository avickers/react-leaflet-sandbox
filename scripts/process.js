/*
** This is a node.js script to process the geoJson, calculate the pertinent statistics, and upload the results into a mongoDB instance
*/
const stats = require('stats-lite')
const tracts = require('../assets/tracts.json')
const features = tracts.features

const asian = [], black = [], hispanic = [], poverty = [], under5 = [], mrr = []

for(let feature of features) {
  const props = feature.properties
  asian.push(props['ACSPercents.pct_AsianAloneOrCombo'])
  black.push(props['ACSPercents.pct_BlackAloneOrCombo'])
  hispanic.push(props['ACSPercents.pct_Hispanic'])
  poverty.push(props['ACSPercents.pct_Poverty_Less100'])
  under5.push(props['ACSPercents.pct_TotUnder5'])
  mrr.push(100-props['ACSPercents.MRR2010'])
}
console.log("Asian")
console.log("70th percentile: %s", stats.percentile(asian, 0.70))
console.log("80th percentile: %s", stats.percentile(asian, 0.80))
console.log("90th percentile: %s", stats.percentile(asian, 0.90))
console.log("\nBlack")
console.log("70th percentile: %s", stats.percentile(black, 0.70))
console.log("80th percentile: %s", stats.percentile(black, 0.80))
console.log("90th percentile: %s", stats.percentile(black, 0.90))
console.log("\nHispanic")
console.log("70th percentile: %s", stats.percentile(hispanic, 0.70))
console.log("80th percentile: %s", stats.percentile(hispanic, 0.80))
console.log("90th percentile: %s", stats.percentile(hispanic, 0.90))
console.log("\nPoverty")
console.log("70th percentile: %s", stats.percentile(poverty, 0.70))
console.log("80th percentile: %s", stats.percentile(poverty, 0.80))
console.log("90th percentile: %s", stats.percentile(poverty, 0.90))
console.log("\nMRR2010")
console.log("70th percentile: %s", stats.percentile(mrr, 0.70))
console.log("80th percentile: %s", stats.percentile(mrr, 0.80))
console.log("90th percentile: %s", stats.percentile(mrr, 0.90))
