const axios = require("axios");

// Array with urls
let urls = [
  "https://reqres.in/api/users/1",
  "https://reqres.in/api/users/2",
  "https://reqres.in/api/users/3",
];

let results = [];

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
// // TESTING
// populateCallbackSeq(urls, populateCallbackSeq).then((res) => {
//   console.log(results);
// });

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
// // TESTING
// populatePromiseSeq(urls)
//   .then((res) => {
//     console.log("results: ");
//     console.log(results);
//   })
//   .catch((err) => {
//     console.log("err: " + err);
//   });

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
// // TESTING
// populatePromisePar(urls)
//   .then((res) => console.log(res))
//   .catch((err) => console.log("Error: " + err));

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
// // TESTING
// populateAsyncSeq(urls).then((res) => {
//   console.log("Populating results with Async await Sequentially: ");
//   console.log(results);
// });

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
// populateAsyncPar(urls).then((res) => {
//   results = results.map((res) => res.data);
//   console.log(results);
// });
