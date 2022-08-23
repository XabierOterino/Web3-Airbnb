import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import {useLocation} from "react-router"
import logo from "../images/airbnbRed.png"
import RentalsMap from "../components/RentalsMap";
import { ConnectButton , Button , Icon, useNotification } from "web3uikit";
import {useState , useEffect} from "react"
import {useMoralis , useWeb3ExecuteFunction} from "react-moralis"
import User from "../components/User";



export default function Rentals() {
  const {state : searchFilters} = useLocation()
  const [highLigth , setHighLight] = useState()
  const {Moralis , account} = useMoralis()
  const [rentalsList , setRentalsList] = useState()
  const [coordinates , setCoordinates] = useState([])
  const contractProcessor = useWeb3ExecuteFunction
  const dispatch = useNotification()
  
  let coords = []
  
  rentalsList.forEach((e)=> {
    coords.push({lat : e.attributes.lat , lng : e.attributes.long})
  })

  useEffect(()=>{
    (async function(){

      const Rentals = Moralis.Object.extend("Rentals")
      const query = new Moralis.Query(Rentals)
      query.equalTo("city" , searchFilters.destination)
      query.greaterThanOrEqualTo("maxGuests_decimal" , searchFilters.guests)
      const result = await query.find()
      let coords = [];

      result.forEach((e)=>{
        coords.push({lat : e.attributes.lat , lng:e.attributes.long})
      })
      setCoordinates(coords)

      setRentalsList(result)



    })()
  } , [searchFilters])

  async function bookRental(start , end, id, dayPrice){
    for(var arr=[] , dt=new Date(start) ; 
        dt<=end; 
        dt.setDate(dt.getDate() +1) ){
          arr.push(new Date(dt).toISOString().slice(0,10));
        }
    
    let options = {
      contractAddress : "0x57De6a4fd158547F53984a5cB435AdFe68907f87" ,
      functionName : "addDatesBooked" ,
      abi : [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "newBookings",
              "type": "string[]"
            }
          ],
          "name": "addDatesBooked",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
      ],
      params : {
        id : id,
        newBookings : arr,
      },
      msgValue : Moralis.Units.ETH(dayPrice * arr.length)
    }
    await contractProcessor.fetch({
      params : options,
      onSuccess : ()=>{
        dispatch({
          type : "success",
          message : `Nice! You are going to ${searchFilters.destination}!!`,
          title : "Booking successfull",
          position : "topL"
        })
      },
      onError : (error)=>{
        dispatch({
          type : "error",
          message : error.data.message,
          title : "Booking Failed",
          position : "topL"
        })
      }
    })

  }
  return (
    <>
    <div className="topBanner">
      <div>
        <Link to="/">
          <img className="logo" src={logo} alt="logo"></img>
        </Link>
      </div>
      <div className="searchReminder">
        <div className="filter">{searchFilters.destination}</div>
        <div className="vl" />
        <div className="filter">
          {`
         ${searchFilters.checkIn.toLocaleString("default", {
           month: "short",
         })} 
         ${searchFilters.checkIn.toLocaleString("default", {
           day: "2-digit",
         })} 
         - 
         ${searchFilters.checkOut.toLocaleString("default", {
           month: "short",
         })} 
         ${searchFilters.checkOut.toLocaleString("default", {
           day: "2-digit",
         })}
        `}
        </div>
        <div className="vl" />
        <div className="filter">{searchFilters.guests} Guest</div>
        <div className="searchFiltersIcon">
          <Icon fill="#ffffff" size={20} svg="search" />
        </div>
      </div>
      <div className="lrContainers">
        {account && <User account={account} /> }
        <ConnectButton />
      </div>
    </div>
    <hr className="line"/>
      <div className="rentalsContent">
        <div className="rentalsContentL">
        Stays Available For Your Destination
        {rentalsList && rentalsList.map((e,i) => (
          <>
          <hr className="line2" />
          <div className= {highLigth ==i ?"rentalDivH" : "rentalDiv"}>
            <img className="rentalImg" src={e.attributes.imgUrl}></img>
            <div className="rentalInfo">
              <div className="rentalTitle">{e.attributes.name}</div>
              <div className="rentalDesc">
                {e.attributes.unoDescription}
              </div>
              <div className="rentalDesc">
                {e.attributes.dosDescription}
              </div>
              <div className="bottomButton">
                <Button 
                onClick={() => {
                  if(account){
                  bookRental(
                    searchFilters.checkIn,
                    searchFilters.checkOut,
                    e.attributes.uid_decimal.value.$numberDecimal,
                    Number(e.attributes.pricePerDay_decimal.value.$numberDecimal)
                  )}else{
                    dispatch({
                      type : "error",
                      message : "Connect wallet first!",
                      title : "Booking Failed",
                      position : "topL"
                    })
                  }
                }
                }
                text="Stay Here" />
                <div className="price">
                  <Icon fill="#808080" size={10} svg="matic" />{" "}
                  {e.attributes.pricePerDay} / Day
                </div>
              </div>
            </div>
          </div>
        </>
        ))
        }
        </div>
        <div className="rentalsContentR">
          <RentalsMap
          locations={coordinates}
          setHighLight={setHighLight}
          />

        </div>
      </div>
   

    
  </>
  );
};

