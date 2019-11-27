import { orders } from "src/types/state/actions";
import cart from "src/redux/shoppingCart/types";
import auth from "src/redux/auth/types";

export default (state = {}, { type, payload, error }) => {
    if (error) return state;
    switch (type) {
        case cart.setResponse:
        case cart.checkResponse:
            return payload;
        case auth.logOutResponse:
        case orders.createOrderResponse:
            return {};
        default:
            return state;
    }
};
