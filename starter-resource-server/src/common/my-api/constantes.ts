import { _MyCanType, MyCanType } from "./types";

export const CAN: _MyCanType = () => true;
export const CANNOT: _MyCanType = () => false;

export const ONLY_READ: MyCanType = { read: CAN, create: CANNOT, update: CANNOT };
