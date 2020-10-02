var { generate_uid } = require("../utils/uid-generator");

var createVaccines = async(contract, vaccineBatchId, qty, owner) => {
    var i = 0;
    console.log("Creating vaccines");
    for(var i = 0;i<qty;i++){
        await contract.submitTransaction("createVaccine",
            generate_uid(),
            "VACBATCH"+vaccineBatchId,
            owner
        );
    }
}

var getAllVaccinesByBatchId = async(contract, vaccineBatchId) => {
    let allVaccines = JSON.parse(await contract.evaluateTransaction('queryAllVaccines'));
    var response = {};
    response.vaccineBatchId = "VACBATCH" + vaccineBatchId;
    response.vaccines = [];
    for (var i = 0; i < allVaccines.length; i++) {
        var vaccine = allVaccines[i];
        if(vaccine.Record.vaccineBatchId === response.vaccineBatchId){
            console.log("VACCINE : ", vaccine.Record.vaccineBatchId);
            response.vaccines.push(vaccine.Key);
        }
    }
    return(response);

};

module.exports = {
    getAllVaccinesByBatchId,
    createVaccines
};