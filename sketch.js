const serviceUuid = "19b10010-e8f2-537e-4f6c-d104768a1214";
const characteristicsUUID = {
  led:"19b10011-e8f2-537e-4f6c-d104768a1214",
  button:"19b10012-e8f2-537e-4f6c-d104768a1214"
}
let buttonCharacteristic;
let ledCharacteristic;
let myBLE;

let buttonValue = 0;

function setup() {
  createCanvas(400, 400);
    // Create a p5ble class
  myBLE = new p5ble();

  createCanvas(600, 400);
  background("#FFF");

  // Create a 'Connect and Start Notifications' button
  const connectButton = createButton('Connect and Start Notifications')
  connectButton.mousePressed(connectAndStartNotify);
  
  // Create a 'Toggle' button
  const toggleButton = createButton('Toggle');
  toggleButton.position(15, 15);
  toggleButton.mousePressed(toggleLED);
}

function draw() {
   noStroke();

  if(buttonValue>0){
    fill(color(200, 200, 200));
  }else{
    fill(color(100, 200, 200));
  }
  
  rect(15, 40, 60, 60);
}

function connectAndStartNotify() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log(characteristics[1].uuid);
  for(let i = 0; i < characteristics.length;i++){
    if(characteristics[i].uuid == characteristicsUUID.button){
      buttonCharacteristic = characteristics[i];
      myBLE.startNotifications(buttonCharacteristic, handleButton);
    }else if(characteristics[i].uuid == characteristicsUUID.led){
      ledCharacteristic = characteristics[i];
    }else{
      console.log("nothing");
    }
  }
  // Start notifications on the first characteristic by passing the characteristic
  // And a callback function to handle notifications
  
}

// A function that will be called once got characteristics
function handleButton(data) {
  console.log('Button: ', data);
  buttonValue = Number(data);
}

// A function that toggles the LED
function toggleLED(){
  myBLE.read(ledCharacteristic, handleLED);
}

function handleLED(error, data){
  if (error) console.log('error: ', error);
  console.log('LED: ', data);
  myBLE.write(ledCharacteristic, !data);
}