const dbp = require('../config/dbpromise');

const Booking = {
  createBooking: (bookingData, callback) => {
    const {
      user_id,
      visit_date,
      booking_time,
      number_of_guests,
      booking_status,
      created_at,
      updated_at
    } = bookingData;
    const query = 'INSERT INTO visitbookings (user_id, visit_date, booking_time, number_of_guests, booking_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
    dbp.query(
      query,
      [
        user_id,
        visit_date,
        booking_time,
        number_of_guests,
        booking_status,
        created_at,
        updated_at
      ],
      callback
    );
  },

  getBookings: (userId, callback) => {
    const query = `
      SELECT booking_id, visit_date, booking_time, number_of_guests, booking_status
      FROM visitbookings
      WHERE user_id = ?
    `;
    dbp.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching bookings:', err);
        return callback({ status: 500, message: 'Error fetching bookings' });
      }
  
      if (results.length === 0) {
        return callback(null, []); // No bookings found
      }
  
      // Return the list of bookings
      callback(null, results); // Send back the results
    });
  },
};

module.exports = Booking;
