import type { Customer, MembershipTier, Service, WashPreview } from '../types';

const TIER_THRESHOLDS: { tier: MembershipTier; washes: number; discount: number }[] = [
  { tier: 'diamond', washes: 20, discount: 20 },
  { tier: 'gold', washes: 15, discount: 15 },
  { tier: 'silver', washes: 10, discount: 10 },
  { tier: 'bronze', washes: 5, discount: 5 },
];

export function getTierFromWashes(count: number): MembershipTier {
  for (const level of TIER_THRESHOLDS) {
    if (count >= level.washes) {
      return level.tier;
    }
  }
  return 'none';
}

export function getDiscountForCustomer(customer: Customer): number {
  if (customer.membershipStatus !== 'active') {
    return 0;
  }
  return customer.discountPercentage;
}

export function calculateWashPreview(
  customer: Customer,
  selectedServices: Service[],
  useFreeWash: boolean,
): WashPreview {
  const subtotal = selectedServices.reduce((sum, service) => sum + service.basePrice, 0);
  const loyaltyEligible = selectedServices.some((service) => service.loyaltyEligible);
  const discountPercentage = useFreeWash ? 100 : getDiscountForCustomer(customer);
  const discountAmount = useFreeWash
    ? subtotal
    : Math.round((subtotal * discountPercentage) / 100 * 100) / 100;
  const totalAmount = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  return {
    subtotal,
    discountPercentage,
    discountAmount,
    totalAmount,
    membershipTier: customer.membershipTier,
    loyaltyEligible,
    freeWashAvailable: customer.freeWashesAvailable > 0,
  };
}

export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} ر.س`;
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export function formatShortDate(dateString: string): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}
