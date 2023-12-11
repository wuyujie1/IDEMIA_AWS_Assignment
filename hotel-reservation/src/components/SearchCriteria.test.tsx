import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SearchCriteria from "./SearchCriteria";
import { BehaviorSubject } from "rxjs";
import { act } from "react-dom/test-utils";

jest.mock("rxjs", () => {
    const originalModule = jest.requireActual("rxjs");
    return {
        __esModule: true,
        ...originalModule,
        BehaviorSubject: jest.fn().mockImplementation(() => ({
            next: jest.fn(),
            asObservable: jest.fn(),
        })),
    };
});
const mockNext = (BehaviorSubject as unknown as jest.Mock).mock.results[0].value.next;
describe("SearchCriteria", () => {
    beforeEach(() => {
        // Clear the mock before each test
        mockNext.mockClear();
    });
  
    it("renders all fields correctly", () => {
        render(<SearchCriteria />);
        expect(screen.getByLabelText("Date of Arrival")).toBeInTheDocument();
        expect(screen.getByLabelText("Date of Departure")).toBeInTheDocument();
        expect(screen.getByLabelText("First Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
        expect(screen.getByLabelText("E-Mail")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    });

    it("does not update state with invalid characters in text fields", async() => {
        render(<SearchCriteria />);
        const lastname = screen.getByLabelText("Last Name");
        await act(async () => {
            userEvent.type(lastname, "test&test%");
            expect(lastname).toHaveValue("testtest%");
        });
        
    });

    it("updates observable search with the new state", async () => {
        render(<SearchCriteria />);
        const firstNameInput = screen.getByLabelText("First Name");

        await act (async () => {
            userEvent.type(firstNameInput, "test");
        });

        expect(mockNext.mock.calls.length).toBeGreaterThan(4);
    });


    it("updates the firstname correctly", async () => {
        render(<SearchCriteria />);
        await act (async () => {
            const firstNameInput = screen.getByLabelText("First Name") as HTMLInputElement;
            await userEvent.type(firstNameInput, "test");
            expect(firstNameInput.value).toBe("test");
        });

    });

    it("updates the lastname correctly", async () => {
        render(<SearchCriteria />);
        await act (async () => {
            const lastNameInput = screen.getByLabelText("Last Name") as HTMLInputElement;
            await userEvent.type(lastNameInput, "Test");
            expect(lastNameInput.value).toBe("Test");
        });

    });

    it("updates the email correctly", async () => {
        render(<SearchCriteria />);
        await act (async () => {
            const emailInput = screen.getByLabelText("E-Mail") as HTMLInputElement;
            await userEvent.type(emailInput, "test@test.com");
            expect(emailInput.value).toBe("test@test.com");
        });

    });

    it("updates the phone correctly", async () => {
        render(<SearchCriteria />);
        await act (async () => {
            const phoneInput = screen.getByLabelText("Phone Number") as HTMLInputElement;
            await userEvent.type(phoneInput, "1234567890");
            expect(phoneInput.value).toBe("1234567890");
        });

    });

    it("calls the change handler with the correct value for arrival date", async () => {
        render(<SearchCriteria />);
        const arrivalDateInput = screen.getByLabelText("Date of Arrival") as HTMLInputElement;
        await act (async () => {
            await userEvent.type(arrivalDateInput, "09202023");
        });
        expect(arrivalDateInput.value).toBe("09/20/2023");
    });

    it("calls the change handler with the correct value for departure date", async () => {
        render(<SearchCriteria />);
        const departureDateInput = screen.getByLabelText("Date of Departure") as HTMLInputElement;
        await act (async () => {
            await userEvent.type(departureDateInput, "09202023");
        });
        expect(departureDateInput.value).toBe("09/20/2023");
    });
});
