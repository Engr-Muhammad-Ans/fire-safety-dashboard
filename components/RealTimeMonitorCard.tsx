
import React, { useState, useEffect } from 'react';
import SectionCard from './SectionCard';
import StatusIndicator from './StatusIndicator';
import LoadingSpinner from './LoadingSpinner';
import { MonitoredItem, SystemStatus, FireAlarm, FirePump } from '../types';
import { INITIAL_FIRE_ALARMS, INITIAL_FIRE_PUMPS } from '../constants';
import { AddIcon, EditIcon, ExportIcon } from './icons'; 
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface RealTimeMonitorCardProps {
  title: string;
  icon?: React.ReactNode; 
  isPumpStatus?: boolean;
  isZoomed?: boolean;
  onToggleZoom?: (title: string) => void;
}

type EditableItem = FireAlarm | FirePump;

const ALLOWED_SYSTEM_STATUSES_FOR_FORM: SystemStatus[] = [
  SystemStatus.Operational,
  SystemStatus.Alarm,
  SystemStatus.Warning,
  SystemStatus.Offline,
  SystemStatus.Maintenance,
];

const RealTimeMonitorCard: React.FC<RealTimeMonitorCardProps> = ({ title, icon, isPumpStatus = false, isZoomed, onToggleZoom }) => {
  const [items, setItems] = useState<EditableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [formData, setFormData] = useState<Partial<EditableItem>>({});
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const initialData = isPumpStatus ? INITIAL_FIRE_PUMPS : INITIAL_FIRE_ALARMS;

  useEffect(() => {
    // console.log(`[${title}] Initializing items. isPumpStatus: ${isPumpStatus}`);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setItems([...initialData]); 
      setLoading(false);
      // console.log(`[${title}] Items initialized:`, [...initialData]);
    }, 1000);
  }, [isPumpStatus, title, initialData]); 

  const handleOpenModal = (item: EditableItem | null = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : { status: SystemStatus.Operational, lastChecked: new Date().toISOString().slice(0,16) });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'pressure' || name === 'flowRate' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(prevItems => prevItems.map(item => item.id === editingItem.id ? { ...item, ...formData } as EditableItem : item));
    } else {
      const newItemId = crypto.randomUUID(); 
      const name = formData.name || (isPumpStatus ? 'New Pump' : 'New Alarm');
      const status = formData.status || SystemStatus.Operational;
      const lastChecked = (formData.lastChecked?.slice(0,16) || new Date().toISOString().slice(0, 16));

      let newItem: EditableItem;
      if (isPumpStatus) {
        newItem = {
          id: newItemId,
          name: name,
          status: status,
          lastChecked: lastChecked,
          pressure: (formData as Partial<FirePump>).pressure ?? 0,
          flowRate: (formData as Partial<FirePump>).flowRate ?? 0,
        } as FirePump;
      } else {
        newItem = {
          id: newItemId,
          name: name,
          status: status,
          lastChecked: lastChecked,
          location: (formData as Partial<FireAlarm>).location || 'N/A',
        } as FireAlarm;
      }
      setItems(prevItems => [...prevItems, newItem]);
    }
    handleCloseModal();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageMargin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const generationTime = new Date().toLocaleString();
    
    const tableColumn = isPumpStatus
      ? ["ID", "Name", "Status", "Pressure (PSI)", "Flow Rate (GPM)", "Last Checked"]
      : ["ID", "Name", "Location", "Status", "Last Checked"];
    const tableRows: (string | number)[][] = [];

    items.forEach(item => {
      const rowData = isPumpStatus
        ? [item.id, item.name, item.status, (item as FirePump).pressure, (item as FirePump).flowRate, new Date(item.lastChecked).toLocaleString()]
        : [item.id, item.name, (item as FireAlarm).location, item.status, new Date(item.lastChecked).toLocaleString()];
      tableRows.push(rowData);
    });

    const autoTableOptions: UserOptions = {
        head: [tableColumn],
        body: tableRows,
        startY: 25, 
        theme: 'grid',
        headStyles: { fillColor: isPumpStatus ? [14, 165, 233] : [220, 38, 38] }, 
        styles: { font: 'Inter', fontSize: 10, cellPadding: 1.5, overflow: 'linebreak' },
        columnStyles: { 0: { cellWidth: 'auto' } }, 
        margin: { top: 25, bottom: 15 },
        didDrawPage: (data) => {
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.setFont('helvetica', 'bold');
            doc.text("Sheikhoo Sugar Mills - Fire Safety Report", pageWidth / 2, 10, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(title, pageMargin, 18);
            doc.text(`Generated on: ${generationTime}`, pageWidth - pageMargin, 18, { align: 'right' });
        }
    };
    
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text("Sheikhoo Sugar Mills - Fire Safety Report", pageWidth / 2, 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(title, pageMargin, 18);
    doc.text(`Generated on: ${generationTime}`, pageWidth - pageMargin, 18, { align: 'right' });

    autoTable(doc, autoTableOptions);
    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
  };

  const handleExportExcel = () => {
    const worksheetData = items.map(item => {
      if (isPumpStatus) {
        const pump = item as FirePump;
        return {
          ID: pump.id, Name: pump.name, Status: pump.status,
          Pressure_PSI: pump.pressure, Flow_Rate_GPM: pump.flowRate,
          Last_Checked: new Date(pump.lastChecked).toLocaleString()
        };
      } else {
        const alarm = item as FireAlarm;
        return {
          ID: alarm.id, Name: alarm.name, Location: alarm.location,
          Status: alarm.status, Last_Checked: new Date(alarm.lastChecked).toLocaleString()
        };
      }
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title.substring(0,30));
    XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_').toLowerCase()}_report.xlsx`);
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
          <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
          <select name="status" id="status" value={formData.status || SystemStatus.Operational} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500">
            {ALLOWED_SYSTEM_STATUSES_FOR_FORM.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="lastChecked" className="block text-sm font-medium text-slate-300 mb-1">Last Checked</label>
          <input type="datetime-local" name="lastChecked" id="lastChecked" value={formData.lastChecked ? formData.lastChecked.slice(0,16) : new Date().toISOString().slice(0,16)} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" />
        </div>
      </>
    );

    if (isPumpStatus) {
      const pumpData = formData as Partial<FirePump>;
      return (
        <>
          {commonFields}
          <div className="mb-4">
            <label htmlFor="pressure" className="block text-sm font-medium text-slate-300 mb-1">Pressure (PSI)</label>
            <input type="number" name="pressure" id="pressure" value={pumpData.pressure ?? ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="flowRate" className="block text-sm font-medium text-slate-300 mb-1">Flow Rate (GPM)</label>
            <input type="number" name="flowRate" id="flowRate" value={pumpData.flowRate ?? ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" />
          </div>
        </>
      );
    } else {
      const alarmData = formData as Partial<FireAlarm>;
      return (
        <>
          {commonFields}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1">Location</label>
            <input type="text" name="location" id="location" value={alarmData.location || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" />
          </div>
        </>
      );
    }
  };

  const cardHeaderActions = (
    <button
      onClick={() => handleOpenModal()}
      className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-md text-white transition-colors"
      title={isPumpStatus ? "Add New Pump" : "Add New Alarm"}
      aria-label={isPumpStatus ? "Add New Pump" : "Add New Alarm"}
    >
      <AddIcon className="w-5 h-5" />
    </button>
  );

  const cardExportActions = (
    <div className="relative">
      <button
        onClick={() => setExportMenuOpen(prev => !prev)}
        className="p-1.5 text-slate-400 hover:text-teal-400 transition-colors rounded-md"
        title="Export Options"
        aria-haspopup="true"
        aria-expanded={exportMenuOpen}
      >
        <ExportIcon className="w-5 h-5" />
      </button>
      {exportMenuOpen && (
        <div 
          className="absolute right-0 mt-2 w-auto min-w-[120px] bg-slate-700 rounded-md shadow-lg z-20 p-1 flex flex-col space-y-1"
          role="menu"
        >
          <button
            onClick={() => { handleExportPDF(); setExportMenuOpen(false); }}
            className="w-full flex items-center justify-center px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 rounded-md transition-colors"
            role="menuitem"
          >
            PDF
          </button>
          <button
            onClick={() => { handleExportExcel(); setExportMenuOpen(false); }}
            className="w-full flex items-center justify-center px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 rounded-md transition-colors"
            role="menuitem"
          >
            Excel
          </button>
        </div>
      )}
    </div>
  );


  if (loading && !isZoomed) { 
    return (
      <SectionCard title={title} icon={icon} gridSpan={isPumpStatus ? 'md:col-span-1' : 'md:col-span-2'} isZoomed={isZoomed} onToggleZoom={onToggleZoom}>
        <LoadingSpinner />
      </SectionCard>
    );
  }

  return (
    <>
      <SectionCard 
        title={title} 
        icon={icon} 
        gridSpan={isPumpStatus ? 'md:col-span-1' : 'md:col-span-2'} 
        headerActions={cardHeaderActions} 
        exportActions={cardExportActions}
        isZoomed={isZoomed}
        onToggleZoom={onToggleZoom}
      >
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <p className="text-slate-400">No data available.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
               const displayItem: MonitoredItem = {
                id: item.id,
                name: item.name,
                status: item.status,
                lastChecked: item.lastChecked,
                details: isPumpStatus
                  ? (<>
                      <span className="text-xs text-slate-400">Pressure: </span>{(item as FirePump).pressure} PSI,
                      <span className="text-xs text-slate-400"> Flow: </span>{(item as FirePump).flowRate} GPM
                    </>)
                  : <span className="text-xs text-slate-400">Location: {(item as FireAlarm).location}</span>
              };
              return (
              <li key={item.id} className="p-3 bg-slate-700/50 rounded-md shadow hover:bg-slate-700 transition-colors duration-150">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="font-medium text-slate-200">{displayItem.name}</span>
                    {displayItem.details && <div className="text-sm text-slate-300 mb-1">{displayItem.details}</div>}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <StatusIndicator status={displayItem.status} />
                    <button onClick={() => handleOpenModal(item)} className="p-1 text-slate-400 hover:text-sky-400" title="Edit" aria-label={`Edit ${displayItem.name}`}>
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {displayItem.lastChecked && <p className="text-xs text-slate-500">Last Checked: {new Date(displayItem.lastChecked).toLocaleString()}</p>}
              </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 id="modal-title" className="text-xl font-semibold text-slate-100 mb-4">{editingItem ? 'Edit' : 'Add'} {isPumpStatus ? 'Pump' : 'Alarm'}</h3>
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RealTimeMonitorCard;
