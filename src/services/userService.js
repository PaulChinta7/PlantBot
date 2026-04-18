const { getDB } = require('../../db');

async function registerUser(payload) {
    const db = getDB();
    console.log('Reeached here', payload);
    let ack = await db.collection('Users').insertOne(payload);
    console.log('Acknoledgement',ack);
    return 'something';
}

module.exports = {
    registerUser
}