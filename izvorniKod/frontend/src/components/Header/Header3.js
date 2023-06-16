import React,{useState,useEffect} from 'react';
import {Link,withRouter} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Login from '../Login/Login';

const Header3 =()=>{

  const onLogout=()=>{
    localStorage.clear();
  }
  return(

    <nav>
      <div className="home-wrapper">
      <Link to="/" className="linkNoUnderline"><div className="title2"><img src="../../../logo_transparent.png" height="70" width="70"/><span className="margin">PassDirect</span></div></Link>
      <div className="right-align">
      <Link to="/login"><button className="button" onClick={onLogout}>Odjava</button></Link>
      </div>
      </div>
    </nav>
  );
};
export default Header3;