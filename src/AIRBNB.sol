// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
contract airbnb is ReentrancyGuard {
    address private owner;
    uint private counter;

    struct rentalInfo{
        string name;
        string city;
        string lat;
        string long;
        string unoDescriptiom;
        string dosDescrition;
        string imgUrl;
        uint maxGuests;
        uint pricePerDay;
        string[] datesBooked;
        uint id;
        address renter;
    }

    event rentalCreated(
        string name,
        string city,
        string lat,
        string long,
        string unoDescriptiom,
        string dosDescrition,
        string imgUrl,
        uint maxGuests,
        uint pricePerDay,
        string[] datesBooked,
        uint indexed id,
        address renter

    );

    event newDatesBooked(
        string [] datesBooked,
        uint id,
        address booker,
        string city , 
        string imgUrl
    );

    mapping(uint256 => rentalInfo) rentals;
    uint256[] public rentalIds;

    

    constructor(){
        owner = msg.sender;
    }


    /**
    *Function to add a new rental to the list
    */
    function addRentals(
        string memory name,
        string memory city,
        string memory lat,
        string memory long,
        string memory unoDescriptiom,
        string memory dosDescrition,
        string memory imgUrl,
        uint maxGuests,
        uint pricePerDay,
        string[] memory datesBooked

    )public {
        require(msg.sender==owner , "Only the owner can add rentals");
        rentals[counter] = rentalInfo(
            name,
            city,
            lat,
            long,
            unoDescriptiom,
            dosDescrition,
            imgUrl,
            maxGuests,
            pricePerDay,
            datesBooked,
            counter,
            msg.sender
        );
        rentalIds.push(counter);
        emit rentalCreated(
            name,
            city,
            lat,
            long,
            unoDescriptiom,
            dosDescrition,
            imgUrl,
            maxGuests,
            pricePerDay,
            datesBooked,
            counter,
            msg.sender
        );
        counter++; 

    }
    /**
    *Function to check out if certain dates are already booked in 
    a certain rental returns false if booked and true if free 
    */
    function checkBookings(uint256 id, string[] memory newBookings) public view returns(bool allFree , string[] memory bookedDates){
        uint256 arrayLength;
        for (uint i =0 ; i<newBookings.length ; i++){
           for(uint j= 0 ; j<rentals[id].datesBooked.length ; j++){
               if(keccak256(abi.encodePacked(rentals[id].datesBooked[j]))
               == keccak256(abi.encodePacked(newBookings[i]))){
                    arrayLength++;
                }
           }
        }
        if (arrayLength!=0){
            string[] memory bookedDates = new string[](arrayLength);
            uint256 indexCount;

            for (uint i =0 ; i<newBookings.length ; i++){
               for(uint j= 0 ; j<rentals[id].datesBooked.length ; j++){
                   if(keccak256(abi.encodePacked(rentals[id].datesBooked[j]))
                   == keccak256(abi.encodePacked(newBookings[i]))){
                        bookedDates[indexCount] = rentals[id].datesBooked[j] ;
                        indexCount++;
                    }
               }
            }   

            return (true , bookedDates);         
            
        } else{
            string[] memory emptyArray = new string[](0);
            return (false , emptyArray);
        }
    }

    function addDatesBooked(uint256 id , string[] memory newBookings) public nonReentrant payable{
        require(id<counter , "No such Rental");
        (bool free , )=checkBookings(id, newBookings);
        require(free , "Already booked for requested dates");
        require(msg.value == rentals[id].pricePerDay * 1 ether * newBookings.length ,
        "Please submit the asking price in order to complete the purchase");

        for(uint i =0 ; i<newBookings.length ; i++){
            rentals[id].datesBooked.push(newBookings[i]);
        }

        rentals[id].renter.call{value : msg.value}('');
        emit newDatesBooked(newBookings, id, msg.sender, rentals[id].city, rentals[id].imgUrl);
    }

    function getRental(uint256 id) public view returns(string memory){
        require(id < counter , "No such rental");

        rentalInfo storage s = rentals[id];
        return (s.name , s.pricePerDay , s.datesBooked);
    }

   
}
