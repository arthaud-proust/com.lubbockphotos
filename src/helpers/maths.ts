export const isDivisibleBy = (n: number, by: number) => n % by === 0

export const nextDivisor = (n: number, divideBy: number) => {
  if (n !== Math.round(n)) throw new Error('n must be interger')
  if (divideBy !== Math.round(divideBy)) throw new Error('divideBy must be interger')
  if (divideBy > n) {
    throw new Error('divideBy must be lower or equal than n')
  }

  let divisor = divideBy

  while (!isDivisibleBy(n, divisor)) {
    divisor++
  }

  return divisor
}
