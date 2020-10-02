var express = require('express');
var router = express.Router();
const path = require('path');
let _ = require('lodash');
var { createVaccines, getAllVaccinesByBatchId, changeVaccineOwner, changeVaccineBatchOwner } = require("../utils/vaccine-handler");
var { getContract } = require("../utils/contract");

/* GET Fetch all vaccine batches */
router.get('/fetchAllVaccineBatches', async(req,res) => {
    let contract = await getContract();
    const result = await contract.evaluateTransaction('queryAllVaccineBatches');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    res.json(result.toString());
});

/* GET Fetch all vaccines */
router.get('/fetchAllVaccines', async(req,res) => {
    let contract = await getContract();
    const result = await contract.evaluateTransaction('queryAllVaccines');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    res.json(result.toString());
});

/* PATCH Change ownership of vaccine */
router.patch('/changeVaccineOwner', async(req,res) => {
    try{
        let contract = await getContract();
        let vaccineData = _.pick(req.body, ['vaccineId','newOwner']);
        console.log("Vaccine Data received: ", vaccineData);
        await changeVaccineOwner(contract, vaccineData.vaccineId, vaccineData.newOwner);
        res.status(200).json({code:0,
            message : "Successfully changed ownership of vaccine"
        });
    } catch(error){
        res.status(400).json({code : 1, 
            message : "Error while changing ownership of vaccine",
            error: error});
    }
});

/* PATCH Change ownership of vaccine batch */
router.patch('/changeVaccineBatchOwner', async(req,res) => {
    try{
        let contract = await getContract();
        let vaccineBatchData = _.pick(req.body, ['vaccineBatchId','newOwner']);
        console.log("Vaccine Batch Data received: ", vaccineBatchData);
        await changeVaccineBatchOwner(contract, vaccineBatchData.vaccineBatchId, vaccineBatchData.newOwner);
        res.status(200).json({code:0,
            message : "Successfully changed ownership of vaccine batch"
        });
    } catch(error){
        res.status(400).json({code : 1, 
            message : "Error while changing ownership of vaccine batch",
            error: error});
    }
});

module.exports = router;