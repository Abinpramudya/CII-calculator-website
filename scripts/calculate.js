// script.js
function reynoldnumber(Vs, LWL) {
  Vs = Vs * 0.5144;

  var rey = (Vs * LWL) / 0.00000093713; 
  return rey;
}

function coefficientfriction(rey){
  cf = 0.075 / (Math.log10(rey) - 2) ** 2;
  return cf
}

function froudenumber(Vs,LWL){
  Vs = Vs * 0.5144;
  const g = 9.81; // m/s^2
  return Vs / Math.sqrt(g * LWL);
}

function coefficientblock_cal(froude_number){
  return 0.7 + (1 / 8) * Math.atan((23 - 100 * froude_number) / 4);
}

function shapecoef_cal(LoS,LWL,LPP,cb,B,T,TA,TF,Dprop,Nrudder){
  Nbracket = Nrudder
  Nbossing = Nrudder

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

  k = s0 + (s1 * (LoS / LWL)) + (s2 * (LWL / LPP)) + (s3 * cb) + (s4 * (LPP / B)) +
      (s5 * (B / T)) + (s6 * (LPP/T)) + (s7 * ((TA - TF) / LPP)) + (s8 *(Dprop / T)) +
      (Krudder * Nrudder) + (Kbracket * Nbracket) + (Kbossing * Nbossing)

  return k
}

function wetsurface_cal(LPP,B,T,shapecoef){
  return shapecoef * LPP * (B+(2*T))
}

function resistancefriction_cal(cf,p,s,v){
  v = v * 0.5144
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
    c1 = fn / fcrit
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
  console.log('e1',e1)
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
  ratio = B/T

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
  ratio = LPP/B

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

  ratio = LoS / LWL

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

  ratio = LWL / LPP

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

  ratio = D/TA

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
  Nthruster = 1
  Nbracket = Nrudder
  Nbossing = Nrudder

  
  return crstd * kfr * lengthfactor * beamdraft * lengthbeam * wettedratio * aftoverhang * trimcorrection *
         propellerfactor * (Nrudder ^ a7) * (Nbracket^a8) * (Nbossing ^ a9) * (Nthruster ^ a10)
}

function resistanceresidual_cal(coefficientresidual,p,vs,B,T){
  vs = vs * 0.5144
  
  return coefficientresidual * ((p/2)*(vs**2)) *((B*T)/10) / 1000

}

function resistancetotal_cal(resistancefriction,resistanceresidual){
  return resistancefriction + resistanceresidual
}

function Ppropel_cal(resistancetotal,Vs){
  Vs = Vs * 0.5144

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
  ratio = 0.75
  return pme * ratio
}

function route_def(route){
  docking = 30
  days = 365
  avail = days - docking

  //SUB-WIN-DIL-SUB
  if (route === 1){
    var distance = 1630	
    var sailingTime = 118.1	
    var Time1 = 30.9
    var Time2 = 51.8
    var Time3 = 41.8
    var manuver1 = 9.4
    var manuver2 = 2.3
    var manuver3 = 2.6
    var totalsail = 256.9
    var maxvoyage = 32
  }

  // if (route === 2){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 3){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 4){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 5){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 6){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 7){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 8){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 9){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 10){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  // if (route === 11){
  //   distance =
  //   sailingTime =
  //   Time1 =
  //   Time2 =
  //   Time3 =
  //   manuver1 =
  //   manuver2 =
  //   manuver3 =
  //   totalsail =
  //   maxvoyage =
  // }
  

}
function FinalFO_cal(name, vesselType, LOA, LPP, LWL, LoS, B, T, H,Vs, Dprop, Nrudder, Nthruster, Nrudder, TA, TF, pme, sfoc, rpm, pservice){
  var reynold_number = reynoldnumber(Vs,LWL);
  var cf_number = coefficientfriction(reynold_number);
  var froude_number = froudenumber(Vs,LWL);
  var coefficientblock = coefficientblock_cal(froude_number)
  var shapecoef = shapecoef_cal(LoS,LWL,LPP,coefficientblock,B,T,TA,TF,Dprop,Nrudder)
  var wetsurface = wetsurface_cal(LPP,B,T,shapecoef)
  var resistancefriction = resistancefriction_cal(cf_number,1025,wetsurface,Vs)
  var crstd = coefficientFrictionResidual_cal(froude_number,coefficientblock,Nrudder)
  var fcrit = fcrit_cal(Nrudder, coefficientblock)
  var kfr = kfr_cal(fcrit,froude_number)
  var lengthfactor = lengthfactor_cal(LPP,Nrudder)
  var Beamdraft= beamdraft_cal(B,T,Nrudder)
  var lengthbeam=lengthbeam_cal(LPP,B,Nrudder)
  var wettedratio = wettedratio_cal(LoS,LWL,Nrudder)
  var aftoverhang = aftoverhang_cal(LWL,LPP,Nrudder)
  var trimcorrection = trimcorrection_cal(TA,TF,Nrudder,LPP)
  var propellerfactor = propellerfactor_cal(Dprop,TA,Nrudder)
  var coefficientresidual = coefresidual_cal(Nthruster,Nrudder,crstd,kfr,
                                             lengthfactor,Beamdraft,lengthbeam,
                                             wettedratio,aftoverhang,trimcorrection,
                                             propellerfactor)
  var resistanceresidual = resistanceresidual_cal(coefficientresidual,1025,Vs,B,T)
  var resistancetotal = resistancetotal_cal(resistancefriction,resistanceresidual)
  var power_propel = Ppropel_cal(resistancetotal,Vs)
  var propeff = propeff_cal(LPP,rpm)
  var totalpower = totalpower_cal(propeff,power_propel)
  var noe = NoE_cal(totalpower,pme)
  var el = EL_cal(totalpower,pme)
  var sfocrel = SFOCrel_cal(el)
  var Sfoc = SFOC_cal(sfocrel,sfoc)
  var FOC = FOC_cal(pme)

  
  var gfoc = FOC * Sfoc
  var kgfoc = gfoc / 1000
  var tfoc = gfoc / 1000000
  var LFO = tfoc / 0.991
  var MDO = tfoc / 0.89


  //logging
  console.log('reynold_number:',reynold_number)
  console.log('cf_number:',cf_number)
  console.log('froude_number:',froude_number)
  console.log('coefficient block:',coefficientblock)
  console.log('shape coeff:',shapecoef)
  console.log('wetsurface',wetsurface)
  console.log('resistance friction:',resistancefriction)
  console.log('coefficient friction:',crstd)
  console.log('fcrit:',fcrit)
  console.log("high froude number factor:",kfr)
  console.log('lengthfactor:',lengthfactor)
  console.log('beamdraft ratio factor:',Beamdraft)
  console.log('length beam:',lengthbeam)
  console.log('wetted ratio:',wettedratio)
  console.log('aft overhang ratio:',aftoverhang)
  console.log('trim correction:', trimcorrection)
  console.log('propeller factor',propellerfactor)
  console.log('coefficient residual:',coefficientresidual)
  console.log('resistance residual:',resistanceresidual)
  console.log('resistance total:',resistancetotal)
  console.log('power propeller:',power_propel)
  console.log('propeller efficiency:',propeff)
  console.log('total power:',totalpower)
  console.log('NoE:',noe)
  console.log('EL:',el)
  console.log('sfoc relative:',sfocrel)
  console.log('sfoc calculation:',Sfoc)
  console.log('FOC :',FOC)
  console.log("gfoc:", gfoc);
  console.log("kgfoc:", kgfoc);
  console.log("tfoc:", tfoc);
  console.log("LFO:", LFO);
  console.log("MDO:", MDO);


  // Store the values in local storage
localStorage.setItem('reynold_number', reynold_number);
localStorage.setItem('cf_number', cf_number);
localStorage.setItem('froude_number', froude_number);
localStorage.setItem('coefficientblock', coefficientblock);
localStorage.setItem('shapecoef', shapecoef);
localStorage.setItem('wetsurface', wetsurface);
localStorage.setItem('resistancefriction', resistancefriction);
localStorage.setItem('crstd', crstd);
localStorage.setItem('fcrit', fcrit);
localStorage.setItem('kfr', kfr);
localStorage.setItem('lengthfactor', lengthfactor);
localStorage.setItem('Beamdraft', Beamdraft);
localStorage.setItem('lengthbeam', lengthbeam);
localStorage.setItem('wettedratio', wettedratio);
localStorage.setItem('aftoverhang', aftoverhang);
localStorage.setItem('trimcorrection', trimcorrection);
localStorage.setItem('propellerfactor', propellerfactor);
localStorage.setItem('coefficientresidual', coefficientresidual);
localStorage.setItem('resistanceresidual', resistanceresidual);
localStorage.setItem('resistancetotal', resistancetotal);
localStorage.setItem('power_propel', power_propel);
localStorage.setItem('propeff', propeff);
localStorage.setItem('totalpower', totalpower);
localStorage.setItem('noe', noe);
localStorage.setItem('el', el);
localStorage.setItem('sfocrel', sfocrel);
localStorage.setItem('Sfoc', Sfoc);
localStorage.setItem('FOC', FOC);
localStorage.setItem('gfoc', gfoc);
localStorage.setItem('kgfoc', kgfoc);
localStorage.setItem('tfoc', tfoc);
localStorage.setItem('LFO', LFO);
localStorage.setItem('MDO', MDO);
}

function getForm(){
  event.preventDefault();
  const shipData = document.getElementById("ship-data-form")
  const MachineryData = document.getElementById("machinery-data-form")
  const RouteData = document.getElementById("route-selection-form")

  // Reading input values using JavaScript
  const Name = shipData.querySelector('input[name="Vessel-Name"]').value;
  const VesselType = shipData.querySelector('select[name="vessel-type"]').value;
  const LOA = parseFloat(shipData.querySelector('input[name="LOA"]').value);
  const LPP = parseFloat(shipData.querySelector('input[name="LPP"]').value);
  const LWL = LPP * 1.035
  const LoS = parseFloat(shipData.querySelector('input[name="LoS"]').value);
  const B = parseFloat(shipData.querySelector('input[name="B"]').value);
  const T = parseFloat(shipData.querySelector('input[name="T"]').value);
  const H = parseFloat(shipData.querySelector('input[name="H"]').value);
  const DWT = parseFloat(shipData.querySelector('input[name="DWT"]').value);
  const Vs = parseFloat(shipData.querySelector('input[name="Vs"]').value);
  const Dprop = parseFloat(shipData.querySelector('input[name="Dprop"]').value);
  const Nrudder = parseFloat(shipData.querySelector('input[name="Nrudder"]').value);
  const Nthruster = parseFloat(shipData.querySelector('input[name="Nthruster"]').value);
  const TA = parseFloat(shipData.querySelector('input[name="TA"]').value);
  const TF = parseFloat(shipData.querySelector('input[name="TF"]').value);
  
  const pme = parseFloat(MachineryData.querySelector('input[name="Pme"]').value);
  const sfoc = parseFloat(MachineryData.querySelector('input[name="SFOC"]').value);
  const rpm = parseFloat(MachineryData.querySelector('input[name="RPM"]').value);
  const Pservice = parseFloat(MachineryData.querySelector('input[name="Pservice"]').value);

  // const route = RouteData.querySelector('input[name="route"]').value;

  FinalFO_cal(Name,VesselType,LOA,LPP,LWL,LoS,B,T,H,Vs,Dprop,Nrudder,Nthruster,Nrudder,TA,TF,pme,sfoc,rpm,Pservice)
  window.location.href = 'results.html';
}


  //dummy values
  // const Name = "Jaladhimantri"
  // const VesselType = "General Cargo"
  // const LOA = 117
  // const LPP = 110
  // const LWL = LPP * 1.035
  // const LoS = 114
  // const B = 19.7
  // const T = 6.45
  // const H = 8.5
  // const DWT = 7664.6
  // const Displacement = 11129.6
  // const Vs = 13.8
  // const Dprop = 3.7
  // const Nrudder = 1
  // const Nthruster = 0
  // const Nrudder = 1
  // const TA = 4
  // const TF = 5

  // const pme = 3200
  // const sfoc = 182
  // const rpm = 168.717948717949
  // const Pservice = 0.75

  // route = 1

    
  // Store result in local storage
  // localStorage.setItem('reynold_number', reynold_number);
  // localStorage.setItem('cf_number',cf_number)
  // localStorage.setItem('froude_number',froude_number)