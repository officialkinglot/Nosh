 // routes/promoCodeRoute.js
import express from 'express';
import promoCodeController from '../controllers/promoCodeController.js';

const router = express.Router();

router.post('/apply', promoCodeController.applyPromoCode);
router.get('/list', promoCodeController.listPromoCodes);
router.post('/add', promoCodeController.addPromoCode);
router.get('/applied/:userId', promoCodeController.getAppliedPromoCode);
router.delete('/delete/:code', promoCodeController.deletePromoCode); // Add the delete route

export default router;
