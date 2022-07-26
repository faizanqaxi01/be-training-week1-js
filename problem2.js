const axios = require("axios");

// Dummy array with urls
let arr = ["https://reqres.in/api/users/1", "https://reqres.in/api/users/2"];

// Making a populate method in Array to populate array elements having urls with responses
Array.prototype.populate = async function () {
  try {
    let responses = this.map(async (item) => axios.get(item));
    responses = await Promise.all(responses);
    this.forEach((url, index) => (this[index] = responses[index].data));
  } catch (error) {
    console.log("Something went wrong");
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
    console.log("Some Error occurred!!");
  });
