const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');
const dbp = require('../config/dbpromise');
const Booking = require('../models/Booking');

router.post('/booked', BookingController.createBook);
router.get('/view', BookingController.viewBook);
router.delete('/cancel/:bookingId', BookingController.cancelBooking);

router.get('/bookings', (req, res) => {
    const query = 'SELECT * FROM visitbookings';
    dbp.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  
  // Update booking status
  router.put('/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { booking_status } = req.body;
  
    if (!['pending', 'accepted', 'decline'].includes(booking_status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }
  
    const query = 'UPDATE visitbookings SET booking_status = ? WHERE booking_id = ?';
    dbp.query(query, [booking_status, id], (err, results) => {
      if (err) throw err;
      res.json({ message: 'Booking status updated successfully.' });
    });
  });

  router.get('/bookings/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Fetch bookings for the user from the database
    const query = 'SELECT * FROM visitbookings WHERE user_id = ? AND booking_status = "Pending"';
    dbp.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching bookings' });
      }
  
      if (results.length === 0) {
        return res.status(200).json([]); // No pending bookings found
      }
  
      return res.status(200).json(results); // Return pending bookings
    });
  });
  

module.exports = router;