const axios = require("axios");
const localStorage = require("localStorage");

// Function Decorator to memoize a function in runtime
const memoize = (func) => {
  // Runtime cache
  const cache = {};

  return async (...args) => {
    const argsKey = JSON.stringify(args);
    if (!cache[argsKey]) {
      cache[argsKey] = await func(...args);
      console.log(cache[argsKey]);
      return cache[argsKey];
    }
    console.log("Reusing the url from the runtime cache");
    console.log(cache[argsKey]);
    return cache[argsKey];
  };
};

// Memoized fetch function using local cache
const memoizedFetchLocal = (url) => {
  return new Promise((resolve, reject) => {
    //checking if the url response is present in local storage
    const res = localStorage.getItem(url);
    if (res) {
      console.log("Reusing response from local storage: ");
      console.log(res);
      return res;
    }
    // If there is no response locally
    axios
      .get(url)
      .then((response) => {
        console.log("Fetching the url: ");
        console.log(response.data);
        // Storing response locally
        localStorage.setItem(url, response.data);
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Something went wrong ");
        reject(err);
      });
  });
};

// Function to fetch a url response
async function normalFetch(url) {
  console.log("Fetching the url: " + url);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log("Something wnt wrong: " + err);
    return err;
  }
}

// Memoized Fetch function
const memoizedFetch = memoize(normalFetch);

//Testing
// A test function to test multiple calls to memoizedFetch
async function fetchCalls() {
  // Runtime cache test
  await memoizedFetch("https://reqres.in/api/users/1"); // Fetches from url
  await memoizedFetch("https://reqres.in/api/users/1"); // Uses cache

  // Local cache test
  await memoizedFetchLocal("https://reqres.in/api/users/2"); // Fetches from url
  await memoizedFetchLocal("https://reqres.in/api/users/2"); // Uses cache
}

// Testing the fetch calls
fetchCalls();
