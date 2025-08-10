export interface CarInQueue {
  id: string;
  plateNumber: string;
  servicePackage: string;
  status: "waiting" | "in-progress" | "completed";
  estimatedTime: number;
  priority: number;
  arrivalTime: string;
  phoneNumber?: string;
  vehicleType?: string;
  specialNotes?: string;
  addOns: string[];
}

export interface AdminInfo {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface AddOnService {
  id: string;
  name: string;
  price: number;
}

export interface RevenueData {
  total: number;
  cash: number;
  card: number;
  yesterday: number;
}

export interface TodayStats {
  servicesCompleted: number;
  averageRating: number;
  totalCustomers: number;
}

export interface EditCarData {
  servicePackage: string;
  addOns: string[];
  status: "in-progress" | "completed" | "waiting";
}

export interface NavigationProps {
  activeTab: "dashboard" | "queue";
  setActiveTab: (tab: "dashboard" | "queue") => void;
  adminInfo: AdminInfo;
  showAccountMenu: boolean;
  setShowAccountMenu: (show: boolean) => void;
}

export interface DashboardProps {
  todayRevenue: RevenueData;
  todayStats: TodayStats;
  queue: CarInQueue[];
  servicePackages: ServicePackage[];
}

export interface QueueManagementProps {
  queue: CarInQueue[];
  setQueue: React.Dispatch<React.SetStateAction<CarInQueue[]>>;
  servicePackages: ServicePackage[];
  addOnServices: AddOnService[];
  queueFilter: "all" | "waiting" | "in-progress" | "completed";
  setQueueFilter: (
    filter: "all" | "waiting" | "in-progress" | "completed"
  ) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  editingQueue: CarInQueue | null;
  setEditingQueue: (car: CarInQueue | null) => void;
  showEditCarModal: boolean;
  setShowEditCarModal: (show: boolean) => void;
  editingCar: CarInQueue | null;
  setEditingCar: (car: CarInQueue | null) => void;
  editCarData: EditCarData;
  setEditCarData: (data: EditCarData) => void;
}

export interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  iconColor?: string;
}

export interface RevenueStatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  totalValue: string;
  cashValue: string;
  cardValue: string;
  subtitle?: string;
  iconColor?: string;
}

export interface SmallStatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  color?: string;
  iconColor?: string;
}
