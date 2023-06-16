let chai = require("chai");


let assert = chai .assert;

let validateEmail= function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

WagonPosition = {
    Front:0,
    Back:1
}

let calculatePosition= function(measurements) {
    var load = []
    var differences = []
    for(var i in measurements) {
        let frontLoad = measurements[i][0]
        let backLoad = measurements[i][1]
        load[Number(i)-1] = frontLoad + backLoad
        differences[Number(i)-1] = backLoad - frontLoad
    }
    let difPrior = false
    differences.forEach(dif => {if (Math.abs(dif) > 30) {difPrior = true}})
    let wagon
    let wagonPosition
    if (difPrior) {
        var maxDif = differences.reduce(function(a, b) {
            let max = Math.max(Math.abs(a), Math.abs(b));
            if(max == Math.abs(a)) {
                return a
            } else {
                return b
            }
        }, 0);
        var indexDif = differences.indexOf(maxDif)

        wagon = indexDif + 1
        if (differences[indexDif] > 0) {
            wagonPosition = WagonPosition.Front
        } else {
            wagonPosition = WagonPosition.Back
        }
    } else {
        var minLoad = Math.min(...load)
        var indexLoad = load.indexOf(minLoad)
        wagon = indexLoad + 1
        if (differences[indexLoad] > 0) {
            wagonPosition = WagonPosition.Front
        } else {
            wagonPosition = WagonPosition.Back
        }
    }
    
    measurements[String(wagon)][wagonPosition == WagonPosition.Front ? 0 : 1] += 1
    return new Position(wagon, wagonPosition, measurements)
}



class Position{
wagon;
wagonPosition;
measurements;

constructor(wagon, wagonPosition, measurements) {
    this.wagon = wagon;
    this.wagonPosition = wagonPosition
    this.measurements = measurements
}
}

describe("Ispitivanje komponenti: ",function(){

    describe("Ispitivanje funkcije za validaciju e-maila: ",function(){
    it("Validacija e-maila sa ulazom u okviru dozvoljenih znakova",function(){
        let email = "IspravanEmail123@email.com"
        assert.equal(true,validateEmail(email));
    })

    it("Validacija e-maila sa zabranjenim znakovima",function(){
        let email = "@email.com"
        let zabranjeniSimboli=["<",">","(",")","[","]","\\",".",",",";",":"," ","@","\""];
        for (let i = 0; i < zabranjeniSimboli.length; i++) {

            let simbol = zabranjeniSimboli[i];
            assert.equal(false,validateEmail(simbol+email));
            
        }
    })

    it("Validacija e-maila bez znaka @ , točke u domeni, samo jednim znakon nakon točke ili brojevima nakon točke",function(){
        let email = "NeispravanEmail.com";
        assert.equal(false,validateEmail(email));
        email = "NeispravanEmail@domena";
        assert.equal(false,validateEmail(email));
        email = "NeispravanEmail@domena.a"
        assert.equal(false,validateEmail(email));
        email = "NeispravanEmail@domena.123";
        assert.equal(false,validateEmail(email));
    })
    })
    describe("Ispitivanje funkcije za kalkulaciju pozicije: ",function(){
    
    it("Kalkulacija pozicije s ispravnim podacima",function(){
        let measurements = {"1":[10,9],"2":[12,23],"3":[6,0],"4":[2,9]}
        let position = calculatePosition(measurements);
        assert.equal(3,position.wagon);
        assert.equal(1,position.wagonPosition);
    })

    it("Kalkulacija pozicije s vlakom bez putnika",function(){
        let measurements = {"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0]}
        let position = calculatePosition(measurements);
        assert.equal(1,position.wagon);
        assert.equal(1,position.wagonPosition);
    })
    
    it("Kalkulacija pozicije s razlikom putnika većom od 30 u jednom vagonu",function(){
        let measurements = {"1":[0,30],"2":[20,24],"3":[15,20],"4":[18,26]}
        let position = calculatePosition(measurements);
        assert.equal(1,position.wagon);
        assert.equal(0,position.wagonPosition);
    })

    it("Kalkulacija pozicije s razlikom putnika većom od 30 u više vagona",function(){
        let measurements = {"1":[30,0],"2":[60,94],"3":[31,58],"4":[50,73]}
        let position = calculatePosition(measurements);
        assert.equal(2,position.wagon);
        assert.equal(0,position.wagonPosition);
    })
  
    it("Kalkulacija pozicije s neispravnim podacima",function(){
        let measurements = {"1":"Krivi podatak","2":"Krivi podatak","3":"Krivi podatak","4":"Krivi podatak"}
        try {
            let position = calculatePosition(measurements);
        } catch (error) {
            assert.equal(error.constructor===TypeError,true);
        }
    })

    
})
})