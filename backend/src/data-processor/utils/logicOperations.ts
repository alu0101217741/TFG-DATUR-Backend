export function notEqualAndOperator(value: string, valuesToCompare: string[]): boolean {
  for (const valueToCompare of valuesToCompare) {
    if (value === valueToCompare) return false
  }
  return true
}

export function equalOrOperator(value: string, valuesToCompare: string[]): boolean {
  for (const valueToCompare of valuesToCompare) {
    if (value === valueToCompare) return true
  }
  return false
}
