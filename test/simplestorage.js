const Car = artifacts.require("./Car.sol");

contract("Car", accounts => {
  it("...should store the value 89.", async () => {
    const carInstance = await Car.deployed();

    // Set value of 89
    await carInstance.methods.addCar("123", 1234, "123", "123").send({ from: accounts[0] });

    // Get stored value
    const storedData = await simpleStorageInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
