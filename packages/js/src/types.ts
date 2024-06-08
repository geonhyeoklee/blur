type Red<T extends number = number> = T;
type Green<T extends number = number> = T;
type Blue<T extends number = number> = T;
type Alpha<T extends number = number> = T;

type Pixel = [Red, Green, Blue, Alpha];

export { Pixel };
