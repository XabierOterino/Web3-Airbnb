import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import logo from "../images/airbnb.png"
import bg from "../images/frontpagebg.png"
import { Icon , ConnectButton ,Select , DatePicker , Input , Button} from "web3uikit";
import {useState , useEffect} from "react"

export default function Home(){
  const [parameters , updateParameters] = useState({
    checkIn : new Date(),
    checkOut : new Date(),
    destination : "New York",
    guests : 2
  })

  return (
    <>
      <div className="container" style={{backgroundImage: `url(${bg})` }}>
        <div className="containerGradient"></div>
        <div className="topBanner" >
          <div>
            <img className="logo" src={logo} alt="logo"/>
          </div>

          <div className="tabs">
            <div className="selected">Places To Stay</div>
            <div>Experiences</div>
            <div>Online Experiences</div>
          </div>
          <div className="lrContainers">
            <ConnectButton />
          </div>

        </div>
        <div className="tabContent">
          <div className="searchFields">
            <div className="inputs">
                Location
                <Select
                defaultOptionIndex={0}
                onChange={(e)=>
                   {updateParameters({...parameters
                     , destination: e.label})}}
                options={[
                  {
                    id:"ny",
                    label:"New York"
                  },
                  {
                    id:"lon",
                    label:"London"
                  },
                  {
                    id:"db",
                    label:"Dubai"
                  },
                  {
                    id:"la",
                    label:"Los Angeles"
                  },
                ]}
                />
            </div>
            <div className="vl"/>
            <div className="inputs">
              Check In
              <DatePicker
              id="CheckIn"
              onChange={(e)=>
                {updateParameters({...parameters
                  , checkIn: e.date})}}
              />
            </div>
            <div className="vl"/>
            <div className="inputs">
              Check Out
              <DatePicker
              id="CheckOut"
              onChange={(e)=>
                {updateParameters({...parameters
                  , checkOut: e.date})}}
              />
            </div>
            <div className="vl"/>
            <div className="inputs">
              Guests
              <Input
              name="AddGuests"
              value={2}
              type="number"
              onChange={(e)=>
                {updateParameters({...parameters
                  , guests: e.target.value})}}
              />
            </div>
            <div className="searchButton">
            <Link to={"/rentals"} state={{
              destination: parameters.destination,
              checkIn: parameters.checkIn,
              checkOut: parameters.checkOut,
              guests: parameters.guests
            }}>
              <div className="searchButton">
                <Icon fill="#ffffff" size={24} svg="search" />
              </div>
            </Link>
          </div>
        </div>
        </div>
        <div className="randomLocation">
            <div className="title">Feel Adventutous </div>
            <div className="text">
              Let us decide and discover new places to stay
              relax.
            </div>
            <Button 
              text="Explore a Location"
              onClick={()=> console.log(parameters.checkOut)}
            />
         </div>
     

      </div>
     
    </>
  );


};


