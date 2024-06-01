enum RGBA {
  Red = 0,
  Green = 1,
  Blue = 2,
  Alpha = 3,
}

type Red<T extends number = number> = T;
type Green<T extends number = number> = T;
type Blue<T extends number = number> = T;
type Alpha<T extends number = number> = T;

type Pixel = [Red, Green, Blue, Alpha];

export { Pixel, RGBA };
