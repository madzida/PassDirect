import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import validation from './validation';
function SignupForm(props) {
  const [values,setValues]=useState({
    firstname:"",
    lastname:"",
    email:"",
    password:"",
    confirmpassword:""
  });
  let token="";
  const [errors,setErrors]=useState({});
  const [error1,setError1]=useState({msg:""});
  const [error2,setError2]=useState({msg:""});
  const [error3,setError3]=useState({msg:""});
  const [dataIsCorrect,setDataIsCorrect]=useState(false);
  const handleFormSubmit=(e)=>{
    e.preventDefault();
    setError1("");
    setError2("");
    setError3("");
    fetch('/api/signup', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(values)
    }).then(function(response) {
        return response.json();
    }).then(data=>{
      try{
        if(data.err1){
          setError1({msg:data.err1})
        }else if(data.err2){
          setError2({msg:data.err2})
        }else if(data.err3){
          setError3({msg:data.err3})
        }else{
        setDataIsCorrect(true); 
        localStorage.setItem("token", data.token)
        window.location.href = "/";}}
       catch{
         console.log(data)
       }
       
    });
    setErrors(validation(values));
  }  
  useEffect(async()=>{
    if(Object.keys(errors).length ===0 && dataIsCorrect){
      props.submitForm(true);
    }
  },[errors]);

  const handleChange=(e)=>{
    setValues({
      ...values,
      [e.target.name]:e.target.value,});
  };
  return (<div className="container"><div className="app-wrapper">
    <div>
      <h2 className="title">Registracija</h2>
    </div>
    <form className="form-wrapper">
      <div className="name">
        <label className="label">Ime</label>
        <input 
        className="input" 
        name="firstname" 
        type="text" 
        value={values.firstname}
        onChange={handleChange}/>
        {errors.firstname && <p className="error">{errors.firstname}</p>}
      </div>
      <div className="name">
        <label className="label">Prezime</label>
        <input 
        className="input" 
        name="lastname" 
        type="text" 
        value={values.lastname}
        onChange={handleChange}/>
        {errors.lastname && <p className="error">{errors.lastname}</p>}
      </div>
      <div className="email">
        <label className="label">E-mail</label>
        <input 
        className="input" 
        type="email" 
        name="email" 
        value={values.email}
        onChange={handleChange}/>
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <div className="password">
        <label className="label">Lozinka</label>
        <input 
        className="input" 
        type="password" 
        name="password" 
        value={values.password}
        onChange={handleChange}/>
        {errors.password && <p className="error">{errors.password}</p>}
      </div>
      <div className="password">
        <label className="label">Potvrda lozinke</label>
        <input 
        className="input" 
        type="password" 
        name="confirmpassword" 
        value={values.confirmpassword}
        onChange={handleChange}/>
        {error1.msg && <p className="error">{error1.msg}</p>}
        {error2.msg && <p className="error">{error2.msg}</p>}
        {error3.msg && <p className="error">{error3.msg}</p>}
        {/* {errors.confirmpassword && <p className="error">{errors.confirmpassword}</p>} */}
      </div>
      <div>
        <button className="submit" onClick={handleFormSubmit}>Registriraj se
        </button>
      </div>
    </form>
  </div>
  </div>);
}
export default SignupForm;