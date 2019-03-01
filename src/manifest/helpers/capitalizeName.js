module.exports = (name) => {
  return name.split('').map(char => (
    (char === 'u' || char === 'w')
      ? char.toUpperCase()
      : char
  )).join('')
}
