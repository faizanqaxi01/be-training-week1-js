// Function to sum all the called arguments
let sum = (num) => {
  let total = num;

  return (addNum = (val) => {
    if (val != undefined) {
      total += val;
      return addNum;
    }
    return total;
  });
};

// Testing
console.dir(sum(1)()); // 1
console.dir(sum(1)(2)()); // 3
console.dir(sum(1)(2)(3)()); // 6
console.dir(sum(1)(2)(3)(4)()); // 10
console.dir(sum(1)(2)(3)(4)(5)()); // 15
console.dir(sum(1)(2)(3)(4)(5)(6)()); // 21
