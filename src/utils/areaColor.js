// Paleta Wonga — bezpieczna dla deuteranopii i protanopii
const COLORBLIND_MAP = {
  '#6a9e7a': '#0077bb', // szyja: zielony → niebieski
  '#7a8e9e': '#33bbee', // ramiona: szaro-niebieski → cyjan
  '#9e7a6a': '#ee7733', // plecy: brąz → pomarańczowy
  '#9e8a6a': '#ee3377', // kręgosłup: beż → magenta
  '#7a9e8a': '#009988', // nadgarstki: zieleń → teal
  '#6a7a9e': '#bbbbbb', // oczy: fioletowo-niebieski → szary
  '#7a6a9e': '#cc3311', // nogi: fiolet → cynober
}

export function areaColor(hex, colorblindMode) {
  if (!colorblindMode) return hex
  return COLORBLIND_MAP[hex] || hex
}
