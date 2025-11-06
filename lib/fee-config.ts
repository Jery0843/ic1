// Fee Configuration
export const FEE_STRUCTURE = {
  'Student (with ID)': {
    earlyBird: 8000,
    regular: 10000,
    onsite: 12000,
  },
  'Academic/Researcher': {
    earlyBird: 10000,
    regular: 12000,
    onsite: 14000,
  },
  'Industry/Corporate': {
    earlyBird: 10000,
    regular: 12000,
    onsite: 14000,
  },
  'Accompanying Person': {
    earlyBird: 4000,
    regular: 5000,
    onsite: 7000,
  },
  'Workshop Only (Optional)': {
    earlyBird: 2000,
    regular: 3000,
    onsite: 4000,
  },
};

// Date thresholds
export const EARLY_BIRD_DEADLINE = new Date('2026-01-31T23:59:59');
export const REGULAR_DEADLINE = new Date('2026-02-20T23:59:59');

// Get current pricing tier based on date
export function getCurrentPricingTier(): 'earlyBird' | 'regular' | 'onsite' {
  const now = new Date();
  
  if (now <= EARLY_BIRD_DEADLINE) {
    return 'earlyBird';
  } else if (now <= REGULAR_DEADLINE) {
    return 'regular';
  } else {
    return 'onsite';
  }
}

// Get fee for a category
export function getFeeForCategory(category: string): number {
  const tier = getCurrentPricingTier();
  const categoryFee = FEE_STRUCTURE[category as keyof typeof FEE_STRUCTURE];
  
  if (!categoryFee) {
    return 0;
  }
  
  return categoryFee[tier];
}

// Format currency
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
