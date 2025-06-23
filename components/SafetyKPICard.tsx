
import React, { useState, useEffect } from 'react';
import SectionCard from './SectionCard';
import LoadingSpinner from './LoadingSpinner';
import { SafetyKPI, KpiStatus } from '../types'; 
import { INITIAL_SAFETY_KPIS, STATUS_TEXT_COLORS, STATUS_COLORS } from '../constants';
import { EditIcon, ExportIcon } from './icons'; 
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface SafetyKPICardProps {
  title: string;
  icon?: React.ReactNode; 
  isZoomed?: boolean;
  onToggleZoom?: (title: string) => void;
}

const TrendArrow: React.FC<{ trend?: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  if (trend === 'up') return <span className="text-green-400">↑</span>;
  if (trend === 'down') return <span className="text-red-400">↓</span>;
  return <span className="text-slate-400">→</span>;
};

const SafetyKPICard: React.FC<SafetyKPICardProps> = ({ title, icon, isZoomed, onToggleZoom }) => {
  const [kpis, setKpis] = useState<SafetyKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingKPI, setEditingKPI] = useState<SafetyKPI | null>(null);
  const [formData, setFormData] = useState<Partial<SafetyKPI>>({});
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setKpis([...INITIAL_SAFETY_KPIS]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleOpenModal = (kpi: SafetyKPI) => {
    setEditingKPI(kpi);
    setFormData({ ...kpi });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingKPI(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | KpiStatus = value;
    if (name === 'value' || name === 'target') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && value.trim() !== '') {
            processedValue = numValue;
        }
    } else if (name === 'status') {
        processedValue = value as KpiStatus;
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKPI) {
      setKpis(prevKpis => 
        prevKpis.map(k => 
          k.id === editingKPI.id ? { ...k, ...formData } as SafetyKPI : k
        )
      );
    }
    handleCloseModal();
  };

  const getProgressBarColor = (status: KpiStatus): string => {
    const colorClass = STATUS_COLORS[status]?.split(' ')[0]; 
    return colorClass || 'bg-sky-500'; 
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageMargin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const generationTime = new Date().toLocaleString();

    const tableColumn = ["ID", "Metric Name", "Value", "Target", "Status", "Trend"];
    const tableRows: (string | number | undefined)[][] = kpis.map(kpi => [
        kpi.id, kpi.metricName, kpi.value, kpi.target, kpi.status, kpi.trend
    ]);

    const autoTableOptions: UserOptions = { 
        head: [tableColumn], 
        body: tableRows, 
        startY: 25, 
        theme: 'grid', 
        headStyles: {fillColor: [136, 78, 160]},
        styles: { font: 'Inter', fontSize: 10, cellPadding: 1.5, overflow: 'linebreak' },
        columnStyles: { 0: { cellWidth: 'auto' } }, // Adjusted for UUID
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
    doc.save("safety_kpis_report.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(kpis.map(kpi => ({
      ID: kpi.id, Metric_Name: kpi.metricName, Value: kpi.value,
      Target: kpi.target, Status: kpi.status, Trend: kpi.trend
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "KPIs");
    XLSX.writeFile(workbook, "safety_kpis_report.xlsx");
  };

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
      <SectionCard title={title} icon={icon} exportActions={cardExportActions} isZoomed={isZoomed} onToggleZoom={onToggleZoom}>
        {loading ? <LoadingSpinner/> : kpis.length === 0 ? (
          <p className="text-slate-400">No KPI data available.</p>
        ) : (
          <div className="space-y-4">
            {kpis.map((kpi) => (
              <div key={kpi.id} className="p-3 bg-slate-700/50 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-200">{kpi.metricName}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${STATUS_TEXT_COLORS[kpi.status] || 'text-slate-100'}`}>
                      {kpi.value}{typeof kpi.value === 'number' && kpi.metricName.toLowerCase().includes('compliance') ? '%' : ''}
                    </span>
                    <button onClick={() => handleOpenModal(kpi)} className="p-1 text-slate-400 hover:text-sky-400" title="Edit KPI">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {kpi.metricName.toLowerCase().includes('compliance') && typeof kpi.value === 'number' ? (
                  <div className="w-full bg-slate-600 rounded-full h-2.5 dark:bg-slate-700">
                    <div 
                      className={`h-2.5 rounded-full ${getProgressBarColor(kpi.status)}`}
                      style={{ width: `${Math.min(100, Math.max(0,kpi.value))}%` }}
                    ></div>
                  </div>
                ) : (
                   <div className="h-2.5"></div> 
                )}
                <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                  <span>Target: {kpi.target}{typeof kpi.target === 'number' && kpi.metricName.toLowerCase().includes('compliance') ? '%' : ''}</span>
                  <TrendArrow trend={kpi.trend} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {showModal && editingKPI && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Edit KPI: {editingKPI.metricName}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="metricName" className="block text-sm font-medium text-slate-300 mb-1">Metric Name</label>
                <input type="text" name="metricName" id="metricName" value={formData.metricName || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" required />
              </div>
              <div className="mb-4">
                <label htmlFor="value" className="block text-sm font-medium text-slate-300 mb-1">Value</label>
                <input type="text" name="value" id="value" value={formData.value === undefined ? '' : formData.value} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" required />
              </div>
              <div className="mb-4">
                <label htmlFor="target" className="block text-sm font-medium text-slate-300 mb-1">Target</label>
                <input type="text" name="target" id="target" value={formData.target === undefined ? '' : formData.target} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md" />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select name="status" id="status" value={formData.status || KpiStatus.Good} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md">
                  {Object.values(KpiStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="trend" className="block text-sm font-medium text-slate-300 mb-1">Trend</label>
                <select name="trend" id="trend" value={formData.trend || 'stable'} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md">
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                  <option value="stable">Stable</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SafetyKPICard;
