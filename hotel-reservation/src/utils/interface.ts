import dayjs from "dayjs";
import React from "react";

export interface SearchParams {
  arrivaldate: dayjs.Dayjs | null;
  departuredate: dayjs.Dayjs | null;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface Reservation {
  id?: number;
  arrivaldate: string | dayjs.Dayjs;
  departuredate: string | dayjs.Dayjs;
  roomsize: string;
  roomquantity: number | string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  streetname: string;
  streetnumber: string;
  zipcode: string;
  state: string;
  city: string;
  extras: string;
  payment: string;
  note: string;
  tags: string;
  reminder: boolean;
  newsletter: boolean;
  confirm: boolean;
}

export interface ApiData {
  body: Reservation[];
}

export interface Option {
  id: number;
  name: string;
}

export interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  row: Reservation | null;
  onDelete: (row: Reservation | null) => void;
  onUpdate: (row: Reservation | null, oriRow: Reservation | null) => void;
  forCreate: boolean;
}

export interface PaymentMethodsProps {
  payment: string;
  setPayment: (value: string) => void;
}

export interface TagsProps {
  tags: string;
  handleTagsChange: (
    event: React.SyntheticEvent<Element, Event>,
    newTags: string[]
  ) => void;
}

export interface RoomSizeProps {
  roomsize: string;
  handleNaiveSelectFieldChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  roomTypes: string[];
}

export interface InputNameProps {
  name: string;
  label: string;
  value: string;
  maxLength: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface MockFetchResponse {
  ok: boolean;
  json: jest.Mock;
  text: jest.Mock;
}