import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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
    const shipDetailsElement = document.getElementById('ship-details');
    const shipNameElement = document.getElementById('ship-name');
    shipNameElement.textContent = shipData.Name;

    // Set the main details
    document.getElementById('vessel-type').textContent = `Vessel Type: ${mapVesselType(shipData.VesselType)}`;
    document.getElementById('route').textContent = `Route: ${mapRoute(shipData.route)}`;
    document.getElementById('fuel-type').textContent = `Fuel Type: ${mapFuelType(shipData.foc_type)}`;

    const details = [
        { title: 'Length Overall (LOA)', value: `${shipData.LOA} meters` },
        { title: 'Length Between Perpendiculars (LPP)', value: `${shipData.LPP} meters` },
        { title: 'Length on Waterline (LWL)', value: `${shipData.LWL} meters` },
        { title: 'Length on Surface (LoS)', value: `${shipData.LoS} meters` },
        { title: 'Breath (B)', value: `${shipData.B} meters` },
        { title: 'Draft (T)', value: `${shipData.T} meters` },
        { title: 'Height (H)', value: `${shipData.H} meters` },
        { title: 'Deadweight Tonnage (DWT)', value: `${shipData.DWT} tons` },
        { title: 'Speed (VS)', value: `${shipData.initialSpeed} knots` },
        { title: 'Propeller Diameter (Dprop)', value: `${shipData.Dprop} meters` },
        { title: 'Number of Rudders', value: `${shipData.Nrudder}` },
        { title: 'Number of Thrusters', value: `${shipData.Nthruster}` },
        { title: 'Aft Draft (TA)', value: `${shipData.TA} meters` },
        { title: 'Forward Draft (TF)', value: `${shipData.TF} meters` },
        { title: 'Main Engine Power (Pme)', value: `${shipData.pme} kW` },
        { title: 'Specific Fuel Oil Consumption (SFOC)', value: `${shipData.sfoc} g/kWh` },
        { title: 'Revolutions Per Minute (RPM)', value: `${shipData.rpm} RPM` },
        { title: 'Number of Auxiliary Engines', value: `${shipData.auxnumber}` },
        { title: 'Auxiliary Engine Power', value: `${shipData.auxpower} kW` },
        { title: 'Auxiliary Fuel Consumption', value: `${shipData.auxfoc} g/kWh` },
    ];
    

    details.forEach(detail => {
        const detailTile = document.createElement('div');
        detailTile.classList.add('detail-tile');
        detailTile.innerHTML = `
            <div class="detail-title">${detail.title}</div>
            <div class="detail-value">${detail.value}</div>
        `;
        shipDetailsElement.appendChild(detailTile);
    });

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

    const resultButton = document.getElementById('result-btn');
    resultButton.addEventListener('click', () => {
        window.location.href = `result.html?id=${shipId}`; // Navigate to result.html
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
