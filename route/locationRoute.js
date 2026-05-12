const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createState ,getAllStates ,updateStateStatus ,deleteState ,getStateById} = require('../controller/stateController');
const {createDistrict ,updateDistrictStatus ,getAllDistricts ,deleteDistrict ,getDistrictsByState ,getDistrictById} = require('../controller/districtController');
const {createCity ,updateCityStatus ,getAllCities ,deleteCity , getCityById} = require('../controller/cityController');

router.get('/states' , getAllStates);
router.get('/state/:id', getStateById);
router.get('/districts' , getAllDistricts);
router.get('/districts/by-state/:id',  getDistrictsByState);
router.get('/district/:id' , getDistrictById);
router.get('/cities', getAllCities);
router.get('/city/:id', getCityById)
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