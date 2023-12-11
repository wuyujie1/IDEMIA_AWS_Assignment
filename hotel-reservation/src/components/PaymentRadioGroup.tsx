import React from "react";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { PaymentMethodsProps } from "../utils/interface";



const PaymentRadioGroup: React.FC<PaymentMethodsProps> = ({ payment, setPayment }) => {
    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPayment(event.target.value);
    };

    return (
        <RadioGroup
            row
            aria-label="payment method"
            name="paymentMethod"
            value={payment}
            onChange={handlePaymentChange}
        >
            <FormControlLabel
                value="cc"
                control={<Radio color="secondary" />}
                label="Credit Card"
            />
            <FormControlLabel
                value="paypal"
                control={<Radio color="secondary" />}
                label="PayPal"
            />
            <FormControlLabel
                value="cash"
                control={<Radio color="secondary" />}
                label="Cash"
            />
            <FormControlLabel
                value="bitcoin"
                control={<Radio color="secondary" />}
                label="Bitcoin"
            />
        </RadioGroup>
    );
};

export default PaymentRadioGroup;