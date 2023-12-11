import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaymentRadioGroup from "./PaymentRadioGroup";

describe("PaymentRadioGroup", () => {
    const mockSetPayment = jest.fn();
    const props = {
        payment: "cc",
        setPayment: mockSetPayment
    };

    it("renders the radio group with the correct value selected", () => {
        render(<PaymentRadioGroup {...props} />);
        expect(screen.getByLabelText("Credit Card")).toBeChecked();
    });

    it("calls setPayment when a different radio option is selected", () => {
        render(<PaymentRadioGroup {...props} />);
        const radioButton = screen.getByLabelText("PayPal");
        fireEvent.click(radioButton);
        expect(mockSetPayment).toHaveBeenCalledWith("paypal");
    });
});
