import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ModalDialog from "./ModalDialog";
import { Reservation } from "../utils/interface";
import { act } from "react-dom/test-utils";

describe("ModalDialog", () => {
    const sampleReservation: Reservation = {
        arrivaldate: "",
        departuredate: "single-room",
        roomsize: "",
        roomquantity: 1,
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        streetname: "",
        streetnumber: "",
        zipcode: "",
        state: "",
        city: "",
        extras: "",
        payment: "",
        note: "",
        tags: "",
        reminder: false,
        newsletter: false,
        confirm: false,
    };

    const mockOnClose = jest.fn();
    const mockSetIsLoading = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("handles changes to the arrival date", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const arrivalDatePicker = screen.getByLabelText("Date of Arrival") as HTMLInputElement;
        await act (async () => {
            await userEvent.type(arrivalDatePicker, "09202022");
        });
        expect(arrivalDatePicker.value).toBe("09/20/2022");
    });

    it("handles changes to the departure date", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const departureDatePicker = screen.getByLabelText("Date of Departure")  as HTMLInputElement;
        await act (async () => {
            await userEvent.type(departureDatePicker, "09202022");
        });
        expect(departureDatePicker.value).toBe("09/20/2022");
    });

    it("handles changes to the room quantity and only accepts numbers between 1 to 5", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const roomQuantityInput = screen.getByLabelText("Room Quantity") as HTMLInputElement;

        await act (async () => {
            userEvent.clear(roomQuantityInput);
            userEvent.type(roomQuantityInput, "3");
        });
        expect(roomQuantityInput.value).toBe("3");

        await act (async () => {
            userEvent.clear(roomQuantityInput);
            userEvent.type(roomQuantityInput, "6");
        });
        expect(roomQuantityInput.value).not.toBe("6");

        await act (async () => {
            userEvent.clear(roomQuantityInput);
            userEvent.type(roomQuantityInput, "2+");
        });
        expect(roomQuantityInput.value).not.toContain("+");
    });


    it("handles changes to the firstname", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const firstNameInput = screen.getByLabelText("First Name") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(firstNameInput);
            userEvent.type(firstNameInput, "test");
        });
        expect(firstNameInput.value).toBe("test");
    });

    it("handles changes to the lastname", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const lastNameInput = screen.getByLabelText("Last Name") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(lastNameInput);
            userEvent.type(lastNameInput, "test");
        });
        expect(lastNameInput.value).toBe("test");
    });

    it("handles changes to the email", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const emailInput = screen.getByLabelText("E-Mail") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(emailInput);
            userEvent.type(emailInput, "test@test.com");
        });
        expect(emailInput.value).toBe("test@test.com");
    });

    it("handles changes to the phone number", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const phoneInput = screen.getByLabelText("Phone Number") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(phoneInput);
            userEvent.type(phoneInput, "1234567899");
        });
        expect(phoneInput.value).toBe("1234567899");
    });

    it("handles changes to the street name", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const streetNameInput = screen.getByLabelText("Street Name") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(streetNameInput);
            userEvent.type(streetNameInput, "test Street");
        });
        expect(streetNameInput.value).toBe("test Street");
    });

    it("handles changes to the street number", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const streetNumberInput = screen.getByLabelText("Street Number") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(streetNumberInput);
            userEvent.type(streetNumberInput, "124");
        });
        expect(streetNumberInput.value).toBe("124");
    });

    it("handles changes to the zipcode", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const zipcodeInput = screen.getByLabelText("ZIP") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(zipcodeInput);
            userEvent.type(zipcodeInput, "test");
        });
        expect(zipcodeInput.value).toBe("test");
    });

    it("handles selection of state", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const stateInput = screen.getByLabelText("State") as HTMLInputElement;
        await act (async () => {
            userEvent.type(stateInput, "State2{enter}");
        });
        expect(stateInput.value).toBe("State2");
    });

    it("handles changes to the city", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const cityInput = screen.getByLabelText("City") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(cityInput);
            userEvent.type(cityInput, "Test City");
        });
        expect(cityInput.value).toBe("Test City");
    });

    it("handles changes to personal note", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const noteInput = screen.getByLabelText("Personal Note") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(noteInput);
            userEvent.type(noteInput, "Test Test Test");
        });
        expect(noteInput.value).toBe("Test Test Test");
    });

    it("filters & and = for all text inputs", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const noteInput = screen.getByLabelText("Personal Note") as HTMLInputElement;
        await act (async () => {
            userEvent.clear(noteInput);
            userEvent.type(noteInput, "Test&Test=Test");
        });
        expect(noteInput.value).toBe("TestTestTest");
    });

    it("handles changes to the reminder switch", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const reminderSwitch = screen.getByLabelText("Send me a reminder");
        await act (async () => {
            userEvent.click(reminderSwitch);
        });
        expect(reminderSwitch).toBeChecked();
    });

    it("handles changes to the newsletter switch", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const newsletterSwitch = screen.getByLabelText("Subscribe to newsletter");
        await act (async () => {
            userEvent.click(newsletterSwitch);
        });
        expect(newsletterSwitch).toBeChecked();
    });

    it("handles changes to the confirmation checkbox", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const confirmCheckbox = screen.getByLabelText("I confirm the information given above");
        await act (async () => {
            userEvent.click(confirmCheckbox);
        });
        expect(confirmCheckbox).toBeChecked();
    });

    it("calls onUpdate when Save button is clicked", async () => {
        render(<ModalDialog open={true} row={sampleReservation} setIsLoading={mockSetIsLoading} onClose={mockOnClose} forCreate={false} />);
        const saveButton = screen.getByText("Save");
        await act (async () => {
            userEvent.click(saveButton);
        });
        expect(mockSetIsLoading).toHaveBeenCalled();
    });

    it("calls onDelete when Delete button is clicked", async () => {
        render(<ModalDialog open={true} row={sampleReservation} onClose={mockOnClose} setIsLoading={mockSetIsLoading} forCreate={false} />);
        const deleteButton = screen.getByText("Delete");
        await act (async () => {
            userEvent.click(deleteButton);
        });
        expect(mockSetIsLoading).toHaveBeenCalled();
    });
});