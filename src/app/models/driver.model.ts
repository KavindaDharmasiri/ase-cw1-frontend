export interface Driver {
  id?: number;
  name: string;
  licenseNumber: string;
  phone: string;
  rdc: any;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}