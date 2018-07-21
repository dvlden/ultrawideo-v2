export default {
  isChrome () {
    return typeof chrome !== 'undefined' && 'storage' in chrome
  },


  resolve () {
    return this.isChrome() ? chrome : browser
  }
}
