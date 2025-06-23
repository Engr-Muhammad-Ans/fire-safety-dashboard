export enum SystemStatus {
  Operational = 'Operational',
  Alarm = 'Alarm',
  Warning = 'Warning',
  Offline = 'Offline',
  Maintenance = 'Maintenance',
  // General statuses below, some might be shared or overridden by more specific enums
  Good = 'Good', 
  NeedsAttention = 'Needs Attention', 
  Expired = 'Expired', 
  Due = 'Due', 
}

export enum KpiStatus {
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
}

export interface FireAlarm {
  id: string;
  name: string;
  location: string;
  status: SystemStatus;
  lastChecked: string;
}

export interface FirePump {
  id: string;
  name: string;
  status: SystemStatus;
  pressure: number; // in PSI or Bar
  flowRate: number; // in GPM or L/min
  lastChecked: string;
}

export interface MonitoredItem {
  id: string;
  name: string;
  status: SystemStatus;
  details?: string | React.ReactNode; 
  lastChecked?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  department: string;
}

export interface FireExtinguisher {
  id: string;
  location: string;
  type: string;
  expiryDate: string;
  lastInspectionDate: string;
  status: SystemStatus; // Operational, Expired, Due for Inspection
}

export interface EmergencyDrill {
  id: string;
  drillName: string;
  dateConducted: string;
  evacuationTime: string; // e.g., "5m 30s"
  attendance: string; // e.g., "95%"
  performanceNotes: string;
  nextDrillDate?: string;
}

export interface SafetyKPI {
  id: string;
  metricName: string;
  value: string | number;
  status: KpiStatus; // Using specific KpiStatus
  target?: string | number;
  trend?: 'up' | 'down' | 'stable';
}

export type DrillPerformanceStatus = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface FormattedEmergencyDrill extends EmergencyDrill {
  performanceStatus: DrillPerformanceStatus;
}