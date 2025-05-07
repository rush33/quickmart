import { Coordinates } from "./order";

export type User = {
  userId: string;
  fname: string;
  lastName?: string;
  email: string;
  coords?: Coordinates;
  address: string;
  phoneNumber: string;
};
