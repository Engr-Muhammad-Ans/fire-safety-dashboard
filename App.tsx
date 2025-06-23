
import React, { useState } from 'react';
import Header from './components/Header';
import DashboardLayout from './components/DashboardLayout';
import RealTimeMonitorCard from './components/RealTimeMonitorCard';
import EmergencyContactsCard from './components/EmergencyContactsCard';
import BasicReportCard from './components/BasicReportCard';
import FireExtinguisherLogCard from './components/FireExtinguisherLogCard';
import EmergencyDrillTrackerCard from './components/EmergencyDrillTrackerCard';
import SafetyKPICard from './components/SafetyKPICard';
import { ExportIcon } from './components/icons'; 
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable'; 
import * as XLSX from 'xlsx';
import { 
  INITIAL_FIRE_ALARMS, 
  INITIAL_FIRE_PUMPS, 
  INITIAL_EMERGENCY_CONTACTS, 
  INITIAL_FIRE_EXTINGUISHERS,
  INITIAL_EMERGENCY_DRILLS,
  INITIAL_SAFETY_KPIS
} from './constants';
import { FireAlarm, FirePump, EmergencyContact, FireExtinguisher, EmergencyDrill, SafetyKPI } from './types';


const App: React.FC = () => {
  const [zoomedCardTitle, setZoomedCardTitle] = useState<string | null>(null);

  const handleToggleZoom = (cardTitle: string) => {
    setZoomedCardTitle(prev => (prev === cardTitle ? null : cardTitle));
  };

  const handleGlobalExportPDF = () => {
    const doc = new jsPDF();
    let yPos = 25; 
    const pageMargin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const generationTime = new Date().toLocaleString();

    const addHeaderOnEveryPage = (options: UserOptions) => {
        options.didDrawPage = (data) => {
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.setFont('helvetica', 'bold');
            doc.text("Sheikhoo Sugar Mills - Fire Safety Report", pageWidth / 2, 10, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text("Global Dashboard Summary", pageMargin, 18);
            doc.text(`Generated on: ${generationTime}`, pageWidth - pageMargin, 18, { align: 'right' });
        };
        if (!options.startY) { 
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.setFont('helvetica', 'bold');
            doc.text("Sheikhoo Sugar Mills - Fire Safety Report", pageWidth / 2, 10, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text("Global Dashboard Summary", pageMargin, 18);
            doc.text(`Generated on: ${generationTime}`, pageWidth - pageMargin, 18, { align: 'right' });
        }
    };


    const addSectionToPdf = (title: string, columns: string[], data: any[], mapFn: (item: any) => (string | number)[]) => {
      if (yPos > doc.internal.pageSize.getHeight() - 40) { 
         doc.addPage();
         yPos = 25; 
      }
      
      doc.setFontSize(16);
      doc.setTextColor(45, 55, 72); 
      doc.text(title, pageMargin, yPos);
      yPos += 7; 
      
      const autoTableOptions: UserOptions = {
        head: [columns],
        body: data.map(mapFn),
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: [45, 55, 72] }, 
        styles: { font: 'Inter', fontSize: 8, cellPadding: 1.5, overflow: 'linebreak' },
        columnStyles: { 
            0: { cellWidth: 'auto' }, // Adjusted for potentially longer UUIDs
        },
        margin: { top: 25, bottom: 15 }, 
      };
      
      addHeaderOnEveryPage(autoTableOptions); 

      autoTable(doc, autoTableOptions);
      
      yPos = (doc as any).lastAutoTable.finalY + 10;
    };

    addSectionToPdf(
      "Fire Alarm Systems",
      ["ID", "Name", "Location", "Status", "Last Checked"],
      INITIAL_FIRE_ALARMS,
      (item: FireAlarm) => [item.id, item.name, item.location, item.status, new Date(item.lastChecked).toLocaleString()]
    );
    addSectionToPdf(
      "Fire Pump Status",
      ["ID", "Name", "Status", "Pressure", "Flow Rate", "Last Checked"],
      INITIAL_FIRE_PUMPS,
      (item: FirePump) => [item.id, item.name, item.status, item.pressure, item.flowRate, new Date(item.lastChecked).toLocaleString()]
    );
    addSectionToPdf(
      "Emergency Contacts",
      ["ID", "Name", "Role", "Phone", "Department"],
      INITIAL_EMERGENCY_CONTACTS,
      (item: EmergencyContact) => [item.id, item.name, item.role, item.phone, item.department]
    );
    addSectionToPdf(
      "Fire Extinguisher Log",
      ["ID", "Location", "Type", "Expiry", "Last Inspection", "Status"],
      INITIAL_FIRE_EXTINGUISHERS,
      (item: FireExtinguisher) => [item.id, item.location, item.type, item.expiryDate, item.lastInspectionDate, item.status.toString()]
    );
    addSectionToPdf(
      "Emergency Drill Tracker",
      ["ID", "Drill Name", "Date", "Evac Time", "Attendance", "Notes", "Next Drill"],
      INITIAL_EMERGENCY_DRILLS,
      (item: EmergencyDrill) => [item.id, item.drillName, item.dateConducted, item.evacuationTime, item.attendance, item.performanceNotes, item.nextDrillDate || 'N/A']
    );
    addSectionToPdf(
      "Overall Fire Safety KPIs",
      ["ID", "Metric", "Value", "Target", "Status", "Trend"],
      INITIAL_SAFETY_KPIS,
      (item: SafetyKPI) => [item.id, item.metricName, String(item.value), String(item.target || 'N/A'), item.status, item.trend || 'N/A']
    );
    
    doc.save('global_fire_safety_dashboard_report.pdf');
  };

  const handleGlobalExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    const addSheetToExcel = (sheetName: string, data: any[], mapFn: (item: any) => object) => {
      const worksheetData = data.map(mapFn);
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0,30));
    };
    
    addSheetToExcel("FireAlarms", INITIAL_FIRE_ALARMS, (item: FireAlarm) => ({ ID: item.id, Name: item.name, Location: item.location, Status: item.status, Last_Checked: new Date(item.lastChecked).toLocaleString() }));
    addSheetToExcel("FirePumps", INITIAL_FIRE_PUMPS, (item: FirePump) => ({ ID: item.id, Name: item.name, Status: item.status, Pressure_PSI: item.pressure, Flow_Rate_GPM: item.flowRate, Last_Checked: new Date(item.lastChecked).toLocaleString() }));
    addSheetToExcel("Contacts", INITIAL_EMERGENCY_CONTACTS, (item: EmergencyContact) => ({ ID: item.id, Name: item.name, Role: item.role, Phone: item.phone, Department: item.department }));
    addSheetToExcel("Extinguishers", INITIAL_FIRE_EXTINGUISHERS, (item: FireExtinguisher) => ({ ID: item.id, Location: item.location, Type: item.type, Expiry_Date: item.expiryDate, Last_Inspection_Date: item.lastInspectionDate, Status: item.status }));
    addSheetToExcel("Drills", INITIAL_EMERGENCY_DRILLS, (item: EmergencyDrill) => ({ ID: item.id, Drill_Name: item.drillName, Date_Conducted: item.dateConducted, Evacuation_Time: item.evacuationTime, Attendance: item.attendance, Performance_Notes: item.performanceNotes, Next_Drill_Date: item.nextDrillDate }));
    addSheetToExcel("KPIs", INITIAL_SAFETY_KPIS, (item: SafetyKPI) => ({ ID: item.id, Metric_Name: item.metricName, Value: item.value, Target: item.target, Status: item.status, Trend: item.trend }));

    XLSX.writeFile(workbook, 'global_fire_safety_dashboard_report.xlsx');
  };

  const dashboardCards = [
    { title: "Fire Alarm Systems", component: RealTimeMonitorCard, props: { isPumpStatus: false } },
    { title: "Fire Pump Status", component: RealTimeMonitorCard, props: { isPumpStatus: true } },
    { title: "Emergency Contacts", component: EmergencyContactsCard },
    { title: "Incident Reporting", component: BasicReportCard },
    { title: "Fire Extinguisher Log", component: FireExtinguisherLogCard },
    { title: "Emergency Drill Tracker", component: EmergencyDrillTrackerCard },
    { title: "Overall Fire Safety KPIs", component: SafetyKPICard },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        {!zoomedCardTitle && (
          <div className="mb-6 flex space-x-3 justify-end">
            <button
              onClick={handleGlobalExportPDF}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-md shadow-md transition-colors flex items-center"
            >
              <ExportIcon className="w-5 h-5 mr-2" />
              Export All to PDF
            </button>
            <button
              onClick={handleGlobalExportExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md shadow-md transition-colors flex items-center"
            >
              <ExportIcon className="w-5 h-5 mr-2" />
              Export All to Excel
            </button>
          </div>
        )}
        <DashboardLayout zoomedCardTitle={zoomedCardTitle}>
          {dashboardCards.map(card => {
            const CardComponent = card.component as React.ElementType; 
            return (
              <CardComponent
                key={card.title}
                title={card.title}
                // icon prop is intentionally not passed to remove title icons
                {...card.props}
                isZoomed={zoomedCardTitle === card.title}
                onToggleZoom={handleToggleZoom}
              />
            );
          })}
        </DashboardLayout>
      </main>
      <footer className="bg-slate-800 text-center p-4 text-xs text-slate-400">
        Developed by Muhammad Ans, Assistant Process Engineer.<br/>
        © 2025 Sheikhoo Sugar Mills. Evaporation & Boiling Safety System. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
