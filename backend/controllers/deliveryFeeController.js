import deliveryFeeModel from "../models/deliveryFeeModel.js";

// Change Delivery Fee
const changeDeliveryFee = async (req, res) => {
    try {
        const { deliveryFee } = req.body;
        await deliveryFeeModel.findOneAndUpdate({}, { fee: deliveryFee }, { upsert: true });
        res.json({ success: true, message: "Delivery fee changed successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error changing delivery fee" });
    }
};

// Fetch Delivery Fee
const getDeliveryFee = async (req, res) => {
    try {
        const deliveryFeeData = await deliveryFeeModel.findOne();
        if (!deliveryFeeData) {
            return res.json({ success: false, message: "Delivery fee not found" });
        }
        res.json({ success: true, deliveryFee: deliveryFeeData.fee });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching delivery fee" });
    }
};

export { changeDeliveryFee, getDeliveryFee };
