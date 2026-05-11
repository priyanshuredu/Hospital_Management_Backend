const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createState ,getAllStates ,updateStateStatus ,deleteState} = require('../controller/stateController');
const {createDistrict ,updateDistrictStatus ,getAllDistricts ,deleteDistrict} = require('../controller/districtController');
const {createCity ,updateCityStatus ,getAllCities ,deleteCity} = require('../controller/cityController');

router.get('/states',auth , getAllStates);
router.get('/districts',auth , getAllDistricts);
router.get('/cities',auth , getAllCities);
router.post('/add-state',auth , createState);
router.post('/add-districts',auth , createDistrict);
router.post('/add-cities',auth , createCity);
router.patch('/state/update',auth , updateStateStatus);
router.patch('/district/update',auth , updateDistrictStatus);
router.patch('/city/update',auth , updateCityStatus);
router.delete('/state/:id',auth , deleteState);
router.delete('/district/:id',auth , deleteDistrict);
router.delete('/city/:id',auth , deleteCity);

module.exports = router;