export interface Delivery {
  id: number;
  order: {
    id: number;
    customer: {
      id: number;
      fullName: string;
    };
    deliveryAddress: string;
  };
  driverName: string;
  vehicleNumber: string;
  status: DeliveryStatus;
  scheduledDate: string;
  actualDeliveryDate?: string;
  currentLocation?: string;
  notes?: string;
}

export type DeliveryStatus = 
  | 'SCHEDULED' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'FAILED' 
  | 'CANCELLED';

export interface ScheduleDeliveryRequest {
  orderId: number;
  driverName: string;
  vehicleNumber: string;
  scheduledDate: string;
}

export interface UpdateDeliveryStatusRequest {
  status: DeliveryStatus;
  currentLocation?: string;
  notes?: string;
}