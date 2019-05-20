export const currency = (value: number | string, digit: number = 2) => {
  let before: number
  before = typeof value === 'string' ? Number(value) : value
  return before.toFixed(digit)
}
