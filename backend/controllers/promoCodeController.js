 // controllers/promoCodeController.js
import PromoCode from '../models/promoCodeModel.js';
import moment from 'moment-timezone';

const applyPromoCode = async (req, res) => {
  const { code, userId, totalAmount } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code }).populate('usedBy');

    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    if (promoCode.usedBy.some(user => user._id.toString() === userId)) {
      return res.status(400).json({ message: 'You have already used this promo code' });
    }

    if (moment(promoCode.expiresAt).isBefore(moment().tz('Africa/Lagos'))) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    // Add the user to the usedBy array
    promoCode.usedBy.push(userId);
    await promoCode.save();

    // Calculate the reduced total amount
    const discountAmount = (promoCode.discount / 100) * totalAmount;
    const reducedTotal = totalAmount - discountAmount;

    res.status(200).json({ discount: promoCode.discount, reducedTotal });
  } catch (error) {
    res.status(500).json({ message: 'Error applying promo code', error });
  }
};

const listPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promo codes', error });
  }
};

const addPromoCode = async (req, res) => {
  const { code, discount, expiresAt } = req.body;

  try {
    const newPromoCode = new PromoCode({ code, discount, expiresAt, usedBy: [] });
    await newPromoCode.save();
    res.status(201).json(newPromoCode);
  } catch (error) {
    res.status(500).json({ message: 'Error adding promo code', error });
  }
};

const getAppliedPromoCode = async (req, res) => {
  const { userId } = req.params;

  try {
    const promoCode = await PromoCode.findOne({ usedBy: userId }).populate('usedBy');
    if (promoCode) {
      res.status(200).json({ code: promoCode.code, discount: promoCode.discount });
    } else {
      res.status(404).json({ message: 'No applied promo code found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applied promo code', error });
  }
};

const deletePromoCode = async (req, res) => {
  const { code } = req.params;

  try {
    const promoCode = await PromoCode.findOneAndDelete({ code });
    if (promoCode) {
      res.status(200).json({ message: 'Promo code deleted successfully' });
    } else {
      res.status(404).json({ message: 'Promo code not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting promo code', error });
  }
};

export default {
  applyPromoCode,
  listPromoCodes,
  addPromoCode,
  getAppliedPromoCode,
  deletePromoCode,
};
