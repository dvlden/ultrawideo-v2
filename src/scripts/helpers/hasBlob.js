const hasBlob = element => (
  (element.src || /* istanbul ignore next */ element.currentSrc).includes('blob:')
)

export default hasBlob
