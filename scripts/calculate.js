import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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
const colRef = collection(db, 'kapal');

document.addEventListener('DOMContentLoaded', async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const shipId = urlParams.get('id');
  if (shipId) {
      const shipDoc = doc(db, 'kapal', shipId);
      try {
          const shipSnap = await getDoc(shipDoc);
          if (shipSnap.exists()) {
              const shipData = shipSnap.data();
              const Name = shipData.Name;
              const VesselType = shipData.VesselType;
              const LOA = shipData.LOA;
              const LPP = shipData.LPP;
              const LWL = LPP * 1.035;
              const LoS = shipData.LoS;
              const B = shipData.B;
              const T = shipData.T;
              const H = shipData.H;
              const DWT = shipData.DWT;
              const Vs = shipData.VS;
              const Dprop = shipData.Dprop;
              const Nrudder = shipData.Nrudder;
              const Nthruster = shipData.Nthruster;
              const TA = shipData.TA;
              const TF = shipData.TF;
              const foc_type = shipData.foc_type;
              const pme = shipData.pme;
              const sfoc = shipData.sfoc;
              const rpm = shipData.rpm;
              const auxpower = shipData.auxpower;
              const auxnumber = shipData.auxnumber;
              const auxfoc = shipData.auxfoc;
              const route = shipData.route;

              // Console logs for all variables
              console.log('Name:', Name);
              console.log('VesselType:', VesselType);
              console.log('LOA:', LOA);
              console.log('LPP:', LPP);
              console.log('LWL:', LWL);
              console.log('LoS:', LoS);
              console.log('B:', B);
              console.log('T:', T);
              console.log('H:', H);
              console.log('DWT:', DWT);
              console.log('Vs:', Vs);
              console.log('Dprop:', Dprop);
              console.log('Nrudder:', Nrudder);
              console.log('Nthruster:', Nthruster);
              console.log('TA:', TA);
              console.log('TF:', TF);
              console.log('foc_type:', foc_type);
              console.log('pme:', pme);
              console.log('sfoc:', sfoc);
              console.log('rpm:', rpm);
              console.log('auxpower:', auxpower);
              console.log('auxnumber:', auxnumber);
              console.log('auxfoc:', auxfoc);
              console.log('route:', route);

              calculateCII(Name, VesselType, LOA, LPP, LWL, LoS, B, T, H, DWT, Dprop, Nrudder, Nthruster, TA, TF, foc_type, pme, sfoc, rpm, auxfoc, route);
              populateTables(Vs,Name)
          } else {
              console.log("No such document");
          }
      } catch (error) {
          console.error("Error fetching document: ", error);
          console.log("Error loading data. Please try again.");
      }
  } else {
      console.log("No ship ID provided in URL.");
  }
});


//dummy values
// const Name = "Jaladhimantri"
// const VesselType = "Container-Vessel"
// const LOA = 117
// const LPP = 110
// const LWL = LPP * 1.035
// const LoS = 114
// const B = 19.7
// const T = 6.45
// const H = 8.5
// const DWT = 7664.6
// const Displacement = 11129.6
// var Vs = 13.8
// const Dprop = 3.7
// const Nrudder = 1
// const Nthruster = 0
// const TA = 5
// const TF = 4

// const pme = 3200
// const sfoc = 182
// const rpm = 169
// const Pservice = 0.75
// const foc_type = "HFO"

// const auxpower = 180
// const auxnum = 2
// const auxfoc = 75
// const route = 1
var year = 2024;


function reynoldnumber(Vs, LWL) {
  Vs = Vs * 0.5144;

  var rey = (Vs * LWL) / 0.00000093713; 
  console.log("rey",rey)
  return rey;
}

function coefficientfriction(rey){
  var cf = 0.075 / (Math.log10(rey) - 2) ** 2;
  console.log("cf:",cf)
  // var cf = 123;
  return cf
}

function froudenumber(Vs,LWL){
  var Vs = Vs * 0.5144;
  const g = 9.81; // m/s^2
  return Vs / Math.sqrt(g * LWL);
}

function coefficientblock_cal(froude_number){
  return 0.7 + (1 / 8) * Math.atan((23 - 100 * froude_number) / 4);
}

function shapecoef_cal(LoS,LWL,LPP,cb,B,T,TA,TF,Dprop,Nrudder){
  var Nbracket = Nrudder
  var Nbossing = Nrudder

  if (Nrudder === 1){
    var s0 = -0.6837
    var s1 = 0.2771
    var s2 = 0.6542
    var s3 = 0.6422
    var s4 = 0.0075
    var s5 = 0.0275
    var s6 = -0.0045
    var s7 = -0.4798
    var s8 = 0.0376
    var  Krudder = 0
    var  Kbracket = 0
    var  Kbossing = 0
  }
  
  if (Nrudder === 2){
    var s0 = -0.4319
    var s1 = 0.1685
    var s2 = 0.5637
    var s3 = 0.5891
    var s4 = 0.0033
    var s5 = 0.0134
    var s6 = -0.0005
    var s7 = -2.7932
    var s8 = 0.0072
    var Krudder = 0.0131
    var  Kbracket = -0.003
    var Kbossing = 0.0061
  }

  var k = s0 + (s1 * (LoS / LWL)) + (s2 * (LWL / LPP)) + (s3 * cb) + (s4 * (LPP / B)) +
      (s5 * (B / T)) + (s6 * (LPP/T)) + (s7 * ((TA - TF) / LPP)) + (s8 *(Dprop / T)) +
      (Krudder * Nrudder) + (Kbracket * Nbracket) + (Kbossing * Nbossing)

  return k
}

function wetsurface_cal(LPP,B,T,shapecoef){
  return shapecoef * LPP * (B+(2*T))
}

function resistancefriction_cal(cf,p,s,v){
  var v = v * 0.5144
  return cf *(p/2) * s * (v ** 2) / 1000
}

function coefficientFrictionResidual_cal(froude_number,coefficientblock,Nrudder){
  if (Nrudder === 1){
    var b11 = -0.57424
    var b12 = 13.3893
    var b13 = 90.596
    var b21 = 4.6614
    var b22 = -39.721
    var b23 = -351.483
    var b31 = -1.14215
    var  b32 = -12.3296
    var b33 = 459.254
  }

  if (Nrudder === 2){
    var b11 = -5.3475
    var b12 = 55.6532
    var b13 = -114.905
    var b21 = 19.2714
    var b22 = -192.388
    var b23 = 388.333
    var b31 = -14.3571
    var b32 = 142.738
    var b33 = -254.762
  }
  
  return b11 + (b12 * froude_number) + (b13 * (froude_number ** 2)) +
         ((b21 + (b22 * froude_number) + (b23 * (froude_number ** 2))) * coefficientblock) +
         ((b31 + (b32 * froude_number) + (b33 * (froude_number ** 2))) * (coefficientblock ** 2))
}

function fcrit_cal(Nrudder,coefficientblock){
  if (Nrudder === 1){
    var d1 = 0.854
    var d2 = -1.228
    var d3 = 0.497
  }

  if (Nrudder === 2){
    var d1 = 0.897
    var d2 = -1.457
    var d3 = 0.767
  }
  return d1 + (d2 * coefficientblock) + (d3 *(coefficientblock ** 2))
}

function kfr_cal(fcrit,fn){
  if(fn < fcrit){
    var a = 1
  }
  if(fn > fcrit){
    var c1 = fn / fcrit
    var a = (fn/fcrit) ** c1
  }
  return a
}

function lengthfactor_cal(LPP,Nrudder){

  if (Nrudder === 1){
    var e1 = 2.1701
    var e2 = -0.1602
  }

  if (Nrudder === 2){
    var e1 = 1.8319
    var e2 = -0.1237
  }
  return e1 * (LPP ** e2)
}

function beamdraft_cal(B,T,Nrudder){
  let a1;
  if (Nrudder === 1){
    a1 =0.3382
  }

  if (Nrudder ===2){
    a1 = 0.2748
  }
  var ratio = B/T

  if (ratio < 1.99){
    var  a  = 1.99 ** a1
  }

  if (ratio >= 1.99){
    var a = (B/T) ** a1
  }
  return a
}

function lengthbeam_cal(LPP,B,Nrudder){
  let a2;
  if (Nrudder === 1){
    a2 = -0.8086
  }

  if (Nrudder ===2){
    a2 = -0.5747
  }
  var ratio = LPP/B

  if (ratio <= 7.11){
    var  a  = (LPP/B) ** a2
  }

  if (ratio > 7.11){
    var a = 7.11 **a2
  }

  return a
}

function wettedratio_cal(LoS,LWL,Nrudder){
  let a3;
  if (Nrudder === 1){
    a3 = -6.0258
  }

  if (Nrudder ===2){
    a3 = -6.761
  }

  var ratio = LoS / LWL

  if (ratio <= 1.05){
    var   a  = (LoS/LWL) ** a3
  }

  if (ratio > 1.05){
    var  a = 1.05 **a3
  }
  return a
}

function aftoverhang_cal(LWL,LPP,Nrudder){
  let a4;
  if (Nrudder === 1){
    a4 = -3.5632
  }

  if (Nrudder ===2){
    a4 = -4.3834
  }

  var ratio = LWL / LPP

  if (ratio <= 1.06){
    var   a  = ratio ** a4
  }

  if (ratio > 1.05){
    var   a = 1.06 **a4
  }
  return a
}

function trimcorrection_cal(TA,TF,Nrudder,LPP){
  let a5;
  if (Nrudder === 1){
    a5 = 9.4405
  }

  if (Nrudder ===2){
    a5 = 8.8158
  }

  return (1 + ((TA - TF) / LPP)) ** a5
}

function propellerfactor_cal(D,TA,Nrudder){
  let a6;
  if (Nrudder === 1){
    a6 = 0.0146
  }

  if (Nrudder ===2){
    a6 = -0.1418
  }

  var ratio = D/TA  

  if (ratio < 0.43){
    var  a = 0.43 ** a6
  }

  if (ratio >= 0.43 && ratio <= 0.84){
    var  a = (ratio) **a6

  }

  if (ratio > 0.84){
    var a = 0.84 ** a6
  }

  return a
}

function coefresidual_cal(Nthruster,Nrudder,crstd,kfr,lengthfactor,beamdraft,lengthbeam,
                           wettedratio,aftoverhang,trimcorrection,propellerfactor){
  
  if (Nrudder === 1){
    var a7 = 0
    var a8 = 0
    var a9 = 0
    var a10 = 0
  }

  if (Nrudder ===2){
    var a7 = -0.1258
    var a8 = 0.0481
    var a9 = 0.1699
    var a10 = 0.0728
  }
  var Nthruster = 1
  var Nbracket = Nrudder
  var Nbossing = Nrudder

  
  return crstd * kfr * lengthfactor * beamdraft * lengthbeam * wettedratio * aftoverhang * trimcorrection *
         propellerfactor * (Nrudder ^ a7) * (Nbracket^a8) * (Nbossing ^ a9) * (Nthruster ^ a10)
}

function resistanceresidual_cal(coefficientresidual,p,vs,B,T){
  var vs = vs * 0.5144
  
  return coefficientresidual * ((p/2)*(vs**2)) *((B*T)/10) / 1000

}

function resistancetotal_cal(resistancefriction,resistanceresidual){
  return resistancefriction + resistanceresidual
}

function Ppropel_cal(resistancetotal,Vs){
  var Vs = Vs * 0.5144

  return resistancetotal * Vs
}

function propeff_cal(LPP,RPM){
  return 0.84 - RPM * Math.sqrt(LPP) / 10000
}

function totalpower_cal(propeff,power_propel){
  return power_propel / propeff
}

function NoE_cal(totalpower,pme){
  return (totalpower/pme) + 1
}

function EL_cal(totalpower,pme){
  const NE = 1
  return totalpower / (pme * NE)
}

function SFOCrel_cal(EL){
  return 0.455 * (EL ** 2) - 0.71 * EL + 1.28
}

function SFOC_cal(sfocrel,sfoc){
  return sfocrel * sfoc
}

function FOC_cal(pme){
  var ratio = 0.85
  return pme * ratio
}

function EL_port_cal(vesseltype){
  if (vesseltype === "General Cargo"){
    var el_port = 1.6
  }

  else{
    var el_port = 0.7
  }

  return el_port
}

function route_def(route) {
  const docking = 30;
  const days = 365;
  const avail = days - docking;

  let distance, sailingTime, Time1, Time2, Time3, manuver1, manuver2, manuver3, totalsail, maxvoyage;

  if (route === 1) {
      distance = 1630;
      sailingTime = 118.1;
      Time1 = 30.9;
      Time2 = 51.8;
      Time3 = 41.8;
      manuver1 = 9.4;
      manuver2 = 2.3;
      manuver3 = 2.6;
      totalsail = 256.9;
      maxvoyage = 32;
  } else if (route === 2) {
      distance = 1177;
      sailingTime = 85.3;
      Time1 = 30.9;
      Time2 = 51.8;
      Time3 = 0.0;
      manuver1 = 18.8;
      manuver2 = 4.6;
      manuver3 = 0.0;
      totalsail = 191.4;
      maxvoyage = 43;
  } else if (route === 3) {
      distance = 743;
      sailingTime = 53.8;
      Time1 = 27.9;
      Time2 = 30.9;
      Time3 = 0.0;
      manuver1 = 10.3;
      manuver2 = 3.3;
      manuver3 = 0.0;
      totalsail = 126.2;
      maxvoyage = 64;
  } else if (route === 4) {
      distance = 824;
      sailingTime = 59.7;
      Time1 = 30.9;
      Time2 = 28.7;
      Time3 = 0.0;
      manuver1 = 13.0;
      manuver2 = 4.2;
      manuver3 = 0.0;
      totalsail = 136.5;
      maxvoyage = 59;
  } else if (route === 5) {
      distance = 911;
      sailingTime = 66.0;
      Time1 = 30.9;
      Time2 = 49.3;
      Time3 = 0.0;
      manuver1 = 10.6;
      manuver2 = 6.3;
      manuver3 = 0.0;
      totalsail = 163.1;
      maxvoyage = 50;
  } else if (route === 6) {
      distance = 1100;
      sailingTime = 79.7;
      Time1 = 27.9;
      Time2 = 43.5;
      Time3 = 0.0;
      manuver1 = 6.0;
      manuver2 = 3.2;
      manuver3 = 0.0;
      totalsail = 160.2;
      maxvoyage = 51;
  } else if (route === 7) {
      distance = 984;
      sailingTime = 71.3;
      Time1 = 27.9;
      Time2 = 45.8;
      Time3 = 0.0;
      manuver1 = 5.5;
      manuver2 = 10.2;
      manuver3 = 0.0;
      totalsail = 160.7;
      maxvoyage = 51;
  } else if (route === 8) {
      distance = 415;
      sailingTime = 30.1;
      Time1 = 30.9;
      Time2 = 45.8;
      Time3 = 0.0;
      manuver1 = 10.7;
      manuver2 = 11.4;
      manuver3 = 0.0;
      totalsail = 129.0;
      maxvoyage = 63;
  } else if (route === 9) {
      distance = 1585;
      sailingTime = 114.9;
      Time1 = 30.9;
      Time2 = 52.3;
      Time3 = 0.0;
      manuver1 = 12.8;
      manuver2 = 12.9;
      manuver3 = 0.0;
      totalsail = 223.8;
      maxvoyage = 36;
  } else if (route === 10) {
      distance = 1469;
      sailingTime = 106.4;
      Time1 = 30.9;
      Time2 = 85.0;
      Time3 = 51.8;
      manuver1 = 10.7;
      manuver2 = 4.1;
      manuver3 = 5.2;
      totalsail = 294.2;
      maxvoyage = 28;
  } else if (route === 11) {
      distance = 1521;
      sailingTime = 110.2;
      Time1 = 30.9;
      Time2 = 51.8;
      Time3 = 0.0;
      manuver1 = 9.4;
      manuver2 = 2.3;
      manuver3 = 0.0;
      totalsail = 204.7;
      maxvoyage = 40;
  }
  return { docking, days, avail, distance, sailingTime, Time1, Time2, Time3, manuver1, manuver2, manuver3, totalsail, maxvoyage };
}

function ae_sail_cal(auxfoc,el_sail,sailing,manuver1,manuver2,manuver3){
 const total = sailing + manuver1 + manuver2 + manuver3
 
 return auxfoc * 0.7 * total
}

function ae_port_cal(auxfoc,el_port,time1,time2,time3){
  var total = time1 + time2 + time3

  return auxfoc * el_port * total
}

function totalsail_cal(time1,time2,time3,manuver1,manuver2,manuver3,saildistance,Vs){
  var sailtime = saildistance / Vs

  var total = time1 + time2 + time3 + manuver1 + manuver2 + manuver3 + sailtime
  return total
}

function foc_total_cal(foctype,aesail,aeport,mesail,memnv){

  if (foctype === "MDO"){
    var total = aesail + aeport + mesail + memnv
  }

  else {
    var total = mesail + memnv
  }

  return total
}

function cii_ref_cal(vesselType, dwt) {
  if (vesselType === "Bulk-Carrier") {
    if (dwt >= 279000) {
      return { a: 4745, c: 0.622 };
    } else {
      return { a: 4745, c: 0.622 };
    }
  } else if (vesselType === "Gas-Carrier") {
    if (dwt >= 65000) {
      return { a: 144050000000, c: 2.071};
    } else {
      return { a: 8104, c: 0.639 };
    }
  } else if (vesselType === "Tanker") {
    return { a: 5247, c: 0.61 };

  } else if (vesselType === "Container-Vessel") {
    return { a: 1984, c: 0.489 };

  } else if (vesselType === "General-Cargo") {
    if (dwt >= 20000) {
      return { a: 31948, c: 0.792 };
    } else {
      return { a: 588, c: 0.3885 };
    }
  } else if (vesselType === "Refrigerated-Cargo-Carrier") {
    return { a: 46000, c: 0.557 };

  } else if (vesselType === "Combination-Carrier") {
    return { a: 5119, c: 0.622 };

  } else if (vesselType === "LNG-Carrier") {
    if (dwt >= 100000) {
      return { a: 9877, c: 0 };
    } else {
      return { a: 144790000000000, c: 1.45E+14 };
    }

  } else {
    return { a: null, c: null };
  }
}

function dd_ref_cal(vesselType, dwt) {
  // Check the vessel type
  if (vesselType === "Bulk-Carrier") {
    return { d1: 0.86, d2: 0.94, d3: 1.06, d4: 1.18 };
  } else if (vesselType === "Gas-Carrier") {
    if (dwt >= 65000) {
      return { d1: 0.81, d2: 0.91, d3: 1.12, d4: 1.44 };
    } else {
      return { d1: null, d2: null, d3: null, d4: null };
    }
  } else if (vesselType === "Gas-Carrier") {
    if (dwt < 65000) {
      return { d1: 0.85, d2: 0.95, d3: 1.06, d4: 1.25 };
    } else {
      return { d1: null, d2: null, d3: null, d4: null };
    }
  } else if (vesselType === "Tanker") {
    return { d1: 0.82, d2: 0.93, d3: 1.08, d4: 1.28 };
  } else if (vesselType === "Container-Vessel") {
    return { d1: 0.83, d2: 0.94, d3: 1.07, d4: 1.19 };
  } else if (vesselType === "General-Cargo") {
    return { d1: 0.83, d2: 0.94, d3: 1.06, d4: 1.19 };
  } else if (vesselType === "Refrigerated-Cargo") {
    return { d1: 0.78, d2: 0.91, d3: 1.07, d4: 1.2 };
  } else if (vesselType === "Combination-Carrier") {
    return { d1: 0.87, d2: 0.96, d3: 1.06, d4: 1.14 };
  } else if (vesselType === "LNG-Carrier") {
    if (dwt >= 100000) {
      return { d1: 0.89, d2: 0.98, d3: 1.06, d4: 1.13 };
    } else {
      return { d1: null, d2: null, d3: null, d4: null };
    }
  } else {
    return { d1: null, d2: null, d3: null, d4: null };
  }
}

function cii_req_cal(year,d1,d2,d3,d4,ciiref) {
  if (year < 2020 || year > 2030) {
    return null;
  }
  const data = {
    2020: 0.01,
    2021: 0.02,
    2022: 0.03,
    2023: 0.05,
    2024: 0.07,
    2025: 0.09,
    2026: 0.11,
    2027: 0.14,
    2028: 0.17,
    2029: 0.2,
    2030: 0.23,
  };

  var a = data[year]
  var b = (1-a) * ciiref

  return {inferior_cii: b * d4,
          upper_cii : b * d3,
          lower_cii : b * d2,
          superior_cii : b * d1}
}

function cii_grade_cal(currentCii, inferiorCii, upperCii, lowerCii, superiorCii) {
  // Check if all reference CII values are provided
  if (inferiorCii === undefined || upperCii === undefined || lowerCii === undefined || superiorCii === undefined) {
    return "Error: Missing reference CII values";
  }

  // Check current CII against reference values
  if (currentCii < superiorCii) {
    return "A";
  } else if (currentCii < lowerCii) {
    return "B";
  } else if (currentCii < upperCii) {
    return "C";
  } else if (currentCii < inferiorCii) {
    return "D";
  } else {
    return "E";
  }
}

function calculateCII(Name, VesselType, LOA, LPP, LWL, LoS, B, T, H, DWT, Dprop, Nrudder, Nthruster, TA, TF, foc_type, pme, sfoc, rpm, auxfoc, route) {
  let initialSpeed = 13.8;
  const startYear = 2024; // Starting year
  const endYear = 2030; // Ending year

  localStorage.clear();

  for (let year = startYear; year <= endYear; year++) {
    let Vs = initialSpeed;
    for (let i = 0; i < 8; i++) {
      const result = FinaHFO_cal(Name, VesselType, DWT, LOA, LPP, LWL, LoS, B, T, H, Vs, Dprop, Nrudder, Nthruster, TA, TF, pme, sfoc, rpm, auxfoc, route, foc_type, year);

      // Store each iteration's results in local storage with a unique key
      const prefix = `result_${year}_${i}_`;
      for (const [key, value] of Object.entries(result)) {
        localStorage.setItem(`${prefix}${key}`, value);
      }

      // Log the results
      console.log(`Year ${year} - Speed iteration ${i + 1}`);
      for (const [key, value] of Object.entries(result)) {
        console.log(`${key}:`, value);
      }

      // Reduce Vs by 1 for the next iteration
      Vs -= 1;
    }
  }

  window.open('results.html', '_blank');
}

function FinaHFO_cal(name, vesselType, DWT, LOA, LPP, LWL, LoS, B, T, H, Vs, Dprop, Nrudder, Nthruster, TA, TF, pme, sfoc, rpm,auxfoc,route, foc_type, year) {
  const reynold_number = reynoldnumber(Vs, LWL);
  const cf_number = coefficientfriction(reynold_number);
  const froude_number = froudenumber(Vs, LWL);
  const coefficientblock = coefficientblock_cal(froude_number);
  const shapecoef = shapecoef_cal(LoS, LWL, LPP, coefficientblock, B, T, TA, TF, Dprop, Nrudder);
  const wetsurface = wetsurface_cal(LPP, B, T, shapecoef);
  const resistancefriction = resistancefriction_cal(cf_number, 1025, wetsurface, Vs);
  const crstd = coefficientFrictionResidual_cal(froude_number, coefficientblock, Nrudder);
  const fcrit = fcrit_cal(Nrudder, coefficientblock);
  const kfr = kfr_cal(fcrit, froude_number);
  const lengthfactor = lengthfactor_cal(LPP, Nrudder);
  const Beamdraft = beamdraft_cal(B, T, Nrudder);
  const lengthbeam = lengthbeam_cal(LPP, B, Nrudder);
  const wettedratio = wettedratio_cal(LoS, LWL, Nrudder);
  const aftoverhang = aftoverhang_cal(LWL, LPP, Nrudder);
  const trimcorrection = trimcorrection_cal(TA, TF, Nrudder, LPP);
  const propellerfactor = propellerfactor_cal(Dprop, TA, Nrudder);
  const coefficientresidual = coefresidual_cal(Nthruster, Nrudder, crstd, kfr, lengthfactor, Beamdraft, lengthbeam, wettedratio, aftoverhang, trimcorrection, propellerfactor);
  const resistanceresidual = resistanceresidual_cal(coefficientresidual, 1025, Vs, B, T);
  const resistancetotal = resistancetotal_cal(resistancefriction, resistanceresidual);
  const power_propel = Ppropel_cal(resistancetotal, Vs);
  const propeff = propeff_cal(LPP, rpm);
  const totalpower = totalpower_cal(propeff, power_propel);
  const noe = NoE_cal(totalpower, pme);
  const el = EL_cal(totalpower, pme);
  const sfocrel = SFOCrel_cal(el);
  const Sfoc = SFOC_cal(sfocrel, sfoc);
  const FOC = FOC_cal(pme);

  const gfoc = totalpower * Sfoc;
  const kgfoc = gfoc / 1000;
  const tfoc = gfoc / 1000000;

  const elport = EL_port_cal(vesselType);
  const elsail = 0.7;

  const routes = route_def(route); // Assuming route_def() function returns the needed route data
  const { docking, days, avail, distance, sailingTime, Time1, Time2, Time3, manuver1, manuver2, manuver3, totalsail, maxvoyage } = routes;
  const sailtime = totalsail_cal(Time1, Time2, Time3, manuver1, manuver2, manuver3, distance, Vs);

  const SailTime_AE = distance / Vs;

  const aesail = ae_sail_cal(auxfoc, elsail, SailTime_AE, manuver1, manuver2, manuver3);
  const aeport = ae_port_cal(auxfoc, elport, Time1, Time2, Time3);

  const max_voyage = Math.ceil((avail * 24)/sailtime);
  const total_distance = max_voyage * distance;
  const me_sail_mdo = (kgfoc / 890) * (distance/Vs) * 1000 * 2;
  const me_sail_hfo = (kgfoc / 991) * (distance/Vs) * 1000 * 2;

  const me_mnv_mdo = (kgfoc / 890) * (manuver1 + manuver2 + manuver3) * 1000 * 0.2;
  const me_mnv_hfo = (kgfoc / 991) * (manuver1 + manuver2 + manuver3) * 1000 * 0.2;

  if (foc_type === "MDO") {
    var foctotal = foc_total_cal(foc_type, aesail, aeport, me_sail_mdo, me_mnv_mdo);
    var foc_me = me_sail_mdo + me_mnv_mdo;
  } else {
    var foctotal = foc_total_cal(foc_type, aesail, aeport, me_sail_hfo, me_mnv_hfo);
    var foc_me = me_sail_hfo + me_mnv_hfo;
  }

  const focae = aesail + aeport;
  const margin_up_ae = focae * 1.03;
  const margin_dn_ae = focae * 0.97;

  const margin_up_me = foc_me * 1.10;
  const margin_dn_me = foc_me * 0.9;

  // Annual calculations
  const annual_ae = (aesail + aeport) * max_voyage;
  const annual_me = foc_me * max_voyage;

  const ton_annual_ae = (annual_ae / 1000) * (890 / 1000);
  const ton_annual_me = (annual_me / 1000) * (890 / 1000);

  const ae_co2_emmission = ton_annual_ae * 3.206;
  const me_co2_emmission = ton_annual_me * 3.206;

  const co2_emmision = ae_co2_emmission + me_co2_emmission;

  const attained_cii = (co2_emmision * (10 ** 6)) / (total_distance * DWT);

  const { a, c } = cii_ref_cal(vesselType, DWT);
  const cii_ref = a * (DWT ** ((c * -1)));

  const refcal = dd_ref_cal(vesselType,DWT);
  const {d1,d2,d3,d4} = refcal;

  const cii_req = cii_req_cal(year, d1, d2, d3, d4, cii_ref);

  const {inferior_cii,upper_cii,lower_cii,superior_cii} = cii_req;

  const cii_grade = cii_grade_cal(attained_cii, inferior_cii, upper_cii, lower_cii, superior_cii);

  const result = {
    // Add year to the result object
    year,
    reynold_number,
    cf_number,
    froude_number,
    coefficientblock,
    shapecoef,
    wetsurface,
    resistancefriction,
    crstd,
    fcrit,
    kfr,
    lengthfactor,
    Beamdraft,
    lengthbeam,
    wettedratio,
    aftoverhang,
    trimcorrection,
    propellerfactor,
    coefficientresidual,
    resistanceresidual,
    resistancetotal,
    power_propel,
    propeff,
    totalpower,
    noe,
    el,
    sfocrel,
    Sfoc,
    FOC,
    gfoc,
    kgfoc,
    tfoc,
    aesail,
    aeport,
    sailtime,
    max_voyage,
    total_distance,
    me_sail_mdo,
    me_sail_hfo,
    me_mnv_mdo,
    me_mnv_hfo,
    foctotal,
    foc_me,
    focae,
    margin_up_ae,
    margin_dn_ae,
    margin_up_me,
    margin_dn_me,
    annual_ae,
    annual_me,
    ton_annual_ae,
    ton_annual_me,
    ae_co2_emmission,
    me_co2_emmission,
    co2_emmision,
    attained_cii,
    cii_ref,
    cii_grade
  };

  return result;
}

// Function to populate the tables based on localStorage data
function populateTables(Vs,Name) {
  const fuelConsumptionTable = document.getElementById('fuel-consumption-table').querySelector('tbody');
  const ciiGradeTable = document.getElementById('cii-grade-table').querySelector('tbody');

  const startYear = 2024;
  const endYear = 2030;
  const initialSpeed = Vs;

  // Display the ship name
  const shipNameElement = document.getElementById('ship-name');
  shipNameElement.textContent = Name;

  for (let i = 0; i < 8; i++) {
    const speed = (initialSpeed - i).toFixed(1);
    // console.log("speed",speed)

    // Populate Fuel Consumption Table
    const fuelRow = document.createElement('tr');
    const lowerMarginMe = parseFloat(localStorage.getItem(`result_${startYear}_${i}_margin_dn_me`)).toFixed(3);
    const upperMarginMe = parseFloat(localStorage.getItem(`result_${startYear}_${i}_margin_up_me`)).toFixed(3);
    const lowerMarginAe = parseFloat(localStorage.getItem(`result_${startYear}_${i}_margin_dn_ae`)).toFixed(3);
    const upperMarginAe = parseFloat(localStorage.getItem(`result_${startYear}_${i}_margin_up_ae`)).toFixed(3);

    fuelRow.innerHTML = `
      <td>${speed}</td>
      <td>${lowerMarginMe}</td>
      <td>${upperMarginMe}</td>
      <td>${lowerMarginAe}</td>
      <td>${upperMarginAe}</td>
    `;
    fuelConsumptionTable.appendChild(fuelRow);

    // Populate CII Grade Table
    const ciiRow = document.createElement('tr');
    ciiRow.innerHTML = `<td>${speed}</td>`;
    
    for (let year = startYear; year <= endYear; year++) {
      const ciiGrade = localStorage.getItem(`result_${year}_${i}_cii_grade`);
      const ciiCell = document.createElement('td');
      ciiCell.textContent = ciiGrade;
      ciiRow.appendChild(ciiCell);
    }
    
    ciiGradeTable.appendChild(ciiRow);
  }
}


