"use strict";

function shuffleArray(array) {
  var tmp, current, top = array.length;

  if (top) while (--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }

  return array;
}

function randomNumber(options) {
  let count = options.count,
    max = options.max,
    shuffle = options.shuffle;
  let numbers = [];
  let step = max / count;
  for (let i = 0; i < count; i++) {
    numbers.push(i * step);
  }
  if (shuffle) numbers = shuffleArray(numbers)
  return numbers;
}

console.log(randomNumber({
  count: 5,
  max: 100,
  shuffle: true
}));
