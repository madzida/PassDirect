
var i;
// eslint-disable-next-line no-new-wrappers
const string = new String();
string.charCodeAt()
const l = ['č','ć','Č','Ć','š','Š','ž','Ž','đ','Đ','Dž','dž']
 
const validation=(values)=>{
    let errors ={};
    if(!values.firstName){
      errors.firstName="Potrebno je unijeti ime";
    }else if (values.firstName.length<2){
      errors.firstName="Uneseno ime mora sadržavati barem 2 slova";
    }
    if(!values.lastName){
      errors.lastName="Potrebno je unijeti prezime";
    }else if(values.lastName.length<2){
      errors.lastName="Uneseno prezime mora sadržavati barem 2 slova";
    }
    if(!values.email){
      errors.email="Potrebno je unijeti e-mail";
    }else if(!/.+@.+/.test(values.email)){
      errors.email="E-mail je neispravan";
    }
    if(!values.cardNo){
      errors.cardNo="Potrebno je unijeti broj kartice!";
    }
    else if (values.cardNo.length!==19){
      errors.cardNo="Broj kartice mora imati 16 znamenki!";
    }
    if(!values.CVV ){
      errors.CVV="Potrebno je unijeti CVV broj!";
    }else if(values.CVV.length!==3){
      errors.CVV="Unesen CVV broj mora imati 3 znamenke!";
    }
    if(!values.expDate){
      errors.expDate="Potrebno je odabrati datum isteka kartice!";
    }
    for( i in values.CVV){
      if( values.CVV.charCodeAt(i)<48 || values.CVV.charCodeAt(i)>57){
        errors.CVV="CVV sadrži samo znamenke!";
      }
    }
    for( i in values.cardNo){
      if( values.cardNo.charCodeAt(i)<48 || values.cardNo.charCodeAt(i)>57 ){
        if(values.cardNo.charCodeAt(i)!==32){
        errors.cardNo="Broj kartice sadrži samo znamenke!";
        }
      }
    }
    for( i in values.firstName){
      if(!((values.firstName.charCodeAt(i)>64 && values.firstName.charCodeAt(i)<91)||(values.firstName.charCodeAt(i)>96 && values.firstName.charCodeAt(i)<123))){
        console.log(values.firstName.charAt(i));  
        if( (values.firstName.charAt(i) in l)){
            errors.firstName="Ime sadrži samo slova!";
        }
      }
    }
    for( i in values.lastName){
      if( !((values.lastName.charCodeAt(i)>64 && values.lastName.charCodeAt(i)<91)||(values.lastName.charCodeAt(i)>96 && values.lastName.charCodeAt(i)<123))){
        if((values.lastName.charAt(i) in l)){
          errors.lastName="Prezime sadrži samo slova!";
      }
    }
  }
       
    return errors;
  }
  export default validation;