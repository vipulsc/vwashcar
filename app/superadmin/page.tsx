"use client";
import React, { useState } from "react";
import {
  BarChart3,
  MapPin,
  Users,
  UserCheck,
  Settings,
  Car,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Import components
import { Navigation } from "./components/Navigation";
import { Overview } from "./components/Overview";
import { SitesManagement } from "./components/SitesManagement";
import { CoordinatorsManagement } from "./components/CoordinatorsManagement";
import { SalesmenManagement } from "./components/SalesmenManagement";
import { ServicesManagement } from "./components/ServicesManagement";
import { CarsHistory } from "./components/CarsHistory";
import { AddSiteModal } from "./components/modals/AddSiteModal";
import { CredentialsModal } from "./components/modals/CredentialsModal";
import { AddServiceModal } from "./components/modals/AddServiceModal";
import { AddCoordinatorModal } from "./components/modals/AddCoordinatorModal";
import { AddSalesmanModal } from "./components/modals/AddSalesmanModal";

// Import types
import {
  Site,
  Coordinator,
  Salesman,
  CarStatus,
  Service,
} from "./components/types";

const SuperAdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal states
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [showAddCoordinatorModal, setShowAddCoordinatorModal] = useState(false);
  const [showAddSalesmanModal, setShowAddSalesmanModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditSiteModal, setShowEditSiteModal] = useState(false);
  const [showEditCoordinatorModal, setShowEditCoordinatorModal] =
    useState(false);
  const [showEditSalesmanModal, setShowEditSalesmanModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showEditCarModal, setShowEditCarModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  // Form states
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [editingCoordinator, setEditingCoordinator] =
    useState<Coordinator | null>(null);
  const [editingSalesman, setEditingSalesman] = useState<Salesman | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCar, setEditingCar] = useState<CarStatus | null>(null);

  const [generatedCredentials, setGeneratedCredentials] = useState<{
    password: string;
    email: string;
  } | null>(null);

  // Form data states
  const [newSiteData, setNewSiteData] = useState({
    name: "",
    location: "",
    coordinator: "",
    salesmen: [] as string[],
  });

  const [newCoordinatorData, setNewCoordinatorData] = useState({
    name: "",
    email: "",
  });

  const [newSalesmanData, setNewSalesmanData] = useState({
    name: "",
    email: "",
  });

  const [newServiceData, setNewServiceData] = useState({
    name: "",
    type: "package" as "package" | "addon",
    pricing: {
      sedan: "",
      suv: "",
      "4x4": "",
      pickup: "",
      motorcycle: "",
    },
  });

  const [editSiteData, setEditSiteData] = useState({
    name: "",
    location: "",
    coordinator: "",
    salesmen: [] as string[],
  });

  const [editCoordinatorData, setEditCoordinatorData] = useState({
    name: "",
    email: "",
  });

  const [editSalesmanData, setEditSalesmanData] = useState({
    name: "",
    email: "",
  });

  const [editServiceData, setEditServiceData] = useState({
    name: "",
    type: "package" as "package" | "addon",
    description: "",
    pricing: {
      sedan: "",
      suv: "",
      "4x4": "",
      pickup: "",
      motorcycle: "",
    },
  });

  const [editCarData, setEditCarData] = useState({
    service: "",
    addons: [] as string[],
    status: "waiting" as "in-progress" | "completed" | "waiting",
  });

  // State for data
  const [sites, setSites] = useState<Site[]>([
    {
      id: 1,
      name: "Dubai Marina",
      location: "Dubai Marina, UAE",
      coordinator: "Ahmed Hassan",
      salesmen: ["Omar Ali", "Fatima Khan"],
      totalRevenue: 145000,
      totalCashRevenue: 58000,
      totalCardRevenue: 87000,
      totalCars: 1456,
      status: "active",
      isActive: true,
      dailyRevenue: [12000, 15000, 18000, 16000, 21000, 19000, 22000],
      monthlyRevenue: [45000, 42000, 48000, 51000, 47000, 145000],
    },
    {
      id: 2,
      name: "Business Bay",
      location: "Business Bay, Dubai",
      coordinator: "Sara Ali",
      salesmen: ["Hassan Ahmed", "Aisha Mohammed"],
      totalRevenue: 128000,
      totalCashRevenue: 51200,
      totalCardRevenue: 76800,
      totalCars: 1242,
      status: "active",
      isActive: true,
      dailyRevenue: [10000, 12000, 14000, 13000, 17000, 15000, 18000],
      monthlyRevenue: [38000, 36000, 40000, 42000, 39000, 128000],
    },
    {
      id: 3,
      name: "JLT Cluster",
      location: "Jumeirah Lake Towers",
      coordinator: "Mohammed Khan",
      salesmen: ["Ali Mohammed"],
      totalRevenue: 132000,
      totalCashRevenue: 52800,
      totalCardRevenue: 79200,
      totalCars: 1134,
      status: "active",
      isActive: false,
      dailyRevenue: [9000, 11000, 13000, 12000, 16000, 14000, 17000],
      monthlyRevenue: [42000, 40000, 44000, 46000, 43000, 132000],
    },
    {
      id: 4,
      name: "Downtown",
      location: "Downtown Dubai",
      coordinator: "Fatima Ahmed",
      salesmen: ["Khalid Rashid", "Noor Hassan", "Ahmed Zayed"],
      totalRevenue: 162000,
      totalCashRevenue: 64800,
      totalCardRevenue: 97200,
      totalCars: 1689,
      status: "active",
      isActive: true,
      dailyRevenue: [14000, 17000, 20000, 18000, 23000, 21000, 24000],
      monthlyRevenue: [52000, 50000, 54000, 56000, 53000, 162000],
    },
  ]);

  const [coordinators, setCoordinators] = useState<Coordinator[]>([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed@carwash.ae",
      sites: ["Dubai Marina"],
      status: "active",
      lastLogin: "2 hours ago",
    },
    {
      id: 2,
      name: "Sara Ali",
      email: "sara@carwash.ae",
      sites: ["Business Bay"],
      status: "active",
      lastLogin: "1 hour ago",
    },
    {
      id: 3,
      name: "Mohammed Khan",
      email: "mohammed@carwash.ae",
      sites: ["JLT Cluster"],
      status: "inactive",
      lastLogin: "2 days ago",
    },
    {
      id: 4,
      name: "Fatima Ahmed",
      email: "fatima@carwash.ae",
      sites: ["Downtown"],
      status: "active",
      lastLogin: "30 minutes ago",
    },
  ]);

  const [salesmen, setSalesmen] = useState<Salesman[]>([
    {
      id: 1,
      name: "Omar Ali",
      email: "omar@carwash.ae",
      sites: ["Dubai Marina"],
      status: "active",
      lastLogin: "1 hour ago",
    },
    {
      id: 2,
      name: "Hassan Ahmed",
      email: "hassan@carwash.ae",
      sites: ["Business Bay"],
      status: "active",
      lastLogin: "3 hours ago",
    },
    {
      id: 3,
      name: "Ali Mohammed",
      email: "alim@carwash.ae",
      sites: ["JLT Cluster"],
      status: "active",
      lastLogin: "5 hours ago",
    },
    {
      id: 4,
      name: "Khalid Rashid",
      email: "khalid@carwash.ae",
      sites: ["Downtown"],
      status: "active",
      lastLogin: "2 hours ago",
    },
  ]);

  const [carsStatus, setCarsStatus] = useState<CarStatus[]>([
    {
      id: 1,
      site: "Dubai Marina",
      carNumber: "DXB-A-1234",
      service: "Premium Wash",
      status: "completed",
      amountPaid: 45,
      servicePrice: 45,
      addons: [],
      timestamp: "2024-08-05 10:30",
      date: "05",
      month: "08",
      year: "2024",
      paymentMethod: "cash",
    },
    {
      id: 2,
      site: "Business Bay",
      carNumber: "SHJ-B-5678",
      service: "Basic Wash",
      status: "in-progress",
      amountPaid: 25,
      servicePrice: 25,
      addons: ["Ceramic Wax"],
      timestamp: "2024-08-05 11:15",
      date: "05",
      month: "08",
      year: "2024",
      paymentMethod: "card",
    },
    {
      id: 3,
      site: "Downtown",
      carNumber: "AUH-C-9012",
      service: "Deluxe Wash",
      status: "waiting",
      amountPaid: 0,
      servicePrice: 65,
      addons: ["Paint Polish", "Engine Clean"],
      timestamp: "2024-08-05 11:45",
      date: "05",
      month: "08",
      year: "2024",
      paymentMethod: "cash",
    },
    {
      id: 4,
      site: "JLT Cluster",
      carNumber: "RAK-D-3456",
      service: "Premium Wash",
      status: "completed",
      amountPaid: 45,
      servicePrice: 45,
      addons: [],
      timestamp: "2024-08-04 16:30",
      date: "04",
      month: "08",
      year: "2024",
      paymentMethod: "card",
    },
    {
      id: 5,
      site: "Dubai Marina",
      carNumber: "DXB-E-5678",
      service: "Full Detail",
      status: "in-progress",
      amountPaid: 60,
      servicePrice: 120,
      addons: ["Ceramic Wax", "Paint Polish"],
      timestamp: "2024-08-05 09:30",
      date: "05",
      month: "08",
      year: "2024",
      paymentMethod: "card",
    },
    {
      id: 6,
      site: "Business Bay",
      carNumber: "SHJ-F-9012",
      service: "Basic Wash",
      status: "waiting",
      amountPaid: 0,
      servicePrice: 25,
      addons: [],
      timestamp: "2024-08-05 12:00",
      date: "05",
      month: "08",
      year: "2024",
      paymentMethod: "cash",
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Basic",
      type: "package",
      description: "Exterior wash & dry",
      pricing: {
        sedan: 20,
        suv: 25,
        "4x4": 35,
        pickup: 30,
        motorcycle: 15,
      },
      totalUsage: 245,
      totalRevenue: 6125,
      totalCashRevenue: 2450,
      totalCardRevenue: 3675,
    },
    {
      id: 2,
      name: "Jack",
      type: "package",
      description: "Exterior wash, interior vacuum",
      pricing: {
        sedan: 40,
        suv: 45,
        "4x4": 60,
        pickup: 50,
        motorcycle: 30,
      },
      totalUsage: 378,
      totalRevenue: 17010,
      totalCashRevenue: 6804,
      totalCardRevenue: 10206,
    },
    {
      id: 3,
      name: "Extreme",
      type: "package",
      description: "Complete wash, wax, interior detail",
      pricing: {
        sedan: 80,
        suv: 85,
        "4x4": 120,
        pickup: 100,
        motorcycle: 60,
      },
      totalUsage: 132,
      totalRevenue: 8580,
      totalCashRevenue: 3432,
      totalCardRevenue: 5148,
    },
    {
      id: 4,
      name: "Ceramic Wax",
      type: "addon",
      description: "Premium ceramic wax coating",
      pricing: {
        sedan: 30,
        suv: 35,
        "4x4": 50,
        pickup: 40,
        motorcycle: 25,
      },
      totalUsage: 45,
      totalRevenue: 5400,
      totalCashRevenue: 2160,
      totalCardRevenue: 3240,
    },
    {
      id: 5,
      name: "Paint Polish",
      type: "addon",
      description: "Professional paint polishing",
      pricing: {
        sedan: 20,
        suv: 25,
        "4x4": 40,
        pickup: 30,
        motorcycle: 15,
      },
      totalUsage: 67,
      totalRevenue: 1675,
      totalCashRevenue: 670,
      totalCardRevenue: 1005,
    },
    {
      id: 6,
      name: "Engine Clean",
      type: "addon",
      description: "Deep engine bay cleaning",
      pricing: {
        sedan: 35,
        suv: 40,
        "4x4": 60,
        pickup: 50,
        motorcycle: 25,
      },
      totalUsage: 23,
      totalRevenue: 920,
      totalCashRevenue: 368,
      totalCardRevenue: 552,
    },
  ]);

  const [historyFilter, setHistoryFilter] = useState({
    period: "all",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: "all",
    site: "all",
  });

  // Helper functions
  const generateCredentials = (email: string) => {
    // Generate a stronger password
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";

    let password = "";

    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest with random characters
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return { password, email };
  };

  const handleGenerateCredentials = (
    person: Coordinator | Salesman,
    type: "coordinator" | "salesman"
  ) => {
    const credentials = generateCredentials(person.email);
    setGeneratedCredentials(credentials);

    if (type === "coordinator") {
      setCoordinators((prev) =>
        prev.map((c) =>
          c.id === person.id
            ? {
                ...c,
                password: credentials.password,
              }
            : c
        )
      );
    } else {
      setSalesmen((prev) =>
        prev.map((s) =>
          s.id === person.id
            ? {
                ...s,
                password: credentials.password,
              }
            : s
        )
      );
    }

    setShowCredentialsModal(true);
  };

  const toggleSiteVisibility = (siteId: number) => {
    setSites((prev) =>
      prev.map((site) =>
        site.id === siteId
          ? {
              ...site,
              isActive: !site.isActive,
              status: !site.isActive ? "active" : "inactive",
            }
          : site
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "text-green-700 bg-green-50 border-green-200";
      case "inactive":
      case "waiting":
        return "text-red-700 bg-red-50 border-red-200";
      case "maintenance":
      case "in-progress":
        return "text-orange-700 bg-orange-50 border-orange-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  // Handler functions
  const handleSignOut = () => {
    router.push("/");
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSiteData.name && newSiteData.location) {
      const newSite: Site = {
        id: Math.max(...sites.map((s) => s.id)) + 1,
        name: newSiteData.name,
        location: newSiteData.location,
        coordinator: newSiteData.coordinator || "Unassigned",
        salesmen:
          newSiteData.salesmen.length > 0
            ? newSiteData.salesmen
            : ["Unassigned"],
        totalRevenue: 0,
        totalCashRevenue: 0,
        totalCardRevenue: 0,
        totalCars: 0,
        status: "active",
        isActive: true,
        dailyRevenue: [0, 0, 0, 0, 0, 0, 0],
        monthlyRevenue: [0, 0, 0, 0, 0, 0],
      };

      setSites([...sites, newSite]);

      if (newSiteData.coordinator) {
        setCoordinators((prevCoords) =>
          prevCoords.map((coord) =>
            coord.name === newSiteData.coordinator
              ? { ...coord, sites: [...coord.sites, newSiteData.name] }
              : coord
          )
        );
      }

      if (newSiteData.salesmen.length > 0) {
        setSalesmen((prevSales) =>
          prevSales.map((sales) =>
            newSiteData.salesmen.includes(sales.name)
              ? { ...sales, sites: [...sales.sites, newSiteData.name] }
              : sales
          )
        );
      }

      setNewSiteData({ name: "", location: "", coordinator: "", salesmen: [] });
      setShowAddSiteModal(false);
    }
  };

  const handleAddCoordinator = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCoordinatorData.name && newCoordinatorData.email) {
      const newCoordinator: Coordinator = {
        id: Math.max(...coordinators.map((c) => c.id)) + 1,
        name: newCoordinatorData.name,
        email: newCoordinatorData.email,
        sites: [],
        status: "active",
        lastLogin: "Never",
      };

      setCoordinators([...coordinators, newCoordinator]);
      setNewCoordinatorData({ name: "", email: "" });
      setShowAddCoordinatorModal(false);
    }
  };

  const handleAddSalesman = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSalesmanData.name && newSalesmanData.email) {
      const newSalesman: Salesman = {
        id: Math.max(...salesmen.map((s) => s.id)) + 1,
        name: newSalesmanData.name,
        email: newSalesmanData.email,
        sites: [],
        status: "active",
        lastLogin: "Never",
      };

      setSalesmen([...salesmen, newSalesman]);
      setNewSalesmanData({ name: "", email: "" });
      setShowAddSalesmanModal(false);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newServiceData.name &&
      newServiceData.pricing.sedan &&
      newServiceData.pricing.suv &&
      newServiceData.pricing["4x4"] &&
      newServiceData.pricing.pickup &&
      newServiceData.pricing.motorcycle
    ) {
      const newService: Service = {
        id: Math.max(...services.map((s) => s.id)) + 1,
        name: newServiceData.name,
        type: newServiceData.type,
        description: "",
        pricing: {
          sedan: parseFloat(newServiceData.pricing.sedan),
          suv: parseFloat(newServiceData.pricing.suv),
          "4x4": parseFloat(newServiceData.pricing["4x4"]),
          pickup: parseFloat(newServiceData.pricing.pickup),
          motorcycle: parseFloat(newServiceData.pricing.motorcycle),
        },
        totalUsage: 0,
        totalRevenue: 0,
        totalCashRevenue: 0,
        totalCardRevenue: 0,
      };

      setServices([...services, newService]);
      setNewServiceData({
        name: "",
        type: "package",
        pricing: { sedan: "", suv: "", "4x4": "", pickup: "", motorcycle: "" },
      });
      setShowAddServiceModal(false);
    }
  };

  const deleteSite = (siteId: number) => {
    const siteToDelete = sites.find((site) => site.id === siteId);
    if (!siteToDelete) return;

    setSites((prevSites) => prevSites.filter((site) => site.id !== siteId));

    setCoordinators((prevCoords) =>
      prevCoords.map((coord) => ({
        ...coord,
        sites: coord.sites.filter((site) => site !== siteToDelete.name),
      }))
    );

    setSalesmen((prevSales) =>
      prevSales.map((sales) => ({
        ...sales,
        sites: sales.sites.filter((site) => site !== siteToDelete.name),
      }))
    );

    setCarsStatus((prevCars) =>
      prevCars.filter((car) => car.site !== siteToDelete.name)
    );
  };

  const deleteCoordinator = (coordinatorId: number) => {
    const coordToDelete = coordinators.find(
      (coord) => coord.id === coordinatorId
    );
    if (!coordToDelete) return;

    setCoordinators((prevCoords) =>
      prevCoords.filter((coord) => coord.id !== coordinatorId)
    );

    setSites((prevSites) =>
      prevSites.map((site) =>
        site.coordinator === coordToDelete.name
          ? { ...site, coordinator: "Unassigned" }
          : site
      )
    );
  };

  const deleteSalesman = (salesmanId: number) => {
    const salesToDelete = salesmen.find((sales) => sales.id === salesmanId);
    if (!salesToDelete) return;

    setSalesmen((prevSales) =>
      prevSales.filter((sales) => sales.id !== salesmanId)
    );

    setSites((prevSites) =>
      prevSites.map((site) =>
        site.salesmen.includes(salesToDelete.name)
          ? {
              ...site,
              salesmen: site.salesmen.filter(
                (name) => name !== salesToDelete.name
              ),
            }
          : site
      )
    );
  };

  const deleteService = (serviceId: number) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.id !== serviceId)
    );
  };

  const updateCarStatus = (
    carId: number,
    newStatus: "in-progress" | "completed" | "waiting"
  ) => {
    setCarsStatus((prev) =>
      prev.map((car) =>
        car.id === carId ? { ...car, status: newStatus } : car
      )
    );
  };

  const handleEditCar = (car: CarStatus) => {
    setEditingCar(car);
    setEditCarData({
      service: car.service,
      addons: car.addons,
      status: car.status,
    });
    setShowEditCarModal(true);
  };

  const handleUpdateCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCar && editCarData.service) {
      setCarsStatus((prev) =>
        prev.map((car) =>
          car.id === editingCar.id
            ? {
                ...car,
                service: editCarData.service,
                addons: editCarData.addons,
                status: editCarData.status,
              }
            : car
        )
      );
      setShowEditCarModal(false);
      setEditingCar(null);
      setEditCarData({
        service: "",
        addons: [],
        status: "waiting",
      });
    }
  };

  // Handler functions for editing
  const handleEditSite = (site: Site) => {
    setEditingSite(site);
    setEditSiteData({
      name: site.name,
      location: site.location,
      coordinator: site.coordinator,
      salesmen: site.salesmen,
    });
    setShowEditSiteModal(true);
  };

  const handleEditCoordinator = (coordinator: Coordinator) => {
    setEditingCoordinator(coordinator);
    setEditCoordinatorData({
      name: coordinator.name,
      email: coordinator.email,
    });
    setShowEditCoordinatorModal(true);
  };

  const handleEditSalesman = (salesman: Salesman) => {
    setEditingSalesman(salesman);
    setEditSalesmanData({
      name: salesman.name,
      email: salesman.email,
    });
    setShowEditSalesmanModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setEditServiceData({
      name: service.name,
      type: service.type,
      description: service.description,
      pricing: {
        sedan: service.pricing.sedan.toString(),
        suv: service.pricing.suv.toString(),
        "4x4": service.pricing["4x4"].toString(),
        pickup: service.pricing.pickup.toString(),
        motorcycle: service.pricing.motorcycle.toString(),
      },
    });
    setShowEditServiceModal(true);
  };

  const handleUpdateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSite && editSiteData.name && editSiteData.location) {
      setSites((prev) =>
        prev.map((site) =>
          site.id === editingSite.id
            ? {
                ...site,
                name: editSiteData.name,
                location: editSiteData.location,
                coordinator: editSiteData.coordinator,
                salesmen: editSiteData.salesmen,
              }
            : site
        )
      );
      setShowEditSiteModal(false);
      setEditingSite(null);
      setEditSiteData({
        name: "",
        location: "",
        coordinator: "",
        salesmen: [],
      });
    }
  };

  const handleUpdateCoordinator = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      editingCoordinator &&
      editCoordinatorData.name &&
      editCoordinatorData.email
    ) {
      setCoordinators((prev) =>
        prev.map((coord) =>
          coord.id === editingCoordinator.id
            ? {
                ...coord,
                name: editCoordinatorData.name,
                email: editCoordinatorData.email,
              }
            : coord
        )
      );
      setShowEditCoordinatorModal(false);
      setEditingCoordinator(null);
      setEditCoordinatorData({ name: "", email: "" });
    }
  };

  const handleUpdateSalesman = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSalesman && editSalesmanData.name && editSalesmanData.email) {
      setSalesmen((prev) =>
        prev.map((sales) =>
          sales.id === editingSalesman.id
            ? {
                ...sales,
                name: editSalesmanData.name,
                email: editSalesmanData.email,
              }
            : sales
        )
      );
      setShowEditSalesmanModal(false);
      setEditingSalesman(null);
      setEditSalesmanData({ name: "", email: "" });
    }
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      editingService &&
      editServiceData.name &&
      editServiceData.description &&
      editServiceData.pricing.sedan &&
      editServiceData.pricing.suv &&
      editServiceData.pricing["4x4"] &&
      editServiceData.pricing.pickup &&
      editServiceData.pricing.motorcycle
    ) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                name: editServiceData.name,
                type: editServiceData.type,
                description: editServiceData.description,
                pricing: {
                  sedan: parseFloat(editServiceData.pricing.sedan),
                  suv: parseFloat(editServiceData.pricing.suv),
                  "4x4": parseFloat(editServiceData.pricing["4x4"]),
                  pickup: parseFloat(editServiceData.pricing.pickup),
                  motorcycle: parseFloat(editServiceData.pricing.motorcycle),
                },
              }
            : service
        )
      );
      setShowEditServiceModal(false);
      setEditingService(null);
      setEditServiceData({
        name: "",
        type: "package" as "package" | "addon",
        description: "",
        pricing: {
          sedan: "",
          suv: "",
          "4x4": "",
          pickup: "",
          motorcycle: "",
        },
      });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "sites", label: "Sites", icon: MapPin },
    { id: "coordinators", label: "Coordinators", icon: Users },
    { id: "salesmen", label: "Salesmen", icon: UserCheck },
    { id: "services", label: "Services", icon: Settings },
    { id: "cars", label: "Cars History", icon: Car },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            sites={sites}
            coordinators={coordinators}
            salesmen={salesmen}
            setShowAddSiteModal={setShowAddSiteModal}
            setShowAddCoordinatorModal={setShowAddCoordinatorModal}
            setShowAddSalesmanModal={setShowAddSalesmanModal}
            setActiveTab={setActiveTab}
          />
        );
      case "sites":
        return (
          <SitesManagement
            sites={sites}
            setSites={setSites}
            coordinators={coordinators}
            salesmen={salesmen}
            setShowAddSiteModal={setShowAddSiteModal}
            handleEditSite={handleEditSite}
            deleteSite={deleteSite}
            toggleSiteVisibility={toggleSiteVisibility}
          />
        );
      case "coordinators":
        return (
          <CoordinatorsManagement
            coordinators={coordinators}
            setShowAddCoordinatorModal={setShowAddCoordinatorModal}
            handleEditCoordinator={handleEditCoordinator}
            deleteCoordinator={deleteCoordinator}
            handleGenerateCredentials={handleGenerateCredentials}
          />
        );
      case "salesmen":
        return (
          <SalesmenManagement
            salesmen={salesmen}
            setShowAddSalesmanModal={setShowAddSalesmanModal}
            handleEditSalesman={handleEditSalesman}
            deleteSalesman={deleteSalesman}
            handleGenerateCredentials={handleGenerateCredentials}
          />
        );
      case "services":
        return (
          <ServicesManagement
            services={services}
            setShowAddServiceModal={setShowAddServiceModal}
            handleEditService={handleEditService}
            deleteService={deleteService}
          />
        );
      case "cars":
        return (
          <CarsHistory
            carsStatus={carsStatus}
            services={services}
            historyFilter={historyFilter}
            setHistoryFilter={setHistoryFilter}
            updateCarStatus={updateCarStatus}
            handleEditCar={handleEditCar}
            getStatusColor={getStatusColor}
          />
        );
      default:
        return (
          <Overview
            sites={sites}
            coordinators={coordinators}
            salesmen={salesmen}
            setShowAddSiteModal={setShowAddSiteModal}
            setShowAddCoordinatorModal={setShowAddCoordinatorModal}
            setShowAddSalesmanModal={setShowAddSalesmanModal}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleSignOut={handleSignOut}
        tabs={tabs}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6">
        {renderContent()}
      </div>

      {/* Modals */}
      <AddSiteModal
        showAddSiteModal={showAddSiteModal}
        setShowAddSiteModal={setShowAddSiteModal}
        newSiteData={newSiteData}
        setNewSiteData={setNewSiteData}
        coordinators={coordinators}
        salesmen={salesmen}
        handleAddSite={handleAddSite}
      />
      <CredentialsModal
        showCredentialsModal={showCredentialsModal}
        setShowCredentialsModal={setShowCredentialsModal}
        generatedCredentials={generatedCredentials}
        setGeneratedCredentials={setGeneratedCredentials}
      />
      <AddServiceModal
        showAddServiceModal={showAddServiceModal}
        setShowAddServiceModal={setShowAddServiceModal}
        newServiceData={newServiceData}
        setNewServiceData={setNewServiceData}
        handleAddService={handleAddService}
      />
      <AddCoordinatorModal
        showAddCoordinatorModal={showAddCoordinatorModal}
        setShowAddCoordinatorModal={setShowAddCoordinatorModal}
        newCoordinatorData={newCoordinatorData}
        setNewCoordinatorData={setNewCoordinatorData}
        handleAddCoordinator={handleAddCoordinator}
      />
      <AddSalesmanModal
        showAddSalesmanModal={showAddSalesmanModal}
        setShowAddSalesmanModal={setShowAddSalesmanModal}
        newSalesmanData={newSalesmanData}
        setNewSalesmanData={setNewSalesmanData}
        handleAddSalesman={handleAddSalesman}
      />
      {/* Add other modals here as needed */}
    </div>
  );
};

export default SuperAdminDashboard;
