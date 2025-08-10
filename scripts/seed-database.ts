import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create super admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@vwashcar.com" },
    update: {},
    create: {
      email: "admin@vwashcar.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Super admin created:", superAdmin.email);

  // Create sample sites
  const siteData = [
    {
      name: "Downtown Car Wash",
      location: "123 Main Street, Downtown",
      status: "ACTIVE" as const,
      adminId: superAdmin.id,
    },
    {
      name: "Mall Car Wash",
      location: "456 Shopping Center, Mall Area",
      status: "ACTIVE" as const,
      adminId: superAdmin.id,
    },
    {
      name: "Highway Car Wash",
      location: "789 Highway Exit, Suburb",
      status: "ACTIVE" as const,
      adminId: superAdmin.id,
    },
  ];

  const sites = [];
  for (const siteInfo of siteData) {
    // Check if site exists by name
    const existingSite = await prisma.site.findFirst({
      where: { name: siteInfo.name },
    });

    if (existingSite) {
      // Update existing site
      const updatedSite = await prisma.site.update({
        where: { id: existingSite.id },
        data: siteInfo,
      });
      sites.push(updatedSite);
    } else {
      // Create new site
      const newSite = await prisma.site.create({
        data: siteInfo,
      });
      sites.push(newSite);
    }
  }

  console.log("✅ Sites created:", sites.length);

  // Create sample services
  const serviceData = [
    {
      name: "Basic Wash",
      type: "PACKAGE" as const,
      description: "Exterior wash with basic cleaning",
    },
    {
      name: "Premium Wash",
      type: "PACKAGE" as const,
      description: "Exterior and interior cleaning with wax",
    },
    {
      name: "Ultimate Wash",
      type: "PACKAGE" as const,
      description: "Complete cleaning with detailing and protection",
    },
    {
      name: "Interior Cleaning",
      type: "ADDON" as const,
      description: "Deep interior cleaning and sanitization",
    },
    {
      name: "Wax Protection",
      type: "ADDON" as const,
      description: "Premium wax application for paint protection",
    },
  ];

  const services = [];
  for (const serviceInfo of serviceData) {
    // Check if service exists by name
    const existingService = await prisma.service.findFirst({
      where: { name: serviceInfo.name },
    });

    if (existingService) {
      // Update existing service
      const updatedService = await prisma.service.update({
        where: { id: existingService.id },
        data: serviceInfo,
      });
      services.push(updatedService);
    } else {
      // Create new service
      const newService = await prisma.service.create({
        data: serviceInfo,
      });
      services.push(newService);
    }
  }

  console.log("✅ Services created:", services.length);

  // Create service pricing
  const vehicleTypes: Array<
    "SEDAN" | "SUV" | "FOUR_BY_FOUR" | "PICKUP" | "MOTORCYCLE" | "OTHER"
  > = ["SEDAN", "SUV", "FOUR_BY_FOUR", "PICKUP", "MOTORCYCLE", "OTHER"];
  const pricingData = [];

  for (const service of services) {
    for (const vehicleType of vehicleTypes) {
      let basePrice = 0;

      switch (service.name) {
        case "Basic Wash":
          basePrice =
            vehicleType === "MOTORCYCLE"
              ? 15
              : vehicleType === "SEDAN"
              ? 25
              : 35;
          break;
        case "Premium Wash":
          basePrice =
            vehicleType === "MOTORCYCLE"
              ? 25
              : vehicleType === "SEDAN"
              ? 40
              : 55;
          break;
        case "Ultimate Wash":
          basePrice =
            vehicleType === "MOTORCYCLE"
              ? 40
              : vehicleType === "SEDAN"
              ? 65
              : 85;
          break;
        case "Interior Cleaning":
          basePrice =
            vehicleType === "MOTORCYCLE"
              ? 20
              : vehicleType === "SEDAN"
              ? 30
              : 45;
          break;
        case "Wax Protection":
          basePrice =
            vehicleType === "MOTORCYCLE"
              ? 15
              : vehicleType === "SEDAN"
              ? 25
              : 35;
          break;
      }

      pricingData.push({
        serviceId: service.id,
        vehicleType,
        price: basePrice,
      });
    }
  }

  // Clear existing pricing and create new ones
  await prisma.servicePricing.deleteMany();

  const pricing = await prisma.servicePricing.createMany({
    data: pricingData,
  });

  console.log("✅ Service pricing created:", pricing.count);

  // Create sample admin users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const adminUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "downtown@vwashcar.com" },
      update: {},
      create: {
        email: "downtown@vwashcar.com",
        name: "Downtown Manager",
        password: adminPassword,
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "mall@vwashcar.com" },
      update: {},
      create: {
        email: "mall@vwashcar.com",
        name: "Mall Manager",
        password: adminPassword,
        role: "ADMIN",
      },
    }),
  ]);

  console.log("✅ Admin users created:", adminUsers.length);

  // Assign admins to sites
  const downtownSite = await prisma.site.findFirst({
    where: { name: "Downtown Car Wash" },
  });
  if (downtownSite) {
    await prisma.site.update({
      where: { id: downtownSite.id },
      data: { adminId: adminUsers[0].id },
    });
  }

  const mallSite = await prisma.site.findFirst({
    where: { name: "Mall Car Wash" },
  });
  if (mallSite) {
    await prisma.site.update({
      where: { id: mallSite.id },
      data: { adminId: adminUsers[1].id },
    });
  }

  // Create sample salesman users
  const salesmanPassword = await bcrypt.hash("sales123", 12);
  const salesmen = await Promise.all([
    prisma.user.upsert({
      where: { email: "sales1@vwashcar.com" },
      update: {},
      create: {
        email: "sales1@vwashcar.com",
        name: "John Salesman",
        password: salesmanPassword,
        role: "SALESMAN",
      },
    }),
    prisma.user.upsert({
      where: { email: "sales2@vwashcar.com" },
      update: {},
      create: {
        email: "sales2@vwashcar.com",
        name: "Jane Saleswoman",
        password: salesmanPassword,
        role: "SALESMAN",
      },
    }),
  ]);

  console.log("✅ Salesmen created:", salesmen.length);

  // Assign salesmen to sites
  const downtownSiteForSalesman = await prisma.site.findFirst({
    where: { name: "Downtown Car Wash" },
  });
  const mallSiteForSalesman = await prisma.site.findFirst({
    where: { name: "Mall Car Wash" },
  });
  const highwaySiteForSalesman = await prisma.site.findFirst({
    where: { name: "Highway Car Wash" },
  });

  await prisma.user.update({
    where: { id: salesmen[0].id },
    data: {
      salesmanSites: {
        connect: [
          ...(downtownSiteForSalesman
            ? [{ id: downtownSiteForSalesman.id }]
            : []),
          ...(mallSiteForSalesman ? [{ id: mallSiteForSalesman.id }] : []),
        ],
      },
    },
  });

  await prisma.user.update({
    where: { id: salesmen[1].id },
    data: {
      salesmanSites: {
        connect: highwaySiteForSalesman
          ? [{ id: highwaySiteForSalesman.id }]
          : [],
      },
    },
  });

  // Create sample bookings
  const sampleBookings = [];
  const plateNumbers = ["ABC123", "XYZ789", "DEF456", "GHI789", "JKL012"];
  const statuses: Array<"WAITING" | "IN_PROGRESS" | "COMPLETED"> = [
    "WAITING",
    "IN_PROGRESS",
    "COMPLETED",
  ];
  const paymentMethods: Array<"CASH" | "CARD"> = ["CASH", "CARD"];

  for (let i = 0; i < 20; i++) {
    const site = sites[Math.floor(Math.random() * sites.length)];
    const plateNumber =
      plateNumbers[Math.floor(Math.random() * plateNumbers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod =
      status === "COMPLETED"
        ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
        : null;
    const vehicleType =
      vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];

    const bookingId = `BK${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
    const arrivalTime = new Date(
      Date.now() - Math.random() * 24 * 60 * 60 * 1000
    );

    const booking = await prisma.booking.create({
      data: {
        bookingId,
        plateNumber,
        vehicleType,
        phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        status,
        paymentMethod,
        arrivalTime,
        siteId: site.id,
        services: {
          create: [
            {
              serviceId:
                services[Math.floor(Math.random() * services.length)].id,
              price: Math.floor(Math.random() * 50) + 20,
            },
          ],
        },
      },
    });

    sampleBookings.push(booking);
  }

  console.log("✅ Sample bookings created:", sampleBookings.length);

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("Super Admin: admin@vwashcar.com / admin123");
  console.log("Downtown Admin: downtown@vwashcar.com / admin123");
  console.log("Mall Admin: mall@vwashcar.com / admin123");
  console.log("Salesman 1: sales1@vwashcar.com / sales123");
  console.log("Salesman 2: sales2@vwashcar.com / sales123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
