const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { getDB } = require('../../db');
const passport = require('passport');

async function getMyPlants(req, res) {
    let db = getDB();
    let email = req.user.email;
    let result = await db.collection('Plants').find({email}).toArray();
    res.json({data:result});
}
function setUpPlant(req, res) {
    //  this api is for creating and setting up a plant based on the device Id.
    // once device is setup. publish a tramit now to the device so the device will start sending logs.
    // deviceId, plant name, email/ user, species. location as well. aiStats : {
    // wateringPeriod: 6-8 hrs, stable temperature: 13 - 36 c.
    // }
    res.json({});
}
function getPlantDetails(req, res) {
    // will do a query based on the device id. and do a aggregation query to get 
    // last months activity  or 14 dAYS ACTIVIVt. show charts or something?
    res.json({});
}

router.get('/my-plants', passport.authenticate('jwt', { session: false }), getMyPlants);
// router.get('/setup-plant', passport.authenticate('jwt', { session: false }), setUpPlant);
// router.get('/get-plant-details', passport.authenticate('jwt', { session: false }), setUpPlant);

module.exports = router;

// need to create a subscriber for logs consume a batch and bulk write to the collection every 5 mins. from MQTT.
// need to write a publisher to control/ send messages to the device.


// need to create nodes for ROS.
// use  micro-ros to send data to the ROS node. and then use.
// cloud bridge to publusb messages to MQTT to nodejs backend.
// create cpp script for esp32 to send messages over the current network.