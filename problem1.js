// Function to sum any number of arguments
function sum(...args) {
  return args.reduce((total, num) => total + num, 0);
}

// Testing
console.log(sum(8)); // 8
console.log(sum(3, 65)); // 68
console.log(sum(4, 9, 3)); // 16
console.log(sum(98, 23, 45, 4)); // 170
