// GlobeTrotter — Mock Data Layer
// Isolated mock data for UI development. Replace with real API calls later.

import {
  Trip,
  TripStop,
  Place,
  TripActivity,
  Expense,
  User,
  BudgetSummary,
} from "@/types";

// ─── Current User ────────────────────────────────────────────────
export const currentUser: User = {
  id: "user-1",
  name: "Nisarg Vaghela",
  email: "nisarg@example.com",
  avatarUrl: undefined,
  phone: "+91 98765 43210",
  city: "Ahmedabad",
  country: "India",
  languagePreference: "en",
  role: "user",
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-08-20T10:00:00Z",
};

// ─── Cities (Places with type='city') ────────────────────────────
export const mockCities: Place[] = [
  {
    id: "city-1",
    type: "city",
    externalProvider: "geodb",
    externalPlaceId: "paris-fr",
    name: "Paris",
    country: "France",
    region: "Europe",
    latitude: 48.8566,
    longitude: 2.3522,
    costIndex: 85,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    description: "The City of Light, known for its art, fashion, and culture.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "city-2",
    type: "city",
    externalProvider: "geodb",
    externalPlaceId: "amsterdam-nl",
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    latitude: 52.3676,
    longitude: 4.9041,
    costIndex: 78,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=400&fit=crop",
    description: "Famous for its canals, cycling culture, and vibrant nightlife.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "city-3",
    type: "city",
    externalProvider: "geodb",
    externalPlaceId: "berlin-de",
    name: "Berlin",
    country: "Germany",
    region: "Europe",
    latitude: 52.52,
    longitude: 13.405,
    costIndex: 65,
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&h=400&fit=crop",
    description: "A city rich in history, art, and a thriving tech scene.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "city-4",
    type: "city",
    externalProvider: "geodb",
    externalPlaceId: "tokyo-jp",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    latitude: 35.6762,
    longitude: 139.6503,
    costIndex: 82,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
    description: "A fascinating blend of traditional temples and ultramodern skyscrapers.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "city-5",
    type: "city",
    externalProvider: "geodb",
    externalPlaceId: "dubai-ae",
    name: "Dubai",
    country: "UAE",
    region: "Middle East",
    latitude: 25.2048,
    longitude: 55.2708,
    costIndex: 90,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    description: "Known for luxury shopping, ultramodern architecture, and vibrant nightlife.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "city-6",
    type: "city",
    externalProvider: "geodb",
    externalPlaceId: "london-gb",
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    latitude: 51.5074,
    longitude: -0.1278,
    costIndex: 92,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop",
    description: "A global city known for its history, culture, and iconic landmarks.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "city-7",
    type: "city",
    externalProvider: "geodb",
    externalPlaceId: "singapore-sg",
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    latitude: 1.3521,
    longitude: 103.8198,
    costIndex: 88,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop",
    description: "A city-state known for its cleanliness, food scene, and Gardens by the Bay.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "city-8",
    type: "city",
    externalProvider: "geodb",
    externalPlaceId: "mumbai-in",
    name: "Mumbai",
    country: "India",
    region: "Asia",
    latitude: 19.076,
    longitude: 72.8777,
    costIndex: 35,
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop",
    description: "India's financial capital, known for Bollywood, street food, and colonial architecture.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
];

// ─── Activities (Places with type='activity') ────────────────────
export const mockActivities: Place[] = [
  {
    id: "act-1",
    type: "activity",
    externalProvider: "opentripmap",
    externalPlaceId: "eiffel-tower",
    name: "Eiffel Tower",
    country: "France",
    category: "sightseeing",
    latitude: 48.8584,
    longitude: 2.2945,
    costIndex: 25,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&h=400&fit=crop",
    description: "Iconic iron lattice tower on the Champ de Mars. Visit the top for panoramic views.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "act-2",
    type: "activity",
    externalProvider: "opentripmap",
    externalPlaceId: "louvre-museum",
    name: "Louvre Museum",
    country: "France",
    category: "culture",
    latitude: 48.8606,
    longitude: 2.3376,
    costIndex: 17,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&h=400&fit=crop",
    description: "World's largest art museum, home to the Mona Lisa and thousands of masterpieces.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "act-3",
    type: "activity",
    externalProvider: "opentripmap",
    externalPlaceId: "seine-cruise",
    name: "Seine River Cruise",
    country: "France",
    category: "adventure",
    latitude: 48.8584,
    longitude: 2.2945,
    costIndex: 15,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=600&h=400&fit=crop",
    description: "A scenic boat cruise along the Seine with views of Paris landmarks.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "act-4",
    type: "activity",
    externalProvider: "opentripmap",
    externalPlaceId: "anne-frank-house",
    name: "Anne Frank House",
    country: "Netherlands",
    category: "culture",
    latitude: 52.3752,
    longitude: 4.884,
    costIndex: 14,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=600&h=400&fit=crop",
    description: "The hiding place of Anne Frank during WWII, now a biographical museum.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "act-5",
    type: "activity",
    externalProvider: "opentripmap",
    externalPlaceId: "rijksmuseum",
    name: "Rijksmuseum",
    country: "Netherlands",
    category: "culture",
    latitude: 52.36,
    longitude: 4.8852,
    costIndex: 20,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1582654454409-778c30e16e80?w=600&h=400&fit=crop",
    description: "Dutch national museum dedicated to arts and history, featuring Rembrandt and Vermeer.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "act-6",
    type: "activity",
    externalProvider: "opentripmap",
    externalPlaceId: "brandenburg-gate",
    name: "Brandenburg Gate",
    country: "Germany",
    category: "sightseeing",
    latitude: 52.5163,
    longitude: 13.3777,
    costIndex: 0,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=600&h=400&fit=crop",
    description: "An 18th-century neoclassical monument and one of Berlin's most iconic landmarks.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "act-7",
    type: "activity",
    externalProvider: "opentripmap",
    externalPlaceId: "berlin-wall-memorial",
    name: "Berlin Wall Memorial",
    country: "Germany",
    category: "culture",
    latitude: 52.535,
    longitude: 13.39,
    costIndex: 0,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&h=400&fit=crop",
    description: "Memorial site preserving a section of the Berlin Wall with exhibits on its history.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "act-8",
    type: "activity",
    externalProvider: "opentripmap",
    externalPlaceId: "burj-khalifa",
    name: "Burj Khalifa",
    country: "UAE",
    category: "sightseeing",
    latitude: 25.1972,
    longitude: 55.2744,
    costIndex: 40,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&h=400&fit=crop",
    description: "The world's tallest building with observation decks offering stunning city views.",
    cachedAt: "2026-08-20T10:00:00Z",
  },
];

// ─── Sample Trips ────────────────────────────────────────────────
const europeActivities: TripActivity[] = [
  {
    id: "ta-1",
    tripStopId: "stop-1",
    place: mockActivities[0], // Eiffel Tower
    scheduledDate: "2026-09-12",
    startTime: "09:00",
    endTime: "11:00",
    orderIndex: 0,
    estimatedCost: 2500,
    status: "planned",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "ta-2",
    tripStopId: "stop-1",
    place: mockActivities[1], // Louvre
    scheduledDate: "2026-09-12",
    startTime: "13:00",
    endTime: "16:00",
    orderIndex: 1,
    estimatedCost: 1700,
    status: "planned",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "ta-3",
    tripStopId: "stop-1",
    place: mockActivities[2], // Seine Cruise
    scheduledDate: "2026-09-13",
    startTime: "17:00",
    endTime: "19:00",
    orderIndex: 0,
    estimatedCost: 1500,
    status: "planned",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "ta-4",
    tripStopId: "stop-2",
    place: mockActivities[3], // Anne Frank House
    scheduledDate: "2026-09-16",
    startTime: "10:00",
    endTime: "12:00",
    orderIndex: 0,
    estimatedCost: 1400,
    status: "planned",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "ta-5",
    tripStopId: "stop-2",
    place: mockActivities[4], // Rijksmuseum
    scheduledDate: "2026-09-16",
    startTime: "14:00",
    endTime: "17:00",
    orderIndex: 1,
    estimatedCost: 2000,
    status: "planned",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "ta-6",
    tripStopId: "stop-3",
    place: mockActivities[5], // Brandenburg Gate
    scheduledDate: "2026-09-19",
    startTime: "10:00",
    endTime: "11:30",
    orderIndex: 0,
    estimatedCost: 0,
    status: "planned",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "ta-7",
    tripStopId: "stop-3",
    place: mockActivities[6], // Berlin Wall
    scheduledDate: "2026-09-19",
    startTime: "13:00",
    endTime: "15:00",
    orderIndex: 1,
    estimatedCost: 0,
    status: "planned",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
];

const europeStops: TripStop[] = [
  {
    id: "stop-1",
    tripId: "trip-1",
    place: mockCities[0], // Paris
    orderIndex: 0,
    startDate: "2026-09-12",
    endDate: "2026-09-15",
    activities: europeActivities.filter((a) => a.tripStopId === "stop-1"),
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "stop-2",
    tripId: "trip-1",
    place: mockCities[1], // Amsterdam
    orderIndex: 1,
    startDate: "2026-09-15",
    endDate: "2026-09-18",
    activities: europeActivities.filter((a) => a.tripStopId === "stop-2"),
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "stop-3",
    tripId: "trip-1",
    place: mockCities[2], // Berlin
    orderIndex: 2,
    startDate: "2026-09-18",
    endDate: "2026-09-22",
    activities: europeActivities.filter((a) => a.tripStopId === "stop-3"),
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
];

export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    userId: "user-1",
    name: "Europe Adventure",
    description: "A 10-day journey through Paris, Amsterdam, and Berlin exploring art, culture, and history.",
    coverPhotoUrl: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&h=400&fit=crop",
    startDate: "2026-09-12",
    endDate: "2026-09-22",
    status: "planned",
    currency: "INR",
    isPublic: true,
    shareToken: "abc123",
    stops: europeStops,
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "trip-2",
    userId: "user-1",
    name: "Dubai Getaway",
    description: "A luxurious 5-day escape to Dubai with world-class architecture and dining.",
    coverPhotoUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop",
    startDate: "2026-10-05",
    endDate: "2026-10-10",
    status: "draft",
    currency: "INR",
    isPublic: false,
    stops: [
      {
        id: "stop-4",
        tripId: "trip-2",
        place: mockCities[4], // Dubai
        orderIndex: 0,
        startDate: "2026-10-05",
        endDate: "2026-10-10",
        activities: [
          {
            id: "ta-8",
            tripStopId: "stop-4",
            place: mockActivities[7], // Burj Khalifa
            scheduledDate: "2026-10-06",
            startTime: "10:00",
            endTime: "12:00",
            orderIndex: 0,
            estimatedCost: 4000,
            status: "planned",
            createdAt: "2026-08-20T10:00:00Z",
            updatedAt: "2026-08-20T10:00:00Z",
          },
        ],
        createdAt: "2026-08-20T10:00:00Z",
        updatedAt: "2026-08-20T10:00:00Z",
      },
    ],
    createdAt: "2026-08-15T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "trip-3",
    userId: "user-1",
    name: "Tokyo Explorer",
    description: "5 days exploring the blend of traditional and modern Tokyo.",
    coverPhotoUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop",
    startDate: "2026-06-10",
    endDate: "2026-06-15",
    status: "completed",
    currency: "INR",
    isPublic: true,
    shareToken: "xyz789",
    stops: [
      {
        id: "stop-5",
        tripId: "trip-3",
        place: mockCities[3], // Tokyo
        orderIndex: 0,
        startDate: "2026-06-10",
        endDate: "2026-06-15",
        activities: [],
        createdAt: "2026-05-20T10:00:00Z",
        updatedAt: "2026-06-15T10:00:00Z",
      },
    ],
    createdAt: "2026-05-20T10:00:00Z",
    updatedAt: "2026-06-15T10:00:00Z",
  },
];

// ─── Community Trips (public trips from other users) ─────────────
export const mockCommunityTrips: Trip[] = [
  {
    id: "trip-c1",
    userId: "user-2",
    name: "Southeast Asia Backpacking",
    description: "3 weeks through Thailand, Vietnam, and Cambodia on a budget.",
    coverPhotoUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=400&fit=crop",
    startDate: "2026-11-01",
    endDate: "2026-11-21",
    status: "planned",
    currency: "INR",
    isPublic: true,
    shareToken: "comm1",
    stops: [],
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-08-18T10:00:00Z",
  },
  {
    id: "trip-c2",
    userId: "user-3",
    name: "London & Edinburgh",
    description: "A week split between London and Edinburgh exploring British culture.",
    coverPhotoUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop",
    startDate: "2026-12-20",
    endDate: "2026-12-28",
    status: "planned",
    currency: "INR",
    isPublic: true,
    shareToken: "comm2",
    stops: [],
    createdAt: "2026-08-12T10:00:00Z",
    updatedAt: "2026-08-19T10:00:00Z",
  },
];

// ─── Mock Expenses ───────────────────────────────────────────────
export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    tripId: "trip-1",
    category: "transport",
    description: "Round-trip flights",
    amount: 45000,
    currency: "INR",
    expenseDate: "2026-09-12",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "exp-2",
    tripId: "trip-1",
    category: "stay",
    description: "Hotels across 3 cities",
    amount: 35000,
    currency: "INR",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "exp-3",
    tripId: "trip-1",
    category: "meals",
    description: "Estimated food budget",
    amount: 15000,
    currency: "INR",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
];

// ─── Mock Budget Summary ─────────────────────────────────────────
export function getBudgetSummary(tripId: string): BudgetSummary {
  const trip = mockTrips.find((t) => t.id === tripId);
  if (!trip) {
    return {
      total: 0,
      byCategory: { transport: 0, stay: 0, activity: 0, meals: 0, other: 0 },
      byDay: [],
      budgetLimits: { transport: 0, stay: 0, activity: 0, meals: 0, other: 0, overall: 0 },
      currency: "INR",
    };
  }

  const activityCost = trip.stops
    .flatMap((s) => s.activities)
    .reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

  const expenses = mockExpenses.filter((e) => e.tripId === tripId);
  const transportCost = expenses
    .filter((e) => e.category === "transport")
    .reduce((sum, e) => sum + e.amount, 0);
  const stayCost = expenses
    .filter((e) => e.category === "stay")
    .reduce((sum, e) => sum + e.amount, 0);
  const mealsCost = expenses
    .filter((e) => e.category === "meals")
    .reduce((sum, e) => sum + e.amount, 0);
  const otherCost = expenses
    .filter((e) => e.category === "other")
    .reduce((sum, e) => sum + e.amount, 0);

  return {
    total: activityCost + transportCost + stayCost + mealsCost + otherCost,
    byCategory: {
      transport: transportCost,
      stay: stayCost,
      activity: activityCost,
      meals: mealsCost,
      other: otherCost,
    },
    byDay: [
      { date: "2026-09-12", amount: 12200 },
      { date: "2026-09-13", amount: 8500 },
      { date: "2026-09-14", amount: 5000 },
      { date: "2026-09-15", amount: 6000 },
      { date: "2026-09-16", amount: 11400 },
      { date: "2026-09-17", amount: 5000 },
      { date: "2026-09-18", amount: 6000 },
      { date: "2026-09-19", amount: 8000 },
      { date: "2026-09-20", amount: 5000 },
      { date: "2026-09-21", amount: 5000 },
      { date: "2026-09-22", amount: 4000 },
    ],
    budgetLimits: {
      transport: 50000,
      stay: 40000,
      activity: 15000,
      meals: 18000,
      other: 5000,
      overall: 120000,
    },
    currency: "INR",
  };
}

// ─── Mock Service Functions ──────────────────────────────────────
export function getTrips(): Trip[] {
  return mockTrips;
}

export function getTrip(id: string): Trip | undefined {
  return mockTrips.find((t) => t.id === id);
}

export function getCities(query?: string): Place[] {
  if (!query) return mockCities;
  return mockCities.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.country?.toLowerCase().includes(query.toLowerCase())
  );
}

export function getActivities(query?: string, category?: string): Place[] {
  let results = mockActivities;
  if (query) {
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.category?.toLowerCase().includes(query.toLowerCase())
    );
  }
  if (category) {
    results = results.filter((a) => a.category === category);
  }
  return results;
}

export function getCommunityTrips(): Trip[] {
  return mockCommunityTrips;
}

// ─── Utility: format currency ────────────────────────────────────
export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Utility: format date ────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
