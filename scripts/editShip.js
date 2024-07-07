import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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

    if (shipId) {
        const shipDoc = doc(db, 'kapal', shipId);
        try {
            const shipSnap = await getDoc(shipDoc);
            if (shipSnap.exists()) {
                fillForm(shipSnap.data());
            } else {
                alert('No such document!');
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
            alert('Error loading data. Please try again.');
        }
    } else {
        alert('No ship ID provided in URL.');
    }
});

function fillForm(shipData) {
    document.getElementById('Vessel-Name').value = shipData.Name;
    document.getElementById('vessel-type').value = shipData.VesselType;
    document.getElementById('LOA').value = shipData.LOA;
    document.getElementById('LPP').value = shipData.LPP;
    document.getElementById('LoS').value = shipData.LoS;
    document.getElementById('B').value = shipData.B;
    document.getElementById('T').value = shipData.T;
    document.getElementById('H').value = shipData.H;
    document.getElementById('DWT').value = shipData.DWT;
    document.getElementById('Vs').value = shipData.initialSpeed;
    document.getElementById('Dprop').value = shipData.Dprop;
    document.getElementById('Nrudder').value = shipData.Nrudder;
    document.getElementById('Nthruster').value = shipData.Nthruster;
    document.getElementById('TA').value = shipData.TA;
    document.getElementById('TF').value = shipData.TF;

    document.getElementById('Pme').value = shipData.pme;
    document.getElementById('SFOC').value = shipData.sfoc;
    document.getElementById('RPM').value = shipData.rpm;
    document.getElementById('fuel-type').value = shipData.foc_type;
    document.getElementById('aux-power').value = shipData.aux_power;
    document.getElementById('aux-number').value = shipData.aux_number;
    document.getElementById('aux-foc').value = shipData.auxfoc;

    document.getElementById('route').value = shipData.route;
}

document.getElementById('submit-form').addEventListener('click', async function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const shipId = urlParams.get('id');

    const shipDataForm = document.getElementById('ship-data-form');
    const machineryDataForm = document.getElementById('machinery-data-form');
    const routeDataForm = document.getElementById('route-selection-form');

    const updatedShipData = {
        Name: shipDataForm.querySelector('input[name="Vessel-Name"]').value,
        VesselType: shipDataForm.querySelector('select[name="vessel-type"]').value,
        LOA: parseFloat(shipDataForm.querySelector('input[name="LOA"]').value),
        LPP: parseFloat(shipDataForm.querySelector('input[name="LPP"]').value),
        LoS: parseFloat(shipDataForm.querySelector('input[name="LoS"]').value),
        B: parseFloat(shipDataForm.querySelector('input[name="B"]').value),
        T: parseFloat(shipDataForm.querySelector('input[name="T"]').value),
        H: parseFloat(shipDataForm.querySelector('input[name="H"]').value),
        DWT: parseFloat(shipDataForm.querySelector('input[name="DWT"]').value),
        initialSpeed: parseFloat(shipDataForm.querySelector('input[name="Vs"]').value),
        Dprop: parseFloat(shipDataForm.querySelector('input[name="Dprop"]').value),
        Nrudder: parseFloat(shipDataForm.querySelector('input[name="Nrudder"]').value),
        Nthruster: parseFloat(shipDataForm.querySelector('input[name="Nthruster"]').value),
        TA: parseFloat(shipDataForm.querySelector('input[name="TA"]').value),
        TF: parseFloat(shipDataForm.querySelector('input[name="TF"]').value),

        foc_type: machineryDataForm.querySelector('select[name="fuel-type"]').value,
        pme: parseFloat(machineryDataForm.querySelector('input[name="Pme"]').value),
        sfoc: parseFloat(machineryDataForm.querySelector('input[name="SFOC"]').value),
        rpm: parseFloat(machineryDataForm.querySelector('input[name="RPM"]').value),
        aux_power: parseFloat(machineryDataForm.querySelector('input[name="aux-power"]').value),
        aux_number: parseFloat(machineryDataForm.querySelector('input[name="aux-number"]').value),
        auxfoc: parseFloat(machineryDataForm.querySelector('input[name="aux-foc"]').value),

        route: parseInt(routeDataForm.querySelector('select[name="route"]').value),
    };

    try {
        const shipDoc = doc(db, 'kapal', shipId);
        await updateDoc(shipDoc, updatedShipData);
        alert('Ship updated successfully.');
        window.location.href = `shipDetail.html?id=${shipId}`; // Navigate back to shipDetail.html
    } catch (error) {
        console.error("Error updating document: ", error);
        alert('Error updating ship. Please try again.');
    }
});
