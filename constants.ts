
import { FireAlarm, FirePump, EmergencyContact, SystemStatus, FireExtinguisher, EmergencyDrill, SafetyKPI, KpiStatus } from './types';

export const INITIAL_FIRE_ALARMS: FireAlarm[] = [
  { id: 'FA001', name: 'Zone A Detector', location: 'Evaporator Deck 1', status: SystemStatus.Operational, lastChecked: '2024-07-20 10:00' },
  { id: 'FA002', name: 'Zone B Heat Sensor', location: 'Heating Bay 3', status: SystemStatus.Operational, lastChecked: '2024-07-20 10:05' },
  { id: 'FA003', name: 'Main Control Room Panel', location: 'Control Hub', status: SystemStatus.Warning, lastChecked: '2024-07-19 15:30' },
  { id: 'FA004', name: 'Bagasse Storage Sensor', location: 'Storage Area 1', status: SystemStatus.Operational, lastChecked: '2024-07-20 09:00' },
  { id: 'FA005', name: 'Boiler Section Smoke Detector', location: 'Boiler House Sector 2', status: SystemStatus.Offline, lastChecked: '2024-07-18 11:00' },
];

export const INITIAL_FIRE_PUMPS: FirePump[] = [
  { id: 'FP001', name: 'Main Diesel Pump', status: SystemStatus.Operational, pressure: 120, flowRate: 1500, lastChecked: '2024-07-20 08:00' },
  { id: 'FP002', name: 'Electric Jockey Pump', status: SystemStatus.Operational, pressure: 125, flowRate: 50, lastChecked: '2024-07-20 08:05' },
  { id: 'FP003', name: 'Backup Pump West', status: SystemStatus.Maintenance, pressure: 0, flowRate: 0, lastChecked: '2024-07-15 14:00' },
];

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'EC001', name: 'Muhammad Ans', role: 'Section Head (Evaporation)', phone: '0300-1234567', department: 'Process Engineering' },
  { id: 'EC002', name: 'Safety Officer On-Duty', role: 'Fire Safety Lead', phone: '0321-9876543', department: 'Safety Department' },
  { id: 'EC003', name: 'Plant Manager', role: 'Overall Incharge', phone: '0333-1122334', department: 'Management' },
  { id: 'EC004', name: 'Control Room Operator', role: 'Emergency Coordinator', phone: 'Ext: 100', department: 'Operations' },
  { id: 'EC005', name: 'Local Fire Brigade', role: 'External Support', phone: '1122', department: 'Emergency Services' },
];

export const INITIAL_FIRE_EXTINGUISHERS: FireExtinguisher[] = [
  { id: 'FE001', location: 'Evaporator Deck 1, Column A', type: 'CO2', expiryDate: '2025-12-31', lastInspectionDate: '2024-06-15', status: SystemStatus.Operational },
  { id: 'FE002', location: 'Heating Bay 3, Near Panel', type: 'Dry Powder', expiryDate: '2024-08-30', lastInspectionDate: '2024-02-20', status: SystemStatus.Due },
  { id: 'FE003', location: 'Control Hub Entrance', type: 'Water Mist', expiryDate: '2026-05-10', lastInspectionDate: '2024-05-05', status: SystemStatus.Operational },
  { id: 'FE004', location: 'Bagasse Storage Area, Gate 1', type: 'Foam', expiryDate: '2023-11-01', lastInspectionDate: '2023-09-01', status: SystemStatus.Expired },
  { id: 'FE005', location: 'Boiler House, Level 2', type: 'Dry Powder', expiryDate: '2025-02-28', lastInspectionDate: '2024-07-01', status: SystemStatus.Operational },
];

export const INITIAL_EMERGENCY_DRILLS: EmergencyDrill[] = [
  { id: 'ED001', drillName: 'Q2 Evacuation Drill - Zone A', dateConducted: '2024-06-25', evacuationTime: '4m 15s', attendance: '92%', performanceNotes: 'Good response, some confusion at muster point C.', nextDrillDate: '2024-09-25' },
  { id: 'ED002', drillName: 'Q1 Full Plant Shutdown Simulation', dateConducted: '2024-03-10', evacuationTime: '6m 05s', attendance: '88%', performanceNotes: 'Communication delay identified with west wing.', nextDrillDate: '2024-08-10 (Rescheduled)' },
  { id: 'ED003', drillName: 'Fire Extinguisher Use Drill - Heating Bay', dateConducted: '2024-07-15', evacuationTime: 'N/A', attendance: '100% (Targeted Group)', performanceNotes: 'Most staff proficient, refresher needed for new types.', nextDrillDate: '2025-01-15' },
];

export const INITIAL_SAFETY_KPIS: SafetyKPI[] = [
  { id: 'KPI001', metricName: 'Training Compliance', value: 95, status: KpiStatus.Good, target: '90%', trend: 'stable' },
  { id: 'KPI002', metricName: 'Overdue Inspections (Extinguishers)', value: 2, status: KpiStatus.Fair, target: '0', trend: 'down' }, // Was Warning
  { id: 'KPI003', metricName: 'Equipment Issues (Pumps)', value: 1, status: KpiStatus.Fair, target: '0', trend: 'stable' }, // Was NeedsAttention
  { id: 'KPI004', metricName: 'Reported Hazards (Unresolved)', value: 3, status: KpiStatus.Poor, target: '<5', trend: 'up' }, // Was Warning, now Poor
];


export const STATUS_COLORS: Record<SystemStatus | KpiStatus, string> = {
  [SystemStatus.Operational]: 'bg-green-600 border-green-500 text-green-100',
  [SystemStatus.Alarm]: 'bg-red-600 border-red-500 text-red-100 animate-pulse',
  [SystemStatus.Warning]: 'bg-yellow-500 border-yellow-400 text-yellow-900',
  [SystemStatus.Offline]: 'bg-slate-600 border-slate-500 text-slate-100',
  [SystemStatus.Maintenance]: 'bg-sky-600 border-sky-500 text-sky-100',
  // [SystemStatus.Good]: 'bg-green-600 border-green-500 text-green-100', // Removed: Key 'Good' is defined by KpiStatus.Good below
  [SystemStatus.NeedsAttention]: 'bg-amber-500 border-amber-400 text-amber-900', 
  [SystemStatus.Expired]: 'bg-red-700 border-red-600 text-red-100',
  [SystemStatus.Due]: 'bg-sky-500 border-sky-400 text-sky-100',
  // KPI Specific Statuses
  [KpiStatus.Good]: 'bg-green-600 border-green-500 text-green-100',
  [KpiStatus.Fair]: 'bg-yellow-500 border-yellow-400 text-yellow-900',
  [KpiStatus.Poor]: 'bg-red-600 border-red-500 text-red-100',
};

export const STATUS_TEXT_COLORS: Record<SystemStatus | KpiStatus, string> = {
  [SystemStatus.Operational]: 'text-green-400',
  [SystemStatus.Alarm]: 'text-red-400 font-bold animate-pulse',
  [SystemStatus.Warning]: 'text-yellow-400',
  [SystemStatus.Offline]: 'text-slate-400',
  [SystemStatus.Maintenance]: 'text-sky-400',
  // [SystemStatus.Good]: 'text-green-300', // Removed: Key 'Good' is defined by KpiStatus.Good below
  [SystemStatus.NeedsAttention]: 'text-amber-400',
  [SystemStatus.Expired]: 'text-red-300 font-semibold',
  [SystemStatus.Due]: 'text-sky-300',
  // KPI Specific Statuses
  [KpiStatus.Good]: 'text-green-400',
  [KpiStatus.Fair]: 'text-yellow-400',
  [KpiStatus.Poor]: 'text-red-400 font-semibold',
};
