// GlobeTrotter — TypeScript types matching Architecture.md § 6

export type UserRole = 'user' | 'admin';
export type TripStatus = 'draft' | 'planned' | 'completed';
export type PlaceType = 'city' | 'activity';
export type ActivityStatus = 'planned' | 'completed' | 'cancelled';
export type ExpenseCategory = 'transport' | 'stay' | 'activity' | 'meals' | 'other';
export type BudgetCategory = ExpenseCategory | 'overall';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  city?: string;
  country?: string;
  languagePreference: string;
  role: UserRole;
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  currency: string;
  isPublic: boolean;
  shareToken?: string;
  copiedFromTripId?: string;
  stops: TripStop[];
  createdAt: string;
  updatedAt: string;
}

export interface TripStop {
  id: string;
  tripId: string;
  place: Place;
  orderIndex: number;
  startDate: string;
  endDate: string;
  budgetLimit?: number;
  activities: TripActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  type: PlaceType;
  externalProvider: string;
  externalPlaceId: string;
  name: string;
  country?: string;
  region?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  costIndex?: number;
  rating?: number;
  imageUrl?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  cachedAt: string;
}

export interface TripActivity {
  id: string;
  tripStopId: string;
  place: Place;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  orderIndex: number;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  tripId: string;
  tripActivityId?: string;
  category: ExpenseCategory;
  description?: string;
  amount: number;
  currency: string;
  expenseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  tripId: string;
  category: BudgetCategory;
  limitAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedPlace {
  id: string;
  userId: string;
  placeId: string;
  place: Place;
  createdAt: string;
}

// UI-specific types
export interface BudgetSummary {
  total: number;
  byCategory: Record<ExpenseCategory, number>;
  byDay: { date: string; amount: number }[];
  budgetLimits: Record<BudgetCategory, number>;
  currency: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}
