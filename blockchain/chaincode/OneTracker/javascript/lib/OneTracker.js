/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class OneTracker extends Contract {

    /* (START) Initialisation */
    constructor() {
        super();
    }
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const manufacturers = [
            {
                uid: 'MNF',
                name: 'AstraZeneca',
                location: 'Palo Alto, USA'
            },
            {
                uid: 'MNF',
                name: 'Ranbaxy',
                location: 'Hyderabad, India'
            }
        ];

        for (let i = 0; i < manufacturers.length; i++) {
            manufacturers[i].docType = 'manufacturer';
            await ctx.stub.putState("MNF" + i, Buffer.from(JSON.stringify(manufacturers[i])));
            console.info('Added <--> ', manufacturers[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
    /* (END) Initialisation */

    /* METHODS -  TO ADD DATA TO CHAIN */
    //Create entry for individual vaccine
    async createVaccine(ctx, vaccineId, vaccineBatchId, owner){
        console.info('============= START : Create Vaccine ===========');
        const vaccine = {
            docType: 'vaccine',
            vaccineBatchId : vaccineBatchId,
            owner : owner
        };
        await ctx.stub.putState("VACCINE" + vaccineId, Buffer.from(JSON.stringify(vaccine)));
        console.info('============= END : Create Vaccine ===========');
    }

    //Create entry for a batch of vaccines
    async createVaccineBatch(ctx, vaccineBatchId, qty, manufacturerId, distributorId, manufactureDate, expiryDate) {
        console.info('============= START : Create Vaccine Batch ===========');
        
        const vaccineBatch = {
            docType: 'vaccine-batch',
            batchSize : qty,
            manufacturerId : manufacturerId,
            distributorId : distributorId,
            manufactureDate : manufactureDate,
            expiryDate: expiryDate,
            owner : manufacturerId        
        };

        await ctx.stub.putState("VACBATCH" + vaccineBatchId, Buffer.from(JSON.stringify(vaccineBatch)));
        console.info('============= END : Create Vaccine Batch ===========');
        return({vaccineBatchId : vaccineBatchId});
    }

    /* METHODS - To query for specific data */
    //Method to find all vaccines in a batch
    async findVaccineByBatchId(ctx, vaccineBatchId){
        const VACCINE_SIGNATURE = "VACCINE";
        let allVaccines = await this.queryAllData(ctx, VACCINE_SIGNATURE);
        console.info("ALL VACCINES: ", allVaccines);
    }

    /* METHODS - To query for all available data */
    //Single method where it searches for keys starting with specified prefix
    async queryAllData(ctx, prefix) {
        const startKey = '';
        const endKey = '';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString() && res.value.key.toString().startsWith(prefix)) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async queryAllManufacturers(ctx){
        const MANUFACTURER_SIGNATURE = "MNF";
        return(await this.queryAllData(ctx, MANUFACTURER_SIGNATURE));
    }

    async queryAllVaccineBatches(ctx){
        const VACCINE_BATCH_SIGNATURE = "VACBATCH";
        return(await this.queryAllData(ctx, VACCINE_BATCH_SIGNATURE));
    }

    async queryAllVaccines(ctx){
        const VACCINE_SIGNATURE = "VACCINE";
        return(await this.queryAllData(ctx, VACCINE_SIGNATURE));
    }
    /* (END) METHODS - To query for all available data */

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = OneTracker;
