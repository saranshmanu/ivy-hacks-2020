var express = require('express');
var router = express.Router();
const path = require('path');
let _ = require('lodash');
var { getContract } = require("../utils/contract");
var { getVaccineById } = require("../utils/vaccine-handler");
var { checkIfVaccinated } = require("../utils/patients-handler");


/* POST Check if vaccine is valid */
router.post('/checkVaccineValid', async(req,res) => {
    try{
        let contract = await getContract();
        let vaccineData = _.pick(req.body, ['vaccineId']);
        console.log("Vaccine Data received: ", vaccineData);
        let result = await getVaccineById(contract, vaccineData.vaccineId);
        if(result.vaccine == null || result.vaccine == undefined)
            res.status(200).json({code:1,
                message : "Vaccine is invalid!"
            });
        else
            res.status(200).json({code:0,
                message : "Vaccine is valid",
                data: result
            });
    } catch(error){
        res.status(400).json({code : 1, 
            message : "Error while checking vaccine validity",
            error: error});
    }
});

/* POST Check if user is vaccinated */
router.post('/checkIfVaccinated', async(req,res) => {
    try{
        let contract = await getContract();
        let patientData = _.pick(req.body, ['patientId']);
        console.log("Patient Data received: ", patientData);
        let result = await checkIfVaccinated(contract, patientData.patientId);
        if(result.vaccine == null || result.vaccine == undefined)
            res.status(200).json({code:1,
                message : "Patient is not vaccinated"
            });
        else
            res.status(200).json({code:0,
                message : "Patient is vaccinated",
                data: result
            });
    } catch(error){
        res.status(400).json({code : 1, 
            message : "Error while checking if patient is vaccinated or not",
            error: error});
    }
});

module.exports = router;