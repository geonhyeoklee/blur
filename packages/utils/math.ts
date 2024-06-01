export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function removeDecimalPoint(value: number) {
  return Math.floor(value);
}
