var express = require('express');
var router = express.Router();
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
let _ = require('lodash');
var { generate_uid } = require("../utils/uid-generator");
var { createVaccines, getAllVaccinesByBatchId } = require("../utils/vaccine-handler");
var { getContract } = require("../utils/contract");

/* GET Fetch all manufacturers */
router.get('/fetchAllManufacturers', async(req,res) => {
    let contract = await getContract();
    const result = await contract.evaluateTransaction('queryAllManufacturers');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    res.json(result.toString());
});

/* POST create new vaccine batch */
router.post('/createVaccineBatch', async(req,res) => {
    try{
        let vaccineBatchData = _.pick(req.body, ['qty','manufacturerId','distributorId','manufactureDate','expiryDate']);
        console.log("Vaccine Batch Data received: ", vaccineBatchData);
        let vaccineBatchId = generate_uid();
        console.log("Vaccine Batch UID: ", vaccineBatchId);
        //Get smart contract
        let contract = await getContract();
        // Create vaccine batch entry
        const vaccineBatchResult = await contract.submitTransaction('createVaccineBatch',
                        vaccineBatchId,
                        vaccineBatchData.qty,
                        vaccineBatchData.manufacturerId,
                        vaccineBatchData.distributorId,
                        vaccineBatchData.manufactureDate,
                        vaccineBatchData.expiryDate
        );
        console.log(`Transaction has been evaluated, result is: ${vaccineBatchResult.toString()}`);
        //Create individual vaccine entries
        await createVaccines(contract, vaccineBatchId, vaccineBatchData.qty, vaccineBatchData.manufacturerId);
        const result = await getAllVaccinesByBatchId(contract, vaccineBatchId);
        res.status(200).json({code:0,
            data: result
        });
    } catch(error){
        res.status(400).json({code : 1, 
            message : "Error while creating vaccine batch",
            error: error});
    }    
});

module.exports = router;