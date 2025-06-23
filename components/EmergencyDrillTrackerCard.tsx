
import React, { useState, useEffect } from 'react';
import SectionCard from './SectionCard';
import LoadingSpinner from './LoadingSpinner';
import { EmergencyDrill, FormattedEmergencyDrill, DrillPerformanceStatus } from '../types';
import { INITIAL_EMERGENCY_DRILLS } from '../constants';
import { AddIcon, EditIcon, ExportIcon } from './icons'; 
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const getPerformanceStatus = (evacTime: string): DrillPerformanceStatus => {
  if (evacTime === 'N/A' || !evacTime) return 'Good';
  const timeParts = evacTime.match(/(\d+)m\s*(\d+)s/);
  if (timeParts) {
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds <= 240) return 'Excellent'; 
    if (totalSeconds <= 360) return 'Good';      
    if (totalSeconds <= 480) return 'Fair';      
    return 'Poor';
  }
  return 'Fair'; 
};

interface EmergencyDrillTrackerCardProps {
  title: string;
  icon?: React.ReactNode; 
  isZoomed?: boolean;
  onToggleZoom?: (title: string) => void;
}

const EmergencyDrillTrackerCard: React.FC<EmergencyDrillTrackerCardProps> = ({ title, icon, isZoomed, onToggleZoom }) => {
  const [drills, setDrills] = useState<FormattedEmergencyDrill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDrill, setEditingDrill] = useState<EmergencyDrill | null>(null);
  const [formData, setFormData] = useState<Partial<EmergencyDrill>>({});
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  useEffect(() => {
    // console.log('[EmergencyDrillTrackerCard] Initializing drills.'); 
    setLoading(true);
    setTimeout(() => {
      const formattedDrills = INITIAL_EMERGENCY_DRILLS.map(drill => ({
        ...drill,
        performanceStatus: getPerformanceStatus(drill.evacuationTime),
      }));
      setDrills([...formattedDrills]);
      setLoading(false);
      // console.log('[EmergencyDrillTrackerCard] Drills initialized:', [...formattedDrills]); 
    }, 1400);
  }, []);

  const handleOpenModal = (drill: EmergencyDrill | null = null) => {
    setEditingDrill(drill);
    const defaultFormData: Partial<EmergencyDrill> = {
      drillName: '',
      dateConducted: new Date().toISOString().split('T')[0],
      evacuationTime: '0m 0s',
      attendance: '0%',
      performanceNotes: '',
      nextDrillDate: '',
    };
    setFormData(drill ? { ...drill } : defaultFormData );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDrill(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDrill) {
      setDrills(prevDrills => 
        prevDrills.map(d => 
          d.id === editingDrill.id ? { ...d, ...formData, performanceStatus: getPerformanceStatus(formData.evacuationTime || d.evacuationTime) } as FormattedEmergencyDrill : d
        )
      );
    } else {
      const newDrill: FormattedEmergencyDrill = {
        id: crypto.randomUUID(), 
        drillName: formData.drillName || 'New Drill',
        dateConducted: formData.dateConducted || new Date().toISOString().split('T')[0],
        evacuationTime: formData.evacuationTime || 'N/A',
        attendance: formData.attendance || '0%',
        performanceNotes: formData.performanceNotes || '',
        nextDrillDate: formData.nextDrillDate,
        performanceStatus: getPerformanceStatus(formData.evacuationTime || 'N/A'),
      };
      setDrills(prevDrills => [...prevDrills, newDrill]);
    }
    handleCloseModal();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageMargin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const generationTime = new Date().toLocaleString();

    const tableColumn = ["ID", "Drill Name", "Date", "Evac Time", "Attendance", "Performance", "Notes", "Next Drill"];
    const tableRows: (string | undefined)[][] = drills.map(drill => [
        drill.id, drill.drillName, new Date(drill.dateConducted).toLocaleDateString(), drill.evacuationTime,
        drill.attendance, drill.performanceStatus, drill.performanceNotes, drill.nextDrillDate ? new Date(drill.nextDrillDate).toLocaleDateString() : 'N/A'
    ]);

    const autoTableOptions: UserOptions = { 
        head: [tableColumn], 
        body: tableRows, 
        startY: 25, 
        theme: 'grid', 
        headStyles: {fillColor: [6, 182, 212]},
        styles: { font: 'Inter', fontSize: 8, cellPadding: 1.5, overflow: 'linebreak' }, 
        columnStyles: { 
            0: { cellWidth: 'auto' }, 
            1: { cellWidth: 35 }, 
            5: { cellWidth: 20 }, 
            6: { cellWidth: 'auto'}
        },
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
    doc.save("emergency_drill_report.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(drills.map(drill => ({
      ID: drill.id, Drill_Name: drill.drillName, Date_Conducted: new Date(drill.dateConducted).toLocaleDateString(),
      Evacuation_Time: drill.evacuationTime, Attendance: drill.attendance,
      Performance: drill.performanceStatus, Performance_Notes: drill.performanceNotes,
      Next_Drill_Date: drill.nextDrillDate ? new Date(drill.nextDrillDate).toLocaleDateString() : 'N/A'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drills");
    XLSX.writeFile(workbook, "emergency_drill_report.xlsx");
  };

  const getStatusColor = (status: DrillPerformanceStatus): string => {
    switch (status) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-sky-400';
      case 'Fair': return 'text-yellow-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };
  
  const cardHeaderActions = (
    <button
      onClick={() => handleOpenModal()}
      className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-md text-white transition-colors"
      title="Add New Drill"
      aria-label="Add New Drill"
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
        {loading ? <LoadingSpinner /> : drills.length === 0 ? (
          <p className="text-slate-400">No drill data available.</p>
        ) : (
          <ul className="space-y-3">
            {drills.map((drill) => (
              <li key={drill.id} className="p-3 bg-slate-700/50 rounded-md shadow hover:bg-slate-700 transition-colors duration-150">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-slate-200">{drill.drillName}</h3>
                    <div className="flex items-center space-x-1.5">
                        <button onClick={() => handleOpenModal(drill)} className="p-1 text-slate-400 hover:text-sky-400" title="Edit Drill" aria-label={`Edit ${drill.drillName}`}>
                            <EditIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="text-xs text-slate-400 grid grid-cols-2 gap-x-2 gap-y-0.5 mb-1">
                  <p>Date: <span className="text-slate-300">{new Date(drill.dateConducted).toLocaleDateString()}</span></p>
                  <p>Evac Time: <span className="text-slate-300">{drill.evacuationTime}</span></p>
                  <p>Attendance: <span className="text-slate-300">{drill.attendance}</span></p>
                  <p>Performance: <span className={`${getStatusColor(drill.performanceStatus)} font-semibold`}>{drill.performanceStatus}</span></p>
                </div>
                <p className="text-xs text-slate-500 italic mb-1">Notes: {drill.performanceNotes}</p>
                {drill.nextDrillDate && <p className="text-xs text-sky-400">Next Drill: {new Date(drill.nextDrillDate).toLocaleDateString()}</p>}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="drill-modal-title">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg my-8">
            <h3 id="drill-modal-title" className="text-xl font-semibold text-slate-100 mb-4">{editingDrill ? 'Edit' : 'Add'} Drill</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4 md:col-span-2">
                  <label htmlFor="drillName" className="block text-sm font-medium text-slate-300 mb-1">Drill Name</label>
                  <input type="text" name="drillName" id="drillName" value={formData.drillName || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="dateConducted" className="block text-sm font-medium text-slate-300 mb-1">Date Conducted</label>
                  <input type="date" name="dateConducted" id="dateConducted" value={formData.dateConducted || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="evacuationTime" className="block text-sm font-medium text-slate-300 mb-1">Evacuation Time (e.g., 5m 30s)</label>
                  <input type="text" name="evacuationTime" id="evacuationTime" value={formData.evacuationTime || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" placeholder="N/A or Xm Ys"/>
                </div>
                <div className="mb-4">
                  <label htmlFor="attendance" className="block text-sm font-medium text-slate-300 mb-1">Attendance (e.g., 95%)</label>
                  <input type="text" name="attendance" id="attendance" value={formData.attendance || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" />
                </div>
                <div className="mb-4">
                  <label htmlFor="nextDrillDate" className="block text-sm font-medium text-slate-300 mb-1">Next Drill Date (Optional)</label>
                  <input type="date" name="nextDrillDate" id="nextDrillDate" value={formData.nextDrillDate || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" />
                </div>
                <div className="mb-4 md:col-span-2">
                  <label htmlFor="performanceNotes" className="block text-sm font-medium text-slate-300 mb-1">Performance Notes</label>
                  <textarea name="performanceNotes" id="performanceNotes" value={formData.performanceNotes || ''} onChange={handleChange} rows={3} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md resize-none"></textarea>
                </div>
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

export default EmergencyDrillTrackerCard;
