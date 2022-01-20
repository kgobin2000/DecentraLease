pragma solidity ^0.8.7;
import "hardhat/console.sol";



contract Car{
    uint256 public counter = 0;
    struct carInfo{
        string vin;
        string model;
        uint256 year;
        string make;
    }

    function getCounter() public view returns (uint256){
        return counter;
    }
    
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }   
    mapping (uint256 => carInfo) car;

    function addCar(string memory _vin,  uint256 _year, string memory _make, string memory _model) public {
        carInfo storage newCar = car[counter];
        newCar.model = _model;
        newCar.year = _year;
        newCar.make = _make;
        newCar.vin = _vin;
        counter++;
    }

    function getCars() external view returns(string[] memory, uint256[] memory, string[] memory, string[] memory){
        string[] memory vinNumbers = new string[](counter);
        uint256[] memory years1 = new uint256[](counter);
        string[] memory makes = new string[](counter);
        string[] memory models = new string[](counter);

        for(uint i = 0; i < counter; i++){
            console.log(vinNumbers[i]);
            vinNumbers[i] = car[i].vin;
            years1[i] = car[i].year;
            makes[i] = car[i].make;
            models[i] = car[i].model;
        }
        return (vinNumbers, years1, makes, models);

    }

    

    function getCar(string memory _vin) public view returns (string memory, uint256 ,string memory,string memory) 
    {
       
      
        for (uint256 i = 0; i < counter; i++){
            if (compareStrings(car[i].vin, _vin) == true){
                 return (car[i].vin, car[i].year,car[i].make,car[i].model);
            }
                
        }
        return ("nothing found", 0,"", "");
       
    }

    function removeCar(string memory _vin) public returns (string memory, string memory) 
    {
       
      
        for (uint256 i = 0; i < counter; i++){
            if (compareStrings(car[i].vin, _vin) == true){
                car[i].vin = "";
                car[i].model = "";
                car[i].year = 0;
                car[i].make = "";
                counter--;
                return (_vin, "successfully removed");
            }    
        }
        return (_vin, "does not exist");
       
    }

    

    function hello() public pure returns (string memory) {
        return "hello world!";
    }
}
