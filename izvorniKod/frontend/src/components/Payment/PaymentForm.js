import React, { useEffect, useState } from 'react';
/* eslint-disable react-hooks/exhaustive-deps */
import validation from './Validation';
import { useLocation } from 'react-router';
import Cleave from 'cleave.js/react';
const PaymentForm = (props) => {
  const location = useLocation();
  let idtrainroute=location.state.IdTrainRoute;
  let price=location.state.price;
  let idjourney=location.state.IdJourney;
  let traveldate=location.state.travelDate;
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    IdTrainRoute: "",
    IdJourney: "", 
    price: "",
    cardNo: "",
    CVV: "",
    expDate: "",
    travelDate: ""
  });

  // AUTOFILL
  useEffect(async () => {
    await (fetch('/api/autofill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({ token: localStorage.getItem("token") })
    }))
      .then(function (response) {
        if (response.status === 401) {
          window.location = "/"
          return;
        } else {
          return response.json();
        }
      }).then(data => {
        try {
          setValues({            
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            IdTrainRoute: idtrainroute,
            IdJourney: idjourney, 
            price: price,
            travelDate:traveldate
          })
        }
        catch {
          console.log(data)
        }

      });
  }, [])


  const [errors, setErrors] = useState({});
  const [error1, setError1] = useState({ msg: "" });
  const [error2, setError2] = useState({ msg: "" });
  const [error3, setError3] = useState({ msg: "" });
  const [dataIsCorrect, setDataIsCorrect] = useState(false);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors("")
    setErrors(validation(values));
    console.log(Object.keys(errors).length)
    console.log(document.getElementById('cardNo').value.length===19)
    console.log(document.getElementById('CVV').value.length===3)
    console.log(values.expDate!=undefined)
    if(document.getElementById('cardNo').value.length===19 && document.getElementById('CVV').value.length===3 && values.expDate!=undefined){
      console.log("badhjb")
      fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({token: localStorage.getItem("token"),firstname:values.firstName,lastname:values.lastName,email:values.email,journeyId:values.IdJourney,cardNo:values.cardNo,CVV:values.CVV,expDate:values.expDate,travelDate:values.travelDate})
      }).then(function (response) {
          return (response);
      }).then(data=>{
        if(data.status===200){
          window.location.href="/successful"
        }
      })
    }
  }
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  return (<div className="container"><div className="app-wrapper">
    <div>
      <h2 className="title">PLAĆANJE</h2>
    </div>
    <form  className="form-wrapper">
      <div className="price">
        <label className="label" name="price" type="text" value={values.price}>Cijena: {values.price} KN</label>
      </div>
      <div className="buyer-details">
        <h2 className="label2">Podatci o kupcu</h2>
        <div className="firstName">
          <label  className="label">Ime: </label>
          <input className="input" name="firstName" type="text" value={values.firstName} onChange={handleChange} />
          {errors.firstname && <p className="error">{errors.firstName}</p>}
        </div>
        <div className="lastName">
          <label  className="label">Prezime: </label>
          <input className="input" name="lastName" type="text" value={values.lastName} onChange={handleChange} />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div className="firstName">
          <label  className="label">E-mail: </label>
          <input className="input" name="email" type="text" value={values.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
      </div>

      <div className="card-details">
        <h2 className="label2">Kartični podatci</h2>
        <div className="cardNo">
        <label className="label">Broj kartice: </label>
        <Cleave id="cardNo" placeholder=" xxxx xxxx xxxx xxxx" className="input"  name="cardNo" value={values.cardNo} options={{blocks: [4,4,4,4],delimiter: ' ', numericOnly: true}} onChange={handleChange} />
{/*           <label className="label">Broj kartice: </label>
          < input type="tel" inputMode="numeric" pattern="[0-9\s]{13,19}" autocomplete="cc-number" maxlength="19" placeholder=" xxxx xxxx xxxx xxxx"
            className="input" name="cardNo" value={values.cardNo} onChange={handleChange} /> */}
          {errors.cardNo && <p className="error">{errors.cardNo}</p>}
        </div>
        <div className="CVV">
          <label className="label">CVV broj: </label>
          <Cleave id="CVV" placeholder=" xxx"   options={{ blocks: [3], numericOnly: true }}
            className="input" name="CVV" value={values.CVV} onChange={handleChange} />
          {errors.CVV && <p className="error">{errors.CVV}</p>}
        </div>
        <div className="expDate">
          <label className="label">Datum isteka: </label>
          <input  className="input" id="expDate" name="expDate" type="month" min="2022-01" placeholder="MM , YY" value={values.expDate} onChange={handleChange} />
          {errors.expDate && <p className="error">{errors.expDate}</p>}
        </div>
      </div>
      <div>
        <button type="submit" className="submit" onClick={handleFormSubmit}>Kupi Kartu
        </button>
      </div>
    </form>
  </div>
  </div>);
}
export default PaymentForm;