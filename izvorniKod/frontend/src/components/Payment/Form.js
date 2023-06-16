import React, { useState } from 'react';
import PaymentForm from "./PaymentForm";
import  { Navigate } from 'react-router-dom';
const Form=()=>{
  const[formIsSubmitted,setFormIsSubmitted]=useState(false);
  const submitForm=()=>{
    setFormIsSubmitted(true);
  }
  return (<div>
    {!formIsSubmitted ? <PaymentForm submitForm={submitForm} />:<Navigate to={"/home"}/>}
  </div>);
}
export default Form;