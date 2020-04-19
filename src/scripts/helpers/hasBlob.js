const hasBlob = element => (
  (element.src || element.currentSrc).includes('blob:')
)

export default hasBlob
