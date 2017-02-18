
let randomIntegerOfLength = function (length) {
  return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
};

export function randomId(): number {
  return randomIntegerOfLength(4);
}

export function randomSsid(): number {
  return randomIntegerOfLength(5);
}
