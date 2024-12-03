const express = require('express');
const {
  convertAddressToGeolocation,
  convertGeolocationToAddress,
  getCurrentGeolocation,
} = require('../controllers/location');

const router = express.Router();

router.post('/convertAddressToGeolocation', convertAddressToGeolocation);
router.post('/convertGeolocationToAddress', convertGeolocationToAddress);
router.get('/getCurrentGeolocation', getCurrentGeolocation);

module.exports = router;
