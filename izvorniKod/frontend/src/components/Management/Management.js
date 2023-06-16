/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useState,
    useEffect
  } from 'react'
  import Header from "../Header/Header";
  import {
    useNavigate, Link
  } from "react-router-dom";
  import moment from 'moment';
  
  let list = [];
  
  function Management() {
    //const [users, setUsers] = React.useState();
    const navigate = useNavigate();
  
    function ContainerMG(props, navigate) {
      var string = "";
      let list = [];
      const deleteUserConfirm= (email) =>{
        if (window.confirm("Želite li zaista obrisati račun?")) {
          deleteUser(email);
          //localStorage.clear();
          window.location.href='/login';
        }
      }
  
  
      const deleteUser = async (email) => {
        //window.confirm("Želite li zaista obrisati korisnika?");
        fetch('/api/settings/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            email: email
          })
        }).then(function (response) {
          if (response.status === 401) {
            return;
          } else {
            var elem = document.getElementById(email);
            elem.parentNode.removeChild(elem);
          }
        })
      }
  
  
      
  
      return ( 
        <div id={props.email}>
          <h5 className="containerT">
            <div>
            <span style={{fontSize:20}}>{props.firstName}  {props.lastName} </span>
            </div>
            <div>
            <span style={{fontSize:20}} >{props.email}</span>
            </div>
            <div>
            <span style={{fontSize:20}} >{props.role}</span>
            </div>
            <div>
            <span style={{fontSize:20}}>{props.dateoflogin.toLocaleDateString()}</span>
            </div>
            <div>
            <span style={{fontSize:20}}><button style={{fontSize:20}} className="button-succesful" onClick={() => deleteUserConfirm(props.email)} >Izbriši svoj račun</button></span>
            </div>
            </h5>
        </div>
      )
    }
  
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        dateoflogin: new Date()
    });
  
  
    useEffect(async () => {
      await (fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          token: localStorage.getItem("token")
        })
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
          setUser({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            role: data.user.role,
            dateoflogin: new Date(data.user.created_date)
          });
          
        } catch {
          console.log(data)
        }
  
      });
    }, [])
  
    return ( 
      <div>
        <div><Header/></div>
        <div >
          <div >
            <h1 className="title">Upravljanje računom</h1>
            <h5 className="containerT"><span>Ime i prezime</span><span>E-mail</span><span>Uloga</span><span>Datum prijave</span><span>Brisanje računa</span></h5>
            <hr />
            {ContainerMG(user, navigate)} 
          </div>
        </div>
      </div>
      );
    }
  
    export default Management;
  