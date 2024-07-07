import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, doc, getDoc,deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMuLs8WnhMp3lsC1ZbcPnibA-mNiR3B18",
    authDomain: "cii-web-calculator.firebaseapp.com",
    projectId: "cii-web-calculator",
    storageBucket: "cii-web-calculator.appspot.com",
    messagingSenderId: "949662714907",
    appId: "1:949662714907:web:dc89c0b95a3c09eb933cbe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const shipId = urlParams.get('id');
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    if (shipId) {
        const shipDoc = doc(db, 'kapal', shipId);
        try {
            const shipSnap = await getDoc(shipDoc);
            loadingElement.style.display = 'none';
            if (shipSnap.exists()) {
                displayShipDetails(shipSnap.data(), shipId);
            } else {
                loadingElement.textContent = 'No such document!';
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
            loadingElement.textContent = 'Error loading data. Please try again.';
        }
    } else {
        loadingElement.textContent = 'No ship ID provided in URL.';
    }
});

function displayShipDetails(shipData, shipId) {
    const shipDetails = document.getElementById('ship-details');

    const vesselTypeLabel = mapVesselType(shipData.VesselType);
    const routeLabel = mapRoute(shipData.route);
    const fuelTypeLabel = mapFuelType(shipData.foc_type);

    shipDetails.innerHTML = `
        <h2>${shipData.Name}</h2>
        <p><strong>Vessel Type:</strong> ${vesselTypeLabel}</p>
        <p><strong>Route:</strong> ${routeLabel}</p>
        <p><strong>Fuel Type:</strong> ${fuelTypeLabel}</p>
        <p><strong>LOA:</strong> ${shipData.LOA}</p>
        <p><strong>LPP:</strong> ${shipData.LPP}</p>
        <p><strong>LWL:</strong> ${shipData.LWL}</p>
        <p><strong>LoS:</strong> ${shipData.LoS}</p>
        <p><strong>B:</strong> ${shipData.B}</p>
        <p><strong>T:</strong> ${shipData.T}</p>
        <p><strong>H:</strong> ${shipData.H}</p>
        <p><strong>DWT:</strong> ${shipData.DWT}</p>
        <p><strong>Dprop:</strong> ${shipData.Dprop}</p>
        <p><strong>Nrudder:</strong> ${shipData.Nrudder}</p>
        <p><strong>Nthruster:</strong> ${shipData.Nthruster}</p>
        <p><strong>TA:</strong> ${shipData.TA}</p>
        <p><strong>TF:</strong> ${shipData.TF}</p>
        <p><strong>Pme:</strong> ${shipData.pme}</p>
        <p><strong>SFOC:</strong> ${shipData.sfoc}</p>
        <p><strong>RPM:</strong> ${shipData.rpm}</p>
        <p><strong>Aux Fuel Consumption:</strong> ${shipData.auxfoc}</p>
        <p><strong>Initial Speed:</strong> ${shipData.initialSpeed}</p>
    `;

    const deleteButton = document.getElementById('delete-btn');
    deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this ship?')) {
            try {
                await deleteDoc(doc(db, 'kapal', shipId));
                alert('Ship deleted successfully.');
                window.location.href = 'shipList.html';
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert('Error deleting ship. Please try again.');
            }
        }
    });

    const editButton = document.getElementById('edit-btn');
    editButton.addEventListener('click', () => {
        window.location.href = `editShip.html?id=${shipId}`; // Navigate to editShip.html
    });
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
