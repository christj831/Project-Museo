// Backend/models/Address.js
const dbp = require('../config/dbpromise');

const Address = {
  createAddress: (addressData, userId, callback) => {
    const { country, region, province, city, barangay, street_address, zip_code } = addressData;
    const query = `
      INSERT INTO Address_db (country, region, province, city, barangay, street_address, zip_code, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    dbp.query(query, [country, region, province, city, barangay, street_address, zip_code, userId], callback);
  },
};

module.exports = Address;
