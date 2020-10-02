var checkIfVaccinated = async(contract, patientId) => {
    let allVaccines = JSON.parse(await contract.evaluateTransaction('queryAllVaccines'));
    var response = {};
    for (var i = 0; i < allVaccines.length; i++) {
        var vaccine = allVaccines[i];
        if(vaccine.Record.owner === patientId){
            console.log("VACCINE : ", vaccine);
            response.vaccinated = true;
            response.vaccine = vaccine;
        }
    }
    return(response);
};

module.exports = {
    checkIfVaccinated
};