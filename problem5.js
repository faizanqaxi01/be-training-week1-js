const axios = require("axios");

// Populating results with Callbacks Sequentially
const populateCallbackSeq = (urls, callback) => {
  return new Promise((resolve) => {
    if (urls.length >= 1) {
      axios.get(urls[0]).then((res) => {
        results.push(res.data);
        return resolve(callback(urls.slice(1), callback));
      });
    } else {
      return resolve(Promise.resolve(results));
    }
  });
};

// Populating results with Promises Sequentially
const populatePromiseSeq = (urls) => {
  const result = urls.reduce((prevProm, url) => {
    return prevProm.then((acc) => axios.get(url).then((res) => [...acc, res]));
  }, Promise.resolve([]));

  return result
    .then((reps) => {
      results = reps.map((res) => res.data);
      return Promise.resolve(results);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// Populating results with Promises in Parallel
const populatePromisePar = (urls) => {
  const promises = urls.map(async (url) => axios.get(url));
  return Promise.all(promises)
    .then((responses) => {
      results = responses.map((res) => res.data);
      return results;
    })
    .catch((err) => {
      console.log("err: " + err);
      throw err;
    });
};

// Populating results with Async await Sequentially
const populateAsyncSeq = async (urls) => {
  for (const url of urls) {
    try {
      let res = await axios.get(url);
      results.push(res.data);
    } catch (error) {
      results.push("invalid url");
    }
  }
  return results;
};

// Populating results with Async await in Parallel
const populateAsyncPar = async (urls) => {
  try {
    const responses = urls.map(async (url) => axios.get(url));
    results.push(...(await Promise.all(responses)));
  } catch (err) {
    console.error(err);
  }
  return results;
};
// // TESTING

// TESTING
// To return resultant array
let results = [];

async function test() {
  try {
    // Array with urls
    let urls = [
      "https://reqres.in/api/users/1",
      "https://reqres.in/api/users/2",
      "https://reqres.in/api/users/3",
    ];

    // To calculate execution time
    let startTime;
    let endTime;
    let totalTime;

    // TEST - Serial Callbacks
    startTime = new Date().getTime();
    results = [];
    results = await populateCallbackSeq(urls, populateCallbackSeq);
    endTime = new Date().getTime();
    totalTime = endTime - startTime;
    // console.log("Updated results: ");
    // console.log(results);
    console.log("\n Time taken to execute with Serial Callbacks: ");
    console.log(totalTime + " ms");

    // TEST - Serial Promises
    startTime = new Date().getTime();
    results = [];
    results = await populatePromiseSeq(urls);
    endTime = new Date().getTime();
    totalTime = endTime - startTime;
    // console.log("Updated results: ");
    // console.log(results);
    console.log("\n Time taken to execute with Serial Promises: ");
    console.log(totalTime + " ms");

    // TEST - Parallel Promises
    startTime = new Date().getTime();
    results = [];
    results = await populatePromisePar(urls);
    endTime = new Date().getTime();
    totalTime = endTime - startTime;
    // console.log("Updated results: ");
    // console.log(results);
    console.log("\n Time taken to execute with Parallel Promises: ");
    console.log(totalTime + " ms");

    // TEST - Serial Async await
    startTime = new Date().getTime();
    results = [];
    results = await populateAsyncSeq(urls);
    endTime = new Date().getTime();
    totalTime = endTime - startTime;
    // console.log("Updated results: ");
    // console.log(results);
    console.log("\n Time taken to execute with Serial Async await: ");
    console.log(totalTime + " ms");

    // TEST - Parallel Async await
    startTime = new Date().getTime();
    results = [];
    results = await populateAsyncPar(urls);
    endTime = new Date().getTime();
    totalTime = endTime - startTime;
    // console.log("Updated results: ");
    // results = results.map((res) => res.data);
    // console.log(results);
    console.log("\n Time taken to execute with Parallel  Async await: ");
    console.log(totalTime + " ms");
  } catch (error) {
    console.log("Something went wrong");
  }
}

test();
