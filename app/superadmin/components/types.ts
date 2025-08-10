// Define types for better type safety
export interface Site {
  id: number;
  name: string;
  location: string;
  coordinator: string;
  salesmen: string[];
  totalRevenue: number;
  totalCashRevenue: number;
  totalCardRevenue: number;
  totalCars: number;
  status: "active" | "inactive" | "maintenance";
  isActive: boolean;
  dailyRevenue: number[];
  monthlyRevenue: number[];
}

export interface Coordinator {
  id: number;
  name: string;
  email: string;
  sites: string[];
  status: "active" | "inactive";
  lastLogin: string;
  loginId?: string;
  password?: string;
}

export interface Salesman {
  id: number;
  name: string;
  email: string;
  sites: string[];
  status: "active" | "inactive";
  lastLogin: string;
  loginId?: string;
  password?: string;
}

export interface CarStatus {
  id: number;
  site: string;
  carNumber: string;
  service: string;
  status: "in-progress" | "completed" | "waiting";
  amountPaid: number;
  servicePrice: number;
  addons: string[];
  timestamp: string;
  date: string;
  month: string;
  year: string;
  paymentMethod: "cash" | "card";
}

export interface Service {
  id: number;
  name: string;
  type: "package" | "addon";
  pricing: {
    sedan: number;
    suv: number;
    "4x4": number;
    pickup: number;
    motorcycle: number;
  };
  description: string;
  totalUsage: number;
  totalRevenue: number;
  totalCashRevenue: number;
  totalCardRevenue: number;
}

// Component interfaces for props
export interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}

export interface RevenueStatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  totalValue: string;
  cashValue: string;
  cardValue: string;
  subtitle?: string;
}

export interface SmallStatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  color?: string;
}

export interface TabButtonProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: (id: string) => void;
}
