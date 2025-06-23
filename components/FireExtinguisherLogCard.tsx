
import React, { useState, useEffect } from 'react';
import SectionCard from './SectionCard';
import StatusIndicator from './StatusIndicator';
import LoadingSpinner from './LoadingSpinner';
import { FireExtinguisher, SystemStatus } from '../types';
import { INITIAL_FIRE_EXTINGUISHERS } from '../constants';
import { AddIcon, EditIcon, ExportIcon } from './icons'; 
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const EXTINGUISHER_TYPES = ['CO2', 'Dry Powder', 'Water Mist', 'Foam', 'Wet Chemical'];

const determineExtinguisherStatus = (ext: Partial<FireExtinguisher>): SystemStatus => {
  if (!ext.expiryDate || !ext.lastInspectionDate) return SystemStatus.Offline;

  const today = new Date();
  today.setHours(0,0,0,0);
  const expiryDate = new Date(ext.expiryDate);
  const inspectionDueDate = new Date(ext.lastInspectionDate);
  inspectionDueDate.setFullYear(inspectionDueDate.getFullYear() + 1); 

  if (expiryDate < today) {
    return SystemStatus.Expired;
  }
  if (inspectionDueDate < today) {
    return SystemStatus.Due;
  }
  return SystemStatus.Operational;
};

interface FireExtinguisherLogCardProps {
  title: string;
  icon?: React.ReactNode; 
  isZoomed?: boolean;
  onToggleZoom?: (title: string) => void;
}

const FireExtinguisherLogCard: React.FC<FireExtinguisherLogCardProps> = ({ title, icon, isZoomed, onToggleZoom }) => {
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExtinguisher, setEditingExtinguisher] = useState<FireExtinguisher | null>(null);
  const [formData, setFormData] = useState<Partial<FireExtinguisher>>({});
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  useEffect(() => {
    // console.log('[FireExtinguisherLogCard] Initializing extinguishers.'); 
    setLoading(true);
    setTimeout(() => {
      const processedExtinguishers = INITIAL_FIRE_EXTINGUISHERS.map(ext => ({
        ...ext,
        status: determineExtinguisherStatus(ext),
      }));
      setExtinguishers([...processedExtinguishers]);
      setLoading(false);
      // console.log('[FireExtinguisherLogCard] Extinguishers initialized:', [...processedExtinguishers]); 
    }, 1300);
  }, []);

  const handleOpenModal = (ext: FireExtinguisher | null = null) => {
    setEditingExtinguisher(ext);
    const initialFormData: Partial<FireExtinguisher> = ext 
      ? { ...ext } 
      : { 
          type: EXTINGUISHER_TYPES[0], 
          expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0], 
          lastInspectionDate: new Date().toISOString().split('T')[0] 
        };
    initialFormData.status = determineExtinguisherStatus(initialFormData);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExtinguisher(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedFormData = { ...prev, [name]: value };
      if (name === 'expiryDate' || name === 'lastInspectionDate') {
        updatedFormData.status = determineExtinguisherStatus(updatedFormData);
      }
      return updatedFormData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentFormData = { ...formData };
    currentFormData.status = determineExtinguisherStatus(currentFormData);

    if (editingExtinguisher) {
      setExtinguishers(prevExts => 
        prevExts.map(ext => 
          ext.id === editingExtinguisher.id ? { ...ext, ...currentFormData } as FireExtinguisher : ext
        )
      );
    } else {
      const newExtinguisher: FireExtinguisher = {
        id: crypto.randomUUID(), 
        location: currentFormData.location || 'N/A',
        type: currentFormData.type || EXTINGUISHER_TYPES[0],
        expiryDate: currentFormData.expiryDate || new Date().toISOString().split('T')[0],
        lastInspectionDate: currentFormData.lastInspectionDate || new Date().toISOString().split('T')[0],
        status: currentFormData.status || SystemStatus.Operational,
      };
      setExtinguishers(prevExts => [...prevExts, newExtinguisher]);
    }
    handleCloseModal();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageMargin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const generationTime = new Date().toLocaleString();

    const tableColumn = ["ID", "Location", "Type", "Expiry Date", "Last Inspection", "Status"];
    const tableRows: string[][] = extinguishers.map(ext => 
        [ext.id, ext.location, ext.type, ext.expiryDate, ext.lastInspectionDate, ext.status.toString()]
    );

    const autoTableOptions: UserOptions = { 
        head: [tableColumn], 
        body: tableRows, 
        startY: 25, 
        theme: 'grid', 
        headStyles: {fillColor: [249, 115, 22]},
        styles: { font: 'Inter', fontSize: 9, cellPadding: 1.5, overflow: 'linebreak' }, 
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
    doc.save("fire_extinguisher_log_report.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(extinguishers.map(ext => ({
        ID: ext.id, Location: ext.location, Type: ext.type, 
        Expiry_Date: ext.expiryDate, Last_Inspection_Date: ext.lastInspectionDate, Status: ext.status
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Extinguishers");
    XLSX.writeFile(workbook, "fire_extinguisher_log_report.xlsx");
  };

  const cardHeaderActions = (
    <button
      onClick={() => handleOpenModal()}
      className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-md text-white transition-colors"
      title="Add New Extinguisher"
      aria-label="Add New Extinguisher"
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
      <SectionCard title={title} icon={icon} isZoomed={isZoomed} onToggleZoom={onToggleZoom}>
        <LoadingSpinner />
      </SectionCard>
    );
  }

  return (
    <>
      <SectionCard title={title} icon={icon} headerActions={cardHeaderActions} exportActions={cardExportActions} isZoomed={isZoomed} onToggleZoom={onToggleZoom}>
        {loading ? <LoadingSpinner /> : extinguishers.length === 0 ? (
          <p className="text-slate-400">No extinguisher data available.</p>
        ) : (
          <ul className="space-y-3">
            {extinguishers.map((ext) => (
              <li key={ext.id} className="p-3 bg-slate-700/50 rounded-md shadow hover:bg-slate-700 transition-colors duration-150">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="font-medium text-slate-200">{ext.location} ({ext.type})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                     <StatusIndicator status={ext.status} />
                     <button onClick={() => handleOpenModal(ext)} className="p-1 text-slate-400 hover:text-sky-400" title="Edit Extinguisher" aria-label={`Edit ${ext.location}`}>
                       <EditIcon className="w-4 h-4" />
                     </button>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-0.5">
                  <p>Expiry: <span className={determineExtinguisherStatus(ext) === SystemStatus.Expired ? 'text-red-400 font-semibold' : 'text-slate-300'}>{new Date(ext.expiryDate).toLocaleDateString()}</span></p>
                  <p>Last Inspected: <span className="text-slate-300">{new Date(ext.lastInspectionDate).toLocaleDateString()}</span></p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="extinguisher-modal-title">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 id="extinguisher-modal-title" className="text-xl font-semibold text-slate-100 mb-4">{editingExtinguisher ? 'Edit' : 'Add'} Extinguisher</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                <input type="text" name="location" id="location" value={formData.location || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" required />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                <select name="type" id="type" value={formData.type || EXTINGUISHER_TYPES[0]} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md">
                  {EXTINGUISHER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-300 mb-1">Expiry Date</label>
                <input type="date" name="expiryDate" id="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" required />
              </div>
              <div className="mb-4">
                <label htmlFor="lastInspectionDate" className="block text-sm font-medium text-slate-300 mb-1">Last Inspection Date</label>
                <input type="date" name="lastInspectionDate" id="lastInspectionDate" value={formData.lastInspectionDate || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" required />
              </div>
               <div className="mb-4">
                 <label className="block text-sm font-medium text-slate-300 mb-1">Calculated Status</label>
                 <StatusIndicator status={formData.status || SystemStatus.Operational} />
               </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FireExtinguisherLogCard;
