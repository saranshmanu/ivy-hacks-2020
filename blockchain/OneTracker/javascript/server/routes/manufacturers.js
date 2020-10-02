var express = require('express');
var router = express.Router();
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
let _ = require('lodash');
var { generate_uid } = require("../utils/uid-generator");

const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'first-network', 'connection-org1.json');

async function getContract(){
    // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), '..', 'wallet');
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the user.
  const userExists = await wallet.exists('user1');
  if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      return;
  }

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork('mychannel');

  // Get the contract from the network.
  const contract = network.getContract('OneTracker');

  return(contract);
}

/* GET Fetch all manufacturers */
router.get('/fetchAllManufacturers', async(req,res) => {
    let contract = await getContract();
    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('queryAllManufacturers');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    res.json(result.toString());
});

/* POST create new vaccine batch */
router.post('/createVaccineBatch', async(req,res) => {
    let vaccineBatchData = _.pick(req.body, ['qty','manufacturerId','distributorId','manufactureDate','expiryDate']);
    console.log("Vaccine Batch Data received: ", vaccineBatchData);
    console.log("UID: ", generate_uid());
    //Get smart contract
    let contract = await getContract();
    // Create vaccine batch entry, along with vaccines
    const vaccineBatchResult = await contract.submitTransaction('createVaccineBatch',
                    generate_uid(),
                    vaccineBatchData.qty,
                    vaccineBatchData.manufacturerId,
                    vaccineBatchData.distributorId,
                    vaccineBatchData.manufactureDate,
                    vaccineBatchData.expiryDate
    );
    console.log(`Transaction has been evaluated, result is: ${vaccineBatchResult.toString()}`);
    const result = await contract.evaluateTransaction('queryAllVaccineBatches');
    res.json(result.toString());
});

module.exports = router;