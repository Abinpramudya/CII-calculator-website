function FOC_AE_port(pae_port,focae){
    var_foc_aeport = pae_port*focae/1000
    return var_foc_aeport
}

var pae_port = pae_port
var focae = focae

var_foc_aeport = FOC_AE_port(pae_port,focae)
console.log('hasil var_foc_aeport =',var_foc_aeport)

function FOC_AE_sail(pae_sail,focae){
    var_foc_sail = pae_sail*focae/1000
    return var_foc_sail
}

var pae_sail = pae_sail
var focae = focae

var_foc_sail = FOC_AE_sail(pae_sail,focae)
console.log('sail var_foc_aesail =',var_foc_sail)

function ME_sailing_FOCMDO(kgfoc,distance){
    var_foc_sail = kgfoc/890*distance/vs*1000*2
    return var_foc_sail
}

var kgfoc = kgfoc
var distance = distance
var vs = Vs

var_foc_sail = ME_sailing_FOCMDO(kgfoc,distance)
console.log('hasil var_foc_sail =',var_foc_sail) 

function ME_sailing_FOCHFO(kgfoc,distance){
    var_foc_sail = kgfoc/910*distance/vs*1000*2
    return var_foc_sail
}

var kgfoc = kgfoc
var distance = distance
var vs = Vs

var_foc_sail = ME_sailing_FOCHFO(kgfoc,distance)
console.log('hasil var_foc_sail =',var_foc_sail)

function AE_port(var_foc_aeport,Time1,Time2,Time3){
    var_AE_port = var_foc_aeport/890*Time1+Time2+Time3*1000
    return var_AE_port
}

var var_foc_aeport = var_foc_aeport
var Time1 = Time1
var Time2 = Time2
var Time3 = Time3

var_AE_port = AE_port(var_foc_aeport,Time1,Time2,Time3)
console.log('hasil var_AE_port =',var_AE_port)

function estimation_MNV(pme,focae,manuver1,manuver2,manuver3){
    var_estimation_MNV = (((pme*20/100)*focae)/890)*(manuver1+manuver2+manuver3)*1000/1000
    return var_estimation_MNV
}

var pme = pme
var focae = focae
var manuver1 = manuver1
var manuver2 = manuver2
var manuver3 = manuver3

var_estimation_MNV = estimation_MNV(pme,focae,manuver1,manuver2,manuver3)
console.log('hasil var_estimation_MNV =',var_estimation_MNV)