let sum = (num) => {
  let total = num;

  let addNum = (val) => {
    if (val != undefined) {
      total += val;
      return addNum;
    } else {
      return total;
    }
  };

  return addNum;
};

console.dir(sum(1)());
console.dir(sum(1)(2)());
console.dir(sum(1)(2)(3)());
console.dir(sum(1)(2)(3)(4)());
console.dir(sum(1)(2)(3)(4)(5)());
console.dir(sum(1)(2)(3)(4)(5)(6)());
