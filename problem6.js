const EventEmitter = require("events");

// Event emitters for the systems
const temperature = new EventEmitter();
const airPressure = new EventEmitter();
const humidity = new EventEmitter();

// Event emitter for the observer - To observe the systems
const observer = new EventEmitter();

// Current Display Values on Dashboard
let currDisplayValues = {
  temperature: Math.random(),
  airPressure: Math.random(),
  humidity: Math.random(),
};

// Previous Display Values on Dashboard
let prevDisplayValues = {
  temperature: Math.random(),
  airPressure: Math.random(),
  humidity: Math.random(),
};

// Observer
observer.on("observe", () => {
  setInterval(() => {
    temperature.emit("data");
    humidity.emit("data");
    airPressure.emit("data");

    // If one of the systems sends a new value
    if (
      currDisplayValues.temperature !== prevDisplayValues.temperature ||
      currDisplayValues.humidity !== prevDisplayValues.humidity ||
      currDisplayValues.airPressure !== prevDisplayValues.airPressure
    ) {
      observer.emit("display object");
    }
    // Updating previous values
    prevDisplayValues.airPressure = currDisplayValues.airPressure;
    prevDisplayValues.temperature = currDisplayValues.temperature;
    prevDisplayValues.humidity = currDisplayValues.humidity;
  }, 100);
});

// Event emitters on sensors
// When temperature data received
temperature.on("data", () => {
  let randomVal = randomInteger(100, 2000);
  setTimeout(() => {
    if (randomVal < 1000) {
      currDisplayValues.temperature = Math.random();
    } else {
      currDisplayValues.temperature = "N/A";
    }
  }, randomVal);
});

// When air pressure data received
airPressure.on("data", () => {
  let randomVal = randomInteger(100, 2000);
  setTimeout(() => {
    if (randomVal < 1000) {
      currDisplayValues.airPressure = Math.random();
    } else {
      currDisplayValues.airPressure = "N/A";
    }
  }, randomVal);
});

// When humidity data received
humidity.on("data", () => {
  let randomVal = randomInteger(100, 2000);
  setTimeout(() => {
    if (randomVal < 1000) {
      currDisplayValues.humidity = Math.random();
    } else {
      currDisplayValues.humidity = "N/A";
    }
  }, randomVal);
});

// When display object is sent to dashboard
observer.on("display object", () => {
  console.log("\n\n ---------- DASHBOARD---------- ");
  console.log(`Temperature: ${currDisplayValues.temperature}`);
  console.log(`Humidity: ${currDisplayValues.humidity}`);
  console.log(`Air Pressure: ${currDisplayValues.airPressure}`);
});

// Running dashboard
const dashboard = () => {
  setInterval(() => {
    observer.emit("observe");
  }, 100);
};

// Function to return a random integer between a range
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//  TESTING
dashboard();
