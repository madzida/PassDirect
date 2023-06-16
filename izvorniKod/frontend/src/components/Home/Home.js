import React, { useEffect, useState ,componentDidMount} from 'react';
import DatePicker from 'react-datepicker';
import Header from "../Header/Header";
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router';
import ContainerRT from "./ContainerRT";

const Home=(props)=>{
  const [values,setValues]=useState({
    from:"",
    to:"",
    date: new Date(),
  });
  let navigate = useNavigate
  let list = [];
  const [station,setStation]=useState();
  const [stations,setStations]=useState({list:[]});
  const [routes,setRoutes]=useState(list);


  async function getStationRoutes (station) {
     let response = await fetch('/api/stations',{
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({token:localStorage.getItem("token"),station: station})
    });
    if(response.status===200){
    let data = await response.json();
    console.log(data)
    setStation(station);
    let routes=[];
    for(let i=0;i<data.trainids.length;i++){
      console.log(data)
      let substr1 = data.departureTime[i].substring(0,10);
      let substr2 = data.departureTime[i].substring(11,19);
      let departureTime = substr1 + " " + substr2;
      routes[i]={
        id:data.trainids[i],
        odrediste:data.arrivalStation[i].name,
        dolazak:departureTime,
        kasnjenje:data.zastavicaZaKasnjenje[i]
      }
    }
    console.log(routes);
    setRoutes(routes);
    }
    else{
      console.log("Routes not fetched");
    } 
    
  } 

  const handleChange=(e)=>{
    setValues({
      ...values,
      [e.target.name]:e.target.value,});
  };
  const handleDate=(date)=>{
    setValues({
      ...values,
      date:date});
  };

  useEffect(async()=>{
    await(fetch('/api/', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({token: localStorage.getItem("token")})
    })).then(function(response) {
      return response.json();
    }).then(data=>{
      if(data.role == "admin"){
        window.location = "/admin"
      }
      try{
       for(var i=0;i<data.stations.length;i++){
        list[i]=data.stations[i].name;
        
       }
       setStations({list:list});}
       catch{
         console.log("test")
       }
       
    });
  },[])

  


  return (
    <div>
    <div><Header /></div>

    <div className="homeContainer">

    <div className="stationContainer">
      <h1> Stanice </h1>
      <ul className="stationList"  onChange={handleChange}>
        <div className="stationContent">
       {stations.list.map((item,i)=> <li key = {i} className="stationItem" onClick={()=>getStationRoutes(item)}> {item} </li>)}  
      </div>
      </ul>
    </div>

    <div className="routesContainer">
      <h1> Nadolazeći vlakovi:{station}</h1>
        <div>
       <ContainerRT routes={routes} ></ContainerRT>
      </div>
    </div>

    </div>

  </div>
  );
}
export default Home