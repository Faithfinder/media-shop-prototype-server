import { Order } from "../models";

export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("user", "email");
        return res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

export const createOrder = async (req, res, next) => {
    try {
        const order = await Order.create(req.body.order);

        const savedOrder = await order.save();
        return res.status(200).json(savedOrder);
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.order_id).populate(
            "user",
            "email"
        );
        return res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

export const updateOrder = async (req, res, next) => {
    try {
        let order = await Order.findByIdAndUpdate(
            req.params.order_id,
            req.body.order,
            { new: true }
        );

        return res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};