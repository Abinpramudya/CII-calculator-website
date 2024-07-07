import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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
const colRef = collection(db, 'kapal')

// Function to fetch and display ships
function displayShips() {
    getDocs(colRef)
        .then((snapshot) => {
            const shipList = document.getElementById('ship-list');
            shipList.innerHTML = ''; // Clear existing list items

            snapshot.forEach((doc) => {
                const shipData = doc.data();
                const listItem = createShipListItem(doc.id, shipData);
                shipList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error("Error fetching documents: ", error);
        });
}

// Function to create a ship list item
function createShipListItem(id, shipData) {
    const listItem = document.createElement('li');
    listItem.classList.add('ship-item');
    listItem.dataset.id = id;

    const vesselTypeLabel = mapVesselType(shipData.VesselType);

    listItem.innerHTML = `
      <strong>${shipData.Name}</strong> - ${vesselTypeLabel}
      <br>
      <i class="fas fa-route"></i> ${mapRoute(shipData.route)}
      <br>
      <i class="fas fa-gas-pump"></i> ${mapFuelType(shipData.foc_type)}
    `;

    listItem.addEventListener('click', () => {
        window.location.href = `shipDetail.html?id=${id}`;
    });

    return listItem;
}

// Function to map vessel type to more descriptive labels
function mapVesselType(type) {
    switch (type) {
        case 'General-Cargo':
            return 'General Cargo';
        case 'Bulk-Carrier':
            return 'Bulk Carrier';
        case 'Gas-Carrier':
            return 'Gas Carrier';
        case 'Tanker':
            return 'Tanker';
        case 'Container-Vessel':
            return 'Container Vessel';
        case 'Refrigerated-Cargo-Carrier':
            return 'Refrigerated Cargo Carrier';
        case 'Combination-Carrier':
            return 'Combination Carrier';
        case 'LNG-Carrier':
            return 'LNG Carrier';
        default:
            return type; // Default to original value if no match
    }
}

// Function to map numeric route to more descriptive labels
function mapRoute(route) {
    switch (route) {
        case 1:
            return 'SUB-WIN-SUB';
        case 2:
            return 'SUB-PTL-SUB';
        case 3:
            return 'SUB-JKT-SUB';
        case 4:
            return 'SUB-MKS-SUB';
        case 5:
            return 'SUB-BPN-SUB';
        case 6:
            return 'JKT-PDG-JKT';
        case 7:
            return 'SUB-BDJ-SUB';
        case 8:
            return 'SUB-TRK-SUB';
        case 9:
            return 'SUB-TLI-PTL-SUB';
        case 10:
            return 'SUB-DIL-SUB';
        case 11:
            return 'SUB-TLI-SUB';
        default:
            return route; // Return the numeric value if no match
    }
}
 
// Function to map fuel type to more descriptive labels
function mapFuelType(fuelType) {
    switch (fuelType) {
        case 'HFO':
            return 'Heavy Fuel Oil (HFO)';
        case 'MDO':
            return 'Marine Diesel Oil (MDO)';
        default:
            return fuelType; // Default to original value if no match
    }
}

// Call the function to display ships when the page loads
document.addEventListener('DOMContentLoaded', function () {
    displayShips();
});
