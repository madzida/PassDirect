import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Login from './components/Login/Login';
import Form from './components/Register/Form';
import Home from './components/Home/Home';
import SignupForm from './components/Register/SignupForm';
import Header from './components/Header/Header';
import PrivateRoute from "./components/PrivateRoute"
import AdminHome from "./components/Home/AdminHome"
import ContainerAH from './components/Home/ContainerAH';
import SelectedStations from './components/SelectedStations/SelectedStations';
import StationsAdmin from './components/SelectedStations/StationsAdmin';
import TrainContainer from './components/SelectedStations/TrainContainer';
import TrainContainerAdmin from './components/SelectedStations/TrainContainerAdmin';
import PaymentForm from './components/Payment/PaymentForm';
import SuccesfulPayment from './components/Payment/SuccesfulPayment';
import FormPay from './components/Payment/FormPay';
import Management from './components/Management/Management';
//import { idle_in_transaction_session_timeout } from 'pg/lib/defaults';
import Transactions from './components/Transactions/Transactions';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
        <Route exact path='/payment' element={<PrivateRoute />}>
          {/* <Route exact path='/payment' element={<FormPay/>}></Route> */}
            <Route exact path='/payment' element={<PaymentForm />}></Route>
          </Route>
          <Route exact path='/' element={<PrivateRoute />}>
            <Route exact path='/' element={<Home />}></Route>
          </Route>
          <Route exact path='/successful' element={<PrivateRoute />}>
            <Route exact path='/successful' element={<SuccesfulPayment/>}></Route>
          </Route>
          <Route exact path='/transactions' element={<PrivateRoute />}>
            <Route exact path='/transactions' element={<Transactions/>}></Route>
          </Route>
          <Route exact path='/admin' element={<PrivateRoute />}>
            <Route exact path='/admin' element={<AdminHome />}></Route>
          </Route>
          <Route exact path='/stations' element={<PrivateRoute/>}>
            <Route exact path='/stations' element={<SelectedStations/>}></Route>
          </Route>
          <Route exact path='/stationsAdmin' element={<PrivateRoute/>}>
            <Route exact path='/stationsAdmin' element={<StationsAdmin/>}></Route>
          </Route>
          <Route exact path='/login' element={<Login/>}></Route>
          <Route exact path='/signup' element={<Form/>}></Route>
          <Route exact path='/signup' element={<SignupForm/>}></Route>
          <Route exact path='/payment' element={<PaymentForm/>}></Route>
          <Route exact path='/accountmanagement' element={<Management/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
