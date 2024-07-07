import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMuLs8WnhMp3lsC1ZbcPnibA-mNiR3B18",
  authDomain: "cii-web-calculator.firebaseapp.com",
  projectId: "cii-web-calculator",
  storageBucket: "cii-web-calculator.appspot.com",
  messagingSenderId: "949662714907",
  appId: "1:949662714907:web:dc89c0b95a3c09eb933cbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db,'kapal')

// Fetch documents 
getDocs(colRef)
  .then((snapshot) => {
    console.log("Fetched documents:", snapshot.docs.map(doc => doc.data()));
  })
  .catch((error) => {
    console.error("Error fetching documents: ", error);
  });

window.getForm = function(event) {
  event.preventDefault();
  let initialSpeed = 13.8;
  const startYear = 2024; // Starting year
  const endYear = 2030; // Ending year

  localStorage.clear();

  const shipData = document.getElementById("ship-data-form");
  const machineryData = document.getElementById("machinery-data-form");
  const routeData = document.getElementById("route-selection-form");

  const Name = shipData.querySelector('input[name="Vessel-Name"]').value;
  const VesselType = shipData.querySelector('select[name="vessel-type"]').value;
  const LOA = parseFloat(shipData.querySelector('input[name="LOA"]').value);
  const LPP = parseFloat(shipData.querySelector('input[name="LPP"]').value);
  const LWL = LPP * 1.035;
  const LoS = parseFloat(shipData.querySelector('input[name="LoS"]').value);
  const B = parseFloat(shipData.querySelector('input[name="B"]').value);
  const T = parseFloat(shipData.querySelector('input[name="T"]').value);
  const H = parseFloat(shipData.querySelector('input[name="H"]').value);
  const DWT = parseFloat(shipData.querySelector('input[name="DWT"]').value);
  const VS = parseFloat(shipData.querySelector('input[name="Vs"]').value);
  const Dprop = parseFloat(shipData.querySelector('input[name="Dprop"]').value);
  const Nrudder = parseFloat(shipData.querySelector('input[name="Nrudder"]').value);
  const Nthruster = parseFloat(shipData.querySelector('input[name="Nthruster"]').value);
  const TA = parseFloat(shipData.querySelector('input[name="TA"]').value);
  const TF = parseFloat(shipData.querySelector('input[name="TF"]').value);

  const foc_type = machineryData.querySelector('select[name="fuel-type"]').value;
  const pme = parseFloat(machineryData.querySelector('input[name="Pme"]').value);
  const sfoc = parseFloat(machineryData.querySelector('input[name="SFOC"]').value);
  const rpm = parseFloat(machineryData.querySelector('input[name="RPM"]').value);

  const auxpower = parseFloat(machineryData.querySelector('input[name="aux-power"]').value);
  const auxnumber = parseFloat(machineryData.querySelector('input[name="aux-number"]').value);
  const auxfoc = parseFloat(machineryData.querySelector('input[name="aux-foc"]').value);

  const route = parseInt(routeData.querySelector('select[name="route"]').value);

  const shipDataObj = {
    Name,
    VesselType,
    LOA,
    LPP,
    LWL,
    LoS,
    B,
    T,
    H,
    DWT,
    VS,
    Dprop,
    Nrudder,
    Nthruster,
    TA,
    TF,
    foc_type,
    pme,
    sfoc,
    rpm,
    auxpower,
    auxnumber,
    auxfoc,
    route,
    initialSpeed
  };

  localStorage.setItem('initial_speed', initialSpeed);

  const dataToSave = {
    ...shipDataObj
  }

  // Add data to Firebase Firestore
  addDoc(colRef, shipDataObj)
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  window.open('shipList.html');
};

// Attach the getForm function to the form submission event
document.getElementById("submit-form").addEventListener("click", getForm);