export interface DeliveryZone {
  id?: number;
  name: string;
  description?: string;
  deliveryFee: number;
  estimatedDeliveryDays: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}