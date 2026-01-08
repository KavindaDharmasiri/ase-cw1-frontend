export interface Supplier {
  id?: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}