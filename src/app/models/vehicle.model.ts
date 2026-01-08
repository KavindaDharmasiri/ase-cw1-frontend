export interface Vehicle {
  id?: number;
  vehicleNumber: string;
  vehicleType: string;
  capacity: number;
  rdc: any;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}