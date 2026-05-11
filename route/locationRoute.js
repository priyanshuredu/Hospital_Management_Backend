const express = require('express');
const router = express.Router();
const {createState ,getAllStates ,updateStateStatus ,deleteState} = require('../controller/stateController');
const {createDistrict ,updateDistrictStatus ,getAllDistricts ,deleteDistrict} = require('../controller/districtController');
const {createCity ,updateCityStatus ,getAllCities ,deleteCity} = require('../controller/cityController');

router.get('/states', getAllStates);
router.get('/districts', getAllDistricts);
router.get('/cities', getAllCities);
router.post('/add-state', createState);
router.post('/add-districts', createDistrict);
router.post('/add-cities', createCity);
router.patch('/state/update', updateStateStatus);
router.patch('/district/update', updateDistrictStatus);
router.patch('/city/update', updateCityStatus);
router.delete('/state/:id', deleteState);
router.delete('/district/:id', deleteDistrict);
router.delete('/city/:id', deleteCity);

module.exports = router;