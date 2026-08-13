export type UserRole = 'owner' | 'manager' | 'employee';

export type MembershipTier = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

export type MembershipStatus = 'active' | 'paused' | 'inactive';

export type ServiceType = 'exterior' | 'exterior_interior' | 'vip' | 'additional';

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';

export type InvoiceStatus = 'completed' | 'cancelled';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  branchName: string;
}

export interface Vehicle {
  id: number;
  customerId: number;
  plateNumber: string;
  plateLetters: string;
  vehicleSize: 'small' | 'medium' | 'large';
  brand: string;
  model: string;
  color: string;
}

export interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  membershipTier: MembershipTier;
  membershipStatus: MembershipStatus;
  eligibleWashesCount: number;
  discountPercentage: number;
  vehicleCount: number;
  lastVisit?: string;
  freeWashesAvailable: number;
}

export interface Service {
  id: number;
  nameAr: string;
  nameEn: string;
  basePrice: number;
  loyaltyEligible: boolean;
  serviceType: ServiceType;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  vehiclePlate: string;
  branchName: string;
  employeeName: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  createdAt: string;
  membershipTier: MembershipTier;
}

export interface MembershipLevel {
  tier: MembershipTier;
  nameAr: string;
  requiredWashes: number;
  discountPercentage: number;
  customerCount: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayWashes: number;
  totalCustomers: number;
  newCustomers: number;
  activeMembers: number;
}

export type AppPage =
  | 'dashboard'
  | 'register-wash'
  | 'customers'
  | 'invoices'
  | 'loyalty'
  | 'reports'
  | 'settings';

export interface WashPreview {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  membershipTier: MembershipTier;
  loyaltyEligible: boolean;
  freeWashAvailable: boolean;
}

export interface WashSuccess {
  invoiceNumber: string;
  totalAmount: number;
  membershipTier: MembershipTier;
  eligibleWashesCount: number;
  promoted: boolean;
  freeWashEarned: boolean;
}
