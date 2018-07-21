import { unprefixed, prefixed } from '../../store/fullscreenApi'

let api = unprefixed

Object.keys(prefixed).forEach(prefix => {
  if (prefixed[prefix].state in document) {
    api = prefixed[prefix]
  }
})

export default api
