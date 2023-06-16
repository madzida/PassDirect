/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect
} from 'react'
import Header2 from "../Header/Header2";
import {
  useNavigate
} from "react-router-dom";
import moment from 'moment';

let list = [];

function AdminHome() {
  //const [users, setUsers] = React.useState();
  const navigate = useNavigate();

  function ContainerAH(props, navigate) {
    var string = "";
    let list = [];
    const deleteUserConfirm= (email) =>{
      if (window.confirm("Želite li zaista obrisati korisnika?")) {
        deleteUser(email)
      }
    }


    const deleteUser = async (email) => {
      //window.confirm("Želite li zaista obrisati korisnika?");
      fetch('/api/admin/delete', {
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


    const goToTransactions = async (email) => {
      fetch('/api/admin/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          email: email
        }),
      }).then(function (response) {
        if (response.status === 401) {
          window.location = "/"
          return;
        } else {
          return response.json();
        }
      }).then(data => {
        try {
          for (var i = 0; i < data.tickets.length; i++) {
            list[i] = {
              ticketId: data.tickets[i].id,
              firstName: data.tickets[i].passengerName,
              lastName: data.tickets[i].passengerSurname,
              travelDate: moment(data.tickets[i].travelDate).format("DD-MM-YYYY"),
              departureStation: data.tickets[i].journey.departureStationName,
              arrivalStation: data.tickets[i].journey.arrivalStationName,
              price: data.tickets[i].journey.price
            }
          }
          console.log(list);
          navigate('/transactions', {
            state: list
          })

        } catch {
          console.log("NE PROLAZI")
        }
      });
    }

    return ( 
      <div id={props.email}>
        <h5 className="containerAH">
          <span style={{fontSize:20}}>{props.firstName}  {props.lastName} </span>
          <span style={{fontSize:20}} >{props.email}</span>
          <span style={{fontSize:20}} >{props.role}</span>
          <span style={{fontSize:20}}>{props.dateoflogin.toLocaleDateString("en-US")}</span>
          <span style={{fontSize:20}}><button style={{fontSize:20}} className="buttonAH" onClick={() => deleteUserConfirm(props.email)} >Izbriši</button></span>
          <span ><button style={{fontSize:20}} className="buttonAH" onClick={()=>goToTransactions(props.email)}> Transakcije </button></span>
          </h5>
      </div>
    )
  }

  const [users, setUsers] = useState({
    list: [{
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      dateoflogin: new Date()
    }]
  });


  useEffect(async () => {
    await (fetch('/api/users', {
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
        for (var i = 0; i < data.users.length; i++) {
          list[i] = {
            firstName: data.users[i].firstName,
            lastName: data.users[i].lastName,
            email: data.users[i].email,
            role: data.users[i].role,
            dateoflogin: new Date(data.users[i].created_date)
          }
        }
        setUsers({
          list: list
        });
        console.log("useri" + users.list);
      } catch {
        console.log(data)
      }

    });
  }, [])

  return ( 
    <div>
      <div><Header2/></div>
      <div >
        <div >
          <h1 className="title">Popis korisnika</h1>
          <h5 className="containerAH"><span>Ime i prezime</span><span>E-mail</span><span>Uloga</span><span>Datum prijave</span><span>Brisanje korisnika</span><span>Pregled transakcija</span></h5>
          <hr />
          {users.list.map(t=>ContainerAH(t, navigate))} 
        </div>
      </div>
    </div>
    );
  }

  export default AdminHome;
