import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clean DB
  await prisma.budget.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.tripActivity.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.savedPlace.deleteMany();
  await prisma.place.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash("password123", 12);
  
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@globetrotter.app",
      passwordHash: hashedPassword,
      role: "ADMIN",
      languagePreference: "en",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Nisarg Vaghela",
      email: "nisarg@example.com",
      passwordHash: hashedPassword,
      role: "USER",
      languagePreference: "en",
    },
  });

  console.log("Users created:", { admin: admin.email, user: user.email });

  // Create Places
  const paris = await prisma.place.create({
    data: {
      type: "CITY",
      externalProvider: "geodb",
      externalPlaceId: "geodb-paris",
      name: "Paris",
      country: "France",
      latitude: 48.8566,
      longitude: 2.3522,
      costIndex: 85,
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      metadata: { description: "The City of Light" },
    }
  });

  const amsterdam = await prisma.place.create({
    data: {
      type: "CITY",
      externalProvider: "geodb",
      externalPlaceId: "geodb-amsterdam",
      name: "Amsterdam",
      country: "Netherlands",
      latitude: 52.3676,
      longitude: 4.9041,
      costIndex: 78,
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017",
      metadata: { description: "Famous for its canals" },
    }
  });

  const louvre = await prisma.place.create({
    data: {
      type: "ACTIVITY",
      externalProvider: "opentripmap",
      externalPlaceId: "otm-louvre",
      name: "Louvre Museum",
      country: "France",
      latitude: 48.8606,
      longitude: 2.3376,
      category: "museum",
      rating: 4.9,
    }
  });

  // Create Trip
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: "Euro Summer 2026",
      description: "Backpacking through France and Netherlands",
      coverPhotoUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-06-25"),
      status: "PLANNED",
      currency: "EUR",
      isPublic: true,
      
      stops: {
        create: [
          {
            cityPlaceId: paris.id,
            orderIndex: 0,
            startDate: new Date("2026-06-15"),
            endDate: new Date("2026-06-20"),
            budgetLimit: 1500,
            
            activities: {
              create: [
                {
                  placeId: louvre.id,
                  scheduledDate: new Date("2026-06-16"),
                  startTime: new Date("1970-01-01T09:00:00Z"),
                  endTime: new Date("1970-01-01T13:00:00Z"),
                  orderIndex: 0,
                  estimatedCost: 22,
                  status: "PLANNED"
                }
              ]
            }
          },
          {
            cityPlaceId: amsterdam.id,
            orderIndex: 1,
            startDate: new Date("2026-06-20"),
            endDate: new Date("2026-06-25"),
            budgetLimit: 1200,
          }
        ]
      },
      
      budgets: {
        create: [
          { category: "OVERALL", limitAmount: 3000, currency: "EUR" },
          { category: "STAY", limitAmount: 1200, currency: "EUR" }
        ]
      },
      
      expenses: {
        create: [
          { category: "TRANSPORT", amount: 450, currency: "EUR", description: "Flights" }
        ]
      }
    }
  });

  console.log("Trip created:", trip.name);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
