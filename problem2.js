const axios = require("axios");

// Dummy array with urls
let arr = [
  "https://reqres.in/api/users/1",
  "https://reqres.in/api/users/2",
  "not a url",
];

// Making a populate method in Array to populate array elements having urls with responses
Array.prototype.populate = async function () {
  for (let i = 0; i < this.length; i++) {
    try {
      let res = await axios.get(this[i]);
      if (res.status == 200) {
        this[i] = res.data;
      } else {
        this[i] = "invalid url response";
      }
    } catch (error) {
      this[i] = "invalid url";
    }
  }
  return this;
};

// Testing
arr
  .populate()
  .then((res) => {
    console.log(arr);
  })
  .catch((err) => {
    console.log(err);
  });
