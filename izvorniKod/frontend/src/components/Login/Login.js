import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
function Login(props) {
  const [error1, setError1] = React.useState({msg:''});
  const [error2, setError2] = React.useState({msg:''});
  const [values, setValues]=useState({
    email:"",
    password:""
  });
  const handleFormSubmit=(e)=>{
    e.preventDefault();
    setError1("");
    setError2("");
    fetch('/api/login', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(values)
     }).then(function(response) {
          return response.json();
      }).then(data=>{
        try{
          console.log(data)
          if(data.err1){
            setError1({msg:data.err1})
          }else if(data.err2){
            setError1({msg:data.err2})
          }else if(data.err3){
            setError1({msg:data.err3})
          }else{
            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.role)
            if(data.role == "admin"){
              window.location.href = "/admin";
            } else {
              window.location.href = "/";
            }
          }
        }
        catch{
          console.log(data)
        }
         
      });
  };
  const handleChange=(e)=>{
    setValues({
      ...values,
      [e.target.name]:e.target.value,});
  };
  console.log(props.isLoggedIn)

  return (<div className="container"><div className="app-wrapper">
    <div>
      <h2 className="title">Prijava</h2>
    </div>
    <form>
      <div className="email">
        <label className="label">E-mail</label>
        <input 
        className="input" 
        type="email" 
        name="email" 
        value={values.email}
        onChange={handleChange}/>
      </div>
      <div className="password">
        <label className="label">Lozinka</label>
        <input 
        className="input" 
        type="password" 
        name="password" 
        value={values.password}
        onChange={handleChange}/>
        {error1.msg && <p className="error">{error1.msg}</p>}
        {error2.msg && <p className="error">{error2.msg}</p>}
      </div>
      <div>
        <button className="submit" onClick={handleFormSubmit}>Prijavi se</button>
      </div>
      <div className="register-text">Ako nemate korisnički račun odite na registraciju</div>
      <div>
      <Link to={"/signup"}>
        <button className="register">Registriraj se</button>
      </Link>
      </div>
    </form>
  </div>
  </div>);
}
export default Login;