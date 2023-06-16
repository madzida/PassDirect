
import React,{useEffect} from 'react';
import { useNavigate } from 'react-router';
import Header3 from "../Header/Header3";


const SuccesfullPayment = () => {

/*   useEffect(async () => {
    await (fetch('/api/autofill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({ token: localStorage.getItem("token") }),
    }).then(function(response){
      return(response)
    }))});
    const navigate=useNavigate(); */

    const backToHome= async (e)=> {
      window.location.href="/"
    }
 
  return (
    <div>
  <div className="container"><div className="app-wrapper">    
  <div><Header3 /></div>
    <div>
      <h1 style={{marginTop:250}} className="title">Uspješno plaćanje!</h1>
      
    </div>

    <div name="back-to-home">
        <button className='button-succesful' onClick={backToHome}>Povratak na početnu stranicu</button>
    </div>

    </div>
    </div>
    </div>
  )
}
export default SuccesfullPayment;