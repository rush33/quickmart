import { Coordinates } from "./order";

export type User = {
  userId: string;
  fname: string;
  email: string;
  coords?: Coordinates;
};
