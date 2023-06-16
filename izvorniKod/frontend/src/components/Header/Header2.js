import React,{useState,useEffect} from 'react';
import {Link,withRouter,useNavigate,useLocation} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Login from '../Login/Login';
import moment from 'moment';
const Header2 =()=>{
  const history = useNavigate();
  const location = useLocation();
  let currentDate = new Date()
  currentDate.setHours(currentDate.getHours()+1)
  const [values,setValues]=useState({
    from:"",
    to:"",
    date: currentDate,
  });
  let list=[];
  let list2=[];
  let list3=[];
  const [startDate, setStartDate] = useState(currentDate);
  const [stations,setStations]=useState({list:[]});
  const handleFormSubmit=(e)=>{
    fetch('/api/timetable', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({token: localStorage.getItem("token"),departureStation:values.from,arrivalStation:values.to,travelDate:values.date})
    }).then(function(response) {
      return response.json();
    }).then(data=>{
      console.log(data.journeys)
      if(data.journeys.length===0){
        list3[0]={msg:"Nažalost, nismo našli nijednu liniju koja odgovara vašoj pretrazi."}
        history("/stationsAdmin", {state:list3});
        
      }
      else{
      for(var i=0;i<data.journeys.length;i++){
        console.log(data)
        list2[i]={
          id: data.journeys[i].journey.id,
          routeId: data.journeys[i].journey.routeId,
          trainID:data.journeys[i].trainId,
          departureStation:values.from,
          departureTime:moment.utc(data.journeys[i].journey.departureTime).format('HH:mm:ss'),
          arrivalStation:values.to,
          arrivalTime:moment.utc(data.journeys[i].journey.arrivalTime).format('HH:mm:ss'),
          track:1,
          //delay:-1,
          price: data.journeys[i].journey.price,
          travelDate:values.date
        }
      }
      history("/stationsAdmin", {state:list2});
      
      }
      // localStorage.setItem("headerValues",JSON.stringify(values))
      // localStorage.setItem("journeys",JSON.stringify(journeys.list)) 
    });
    e.preventDefault();
  };

  useEffect(async()=>{
      await(fetch('/api/', {
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({token: localStorage.getItem("token")})
        }))
      .then(function(response) {
        if (response.status === 401) {
          window.location = "/login"
          return;
        } else { 
          return response.json();}
      }).then(data=>{
        try{
          console.log(data)
         for(var i=0;i<data.stations.length;i++){
          list[i]=data.stations[i].name;
          setStations({list:list});
         }
         setValues({...values,from:data.stations[0].name,to:data.stations[0].name})
        }
         catch{
           console.log(data)
         }
         
      });
    },[])
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
  const onLogout=()=>{
    localStorage.clear();
  }
  return(

    <nav>
      <div className="home-wrapper">
      <Link to="/admin" className="linkNoUnderline"><div className="title2"><img src="../../../logo_transparent.png" height="70" width="70"/><span className="padding">PassDirect</span></div></Link>
        <div className="from-to">
          <div className="center">
            <div className="column">
            <label className="label">Polazak</label>
            <select id="dropdown" 
            className="input2" 
            type="text" 
            name="from" 
            value={values.from}
            onChange={handleChange}>
            {stations.list.map((item,i) => <option key={i}>{item}</option>)}
            </select>
            </div>
            <div className="column">
            <label className="label">Dolazak</label>
            <select id="dropdown" 
            className="input2" 
            type="text" 
            name="to" 
            value={values.to}
            onChange={handleChange}>
             {stations.list.map((item,i) => <option key={i}>{item}</option>)}
            </select>
            </div>
            <div className="column">
            <label className="label">Datum polaska</label>
          <div >
        <DatePicker className="date" selected={values.date}
          name="date"
          value={values.date} 
          onChange={handleDate}
          minDate={startDate}/>
      </div>
      </div>
        </div>
      <div className="right">
     <button className="button" onClick={handleFormSubmit}>Pretraži</button>
      <Link to="/login"><button className="button" onClick={onLogout}>Odjava</button></Link>
      </div>
      </div>
      </div>
    </nav>
  );
};
export default Header2;