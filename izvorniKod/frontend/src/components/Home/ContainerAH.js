import React, {useState}from "react"
import { Link,useNavigate } from "react-router-dom";
import Transactions from "../Transactions/Transactions";
import moment from 'moment';
//import Transactions from "../Transactions/Transactions"; 



const ContainerAH = (props) =>{
   const navigate= new useNavigate();
   var string="";
   let list=[];
    const deleteUser=async (email)=>{
        fetch('/api/admin/delete', {
          method: 'POST',
          headers:{
            'Content-Type':'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({token: localStorage.getItem("token"),email:email})
          }).then(function(response) {
            if (response.status === 401) {
              return;
            } else { 
                var elem = document.getElementById(email);
                elem.parentNode.removeChild(elem);
            }
         })
      }


      const goToTransactions=async (email)=>{
        fetch('/api/admin/tickets',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          credentials:'same-origin',
          body: JSON.stringify({token: localStorage.getItem("token"),email:email}),
        }).then(function(response) {         
          if (response.status === 401) {
            window.location = "/"
            return;
          } else { 
            return response.json();}
        }).then(data=>{
              try{
                for(var i=0;i<data.tickets.length;i++){
                  list[i]={
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
                navigate('/transactions', {state:list}) 
                  
              }catch{
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
            <span style={{fontSize:20}}><button style={{fontSize:20}} className="buttonAH" onClick={() => deleteUser(props.email)} >Izbriši</button></span>
            <span ><button style={{fontSize:20}} className="buttonAH" onClick={()=>goToTransactions(props.email)}> Transakcije </button></span>
            </h5>
        </div>
    )
}

export default ContainerAH;
