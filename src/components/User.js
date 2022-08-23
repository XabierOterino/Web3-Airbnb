import React, { useEffect } from "react";
import {Card, Icon , Modal} from "web3uikit"
import {useState} from "react"
import {useMoralis} from "react-moralis"

export default function User({account}) {
  const [visible ,setVisible] = useState(false)
  const {Moralis} = useMoralis()
  const [useRentals , setUserRentals] = useState()


  useEffect(()=>{
    (async ()=>{
      const Rentals = Moralis.Object.extend("Rentals")
      const query = new Moralis.Query(Rentals)
      query.equalTo("booker" , account)
      const result = await query.find()
      
      setUserRentals(result)
    })()
  } , [visible])
  return (
    <>
      <div>
        <Icon fill="#000000" size={24} svg="user" />
      </div>

      <Modal
      onCloseButtonPressed={()=>{setVisible(false)}}
      hasFooter={false}
      title="Your Stays"
      isVisible={visible}
      >
        <div style={{display : "flex" , justifyContent:"start" , flexWrap:"wrap" , gap:"10px"}}>
          {useRentals && 
          setUserRentals.map((e)=>(
            <div style={{width : "200px"}}>
              <Card
              isDisabled
              title={e.attributes.city}
              description={`${e.attributes.datedBooked[0]} for ${e.attributes.datesBooked.length} Days`}
              >
              <div>
                <img  width="180px" src={e.attributes.imgUrl}/>
              </div>
              </Card>
            </div>
          ))}
        </div>


      </Modal>
    </>
  );
}

