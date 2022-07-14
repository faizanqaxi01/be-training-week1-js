const EventEmitter = require("events");

// Event emitters for the systems
const temperature = new EventEmitter();
const airPressure = new EventEmitter();
const humidity = new EventEmitter();

// Event emitter for the observer - To observe the systems
const observer = new EventEmitter();

// Event emitter for the display - To respond to observer when all values are changed
// It also responds to a time out when a value has not been changed for 1000ms
const display = new EventEmitter();

// Event emitter for the dashboard - responds whenever we have to update dashboard display
const dashboard = new EventEmitter();

// Latest System Values
let latestSystemValues = {
  temperature: randomInteger(1, 10), // Random integer between 1 to 10
  airPressure: randomInteger(1, 10),
  humidity: randomInteger(1, 10),
  lastUpdated: new Date().getTime(),
};

// Display object - values that are displayed on dashboard at the moment
let displayObject = {
  temperature: randomInteger(1, 100), // Random integer between 1 to 10
  airPressure: randomInteger(1, 100),
  humidity: randomInteger(1, 100),
  lastUpdated: new Date().getTime(),
};

// Maintaining which system values have been updated in every cycle
let systemChange = {
  temperature: false,
  airPressure: false,
  humidity: false,
};

// Event emitters on sensors
// When temperature data received
temperature.on("data", (data) => {
  observer.emit("update", { temperature: data });
});

// When air pressure data received
airPressure.on("data", (data) => {
  observer.emit("update", { airPressure: data });
});

// When humidity data received
humidity.on("data", (data) => {
  observer.emit("update", { humidity: data });
});

// Observer when it receives an update - from one of the systems
observer.on("update", (data) => {
  // Updating the latest system values
  latestSystemValues = updateSystemValue(data, latestSystemValues);

  // If all values have been updated
  if (allValuesUpdated()) {
    display.emit("update", latestSystemValues);
  }
});

// When display receives an update - i.e when all values have been updated
display.on("update", (data) => {
  // Getting time since the dashboard was previously updated
  let time = new Date().getTime();
  let updateTime = time - displayObject.lastUpdated;

  // Checking whether last dashboard update was less than 100ms ago
  if (updateTime >= 100) {
    resetSystemChange();
    setDisplayTimeOut();
    dashboard.emit("new_display", data);
  }
  // Else if dashboard update was less than 100ms ago, regenerate the request after 100ms complete
  else if (updateTime > 0 && updateTime < 100) {
    let remainingTime = 100 - updateTime;
    setTimeout(display.emit("update", data), 100 - remainingTime);
  }
});

// When display receives a timeout - i.e. 1000ms have passed
display.on("timeout", () => {
  // Getting time since the dashboard was previously updated
  let time = new Date().getTime();
  let updateTime = time - displayObject.lastUpdated;

  //   Checking if the dashboard was updated in the last 1000ms
  // If the dashboard was updated in the last 1000ms, then all values must have changed
  // If last update was longer than 1000ms
  if (updateTime >= 1000) {
    // Latest data
    let data = { ...latestSystemValues };

    // Setting the unchanged values to N/A
    data = nullifyUnchanged(data);
    resetSystemChange();

    // Display to Dashboard
    dashboard.emit("new_display", data);
  }
});

// When dashboard receives a new display
dashboard.on("new_display", (data) => {
  // Update the display object and print out the new display
  displayObject.temperature = data.temperature;
  displayObject.airPressure = data.airPressure;
  displayObject.humidity = data.humidity;
  displayObject.lastUpdated = new Date().getTime();
  printDisplay(displayObject);
});

// Functions Used
// Function to return a random integer between two values
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to reset the systemChange object after every cycle
function resetSystemChange() {
  let keys = Object.keys(systemChange);
  keys.forEach((key) => {
    systemChange[key] = false;
  });
}

// Function to check if all values have been updated
function allValuesUpdated() {
  let flag = true;
  let keys = Object.keys(systemChange);
  keys.forEach((key) => {
    if (!systemChange[key]) {
      flag = false;
    }
  });

  return flag;
}

// Function that checks which values are unchanged and sets them to N/A in the object passed
function nullifyUnchanged(data) {
  let keys = Object.keys(systemChange);
  keys.forEach((key) => {
    if (!systemChange[key]) {
      data[key] = "N/A";
    }
  });

  return data;
}

// Function to update latest system values -- (Based on key value pair object it receives)
function updateSystemValue(newValObj) {
  let key = Object.keys(newValObj)[0];
  let newValue = newValObj[key];

  // Updating the value
  latestSystemValues[key] = newValue;
  latestSystemValues.lastUpdated = new Date().getTime();

  // Updating the systemChange object - that keeps track of values changed in every cycle
  systemChange[key] = true;

  return latestSystemValues;
}

// Function that triggers display.on("timeout") after 1000ms to check if some value is still not updated
const setDisplayTimeOut = () => {
  // Emit a time out after 1000ms
  setTimeout(() => {
    display.emit("timeout");
  }, 1000);
};

// Function to print out the display
function printDisplay(displayObject) {
  console.log("---------- DASHBOARD---------- ");
  console.log(`Temperature: ${displayObject.temperature}`);
  console.log(`Humidity: ${displayObject.humidity}`);
  console.log(`Air Pressure: ${displayObject.airPressure}`);
  console.log(`Last Update: ${new Date()}`);
  console.log("_______________________________ \n");
}

// Simulation Functions
// Function to simulate a temperature sensor
// It randomly keeps emitting temperature data every 100 - 2000 ms
const simulateTempSensor = () => {
  let randTime = randomInteger(100, 2000);
  let randData = randomInteger(1, 100);
  setTimeout(() => {
    temperature.emit("data", randData);
    simulateTempSensor();
  }, randTime);
};

// Function to simulate a Air Pressure sensor
// It randomly keeps emitting air pressure data every 100 - 2000 ms
const simulateAirPressureSensor = () => {
  let randTime = randomInteger(100, 2000);
  let randData = randomInteger(1, 100);

  setTimeout(() => {
    airPressure.emit("data", randData);
    simulateAirPressureSensor();
  }, randTime);
};

// Function to simulate a Humidity sensor
// It randomly keeps emitting humidity data every 100 - 2000 ms
const simulateHumiditySensor = () => {
  let randTime = randomInteger(100, 2000);
  let randData = randomInteger(1, 100);

  setTimeout(() => {
    humidity.emit("data", randData);
    simulateHumiditySensor();
  }, randTime);
};

// TESTING

console.log(
  "\n\n\n********************  WELCOME TO DASHBOARD ********************\n\n\n"
);
// Simulating the systems
simulateTempSensor();
simulateAirPressureSensor();
simulateHumiditySensor();
