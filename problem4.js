const axios = require("axios");

// Function Decorator to memoize a function
const memoize = (func) => {
  const cache = {};

  return async (...args) => {
    const argsKey = JSON.stringify(args);
    if (!cache[argsKey]) {
      cache[argsKey] = await func(...args);
      console.log(cache[argsKey]);
      return cache[argsKey];
    }
    console.log("Reusing the url from the cache");
    console.log(cache[argsKey]);
    return cache[argsKey];
  };
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
  await memoizedFetch("https://reqres.in/api/users/1"); // Fetches from url
  await memoizedFetch("https://reqres.in/api/users/1"); // Uses cache
  await memoizedFetch("https://reqres.in/api/users/2"); // Fetches from url
  await memoizedFetch("https://reqres.in/api/users/2"); // Uses cache
  await memoizedFetch("https://reqres.in/api/users/1"); // Uses cache
}

// Testing the fetch calls
fetchCalls();
