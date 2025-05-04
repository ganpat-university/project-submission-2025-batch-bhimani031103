const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/planController');

router.use(protect);

router.post('/add-plan', createPlan);
router.get('/plans',getPlans); 

router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan); 

module.exports = router;