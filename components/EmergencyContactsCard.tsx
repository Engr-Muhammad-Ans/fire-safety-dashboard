
import React, { useState, useEffect } from 'react';
import SectionCard from './SectionCard';
import LoadingSpinner from './LoadingSpinner';
import { EmergencyContact } from '../types';
import { INITIAL_EMERGENCY_CONTACTS } from '../constants';
import { PhoneIcon as DialIcon, AddIcon, EditIcon, ExportIcon } from './icons'; 
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface EmergencyContactsCardProps {
  title: string;
  icon?: React.ReactNode; 
  isZoomed?: boolean;
  onToggleZoom?: (title: string) => void;
}

const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({ title, icon, isZoomed, onToggleZoom }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState<Partial<EmergencyContact>>({});
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  useEffect(() => {
    // console.log('[EmergencyContactsCard] Initializing contacts from constants.'); 
    setLoading(true);
    setTimeout(() => {
      setContacts([...INITIAL_EMERGENCY_CONTACTS]); 
      setLoading(false);
      // console.log('[EmergencyContactsCard] Contacts initialized:', [...INITIAL_EMERGENCY_CONTACTS]); 
    }, 1200);
  }, []); 

  const handleDial = (phone: string) => {
    console.log(`Dialing ${phone}...`);
    alert(`Simulating call to: ${phone}`);
  };

  const handleOpenModal = (contact: EmergencyContact | null = null) => {
    setEditingContact(contact);
    setFormData(contact ? { ...contact } : {});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      setContacts(prevContacts => prevContacts.map(c => c.id === editingContact.id ? { ...c, ...formData } as EmergencyContact : c));
    } else {
      const newContact: EmergencyContact = {
        id: crypto.randomUUID(), 
        name: formData.name || 'New Contact',
        role: formData.role || 'N/A',
        phone: formData.phone || 'N/A',
        department: formData.department || 'N/A',
      };
      setContacts(prevContacts => [...prevContacts, newContact]);
    }
    handleCloseModal();
  };
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageMargin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const generationTime = new Date().toLocaleString();
    
    const tableColumn = ["ID", "Name", "Role", "Phone", "Department"];
    const tableRows: string[][] = contacts.map(contact => [contact.id, contact.name, contact.role, contact.phone, contact.department]);
    
    const autoTableOptions: UserOptions = {
        head: [tableColumn], 
        body: tableRows, 
        startY: 25, 
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] }, 
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
    doc.save("emergency_contacts_report.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(contacts.map(c => ({
        ID: c.id, Name: c.name, Role: c.role, Phone: c.phone, Department: c.department
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    XLSX.writeFile(workbook, "emergency_contacts_report.xlsx");
  };

  const cardHeaderActions = (
    <button
      onClick={() => handleOpenModal()}
      className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-md text-white transition-colors"
      title="Add New Contact"
      aria-label="Add New Contact"
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
        {loading ? <LoadingSpinner /> : contacts.length === 0 ? (
          <p className="text-slate-400">No contacts available.</p>
        ) : (
          <ul className="space-y-3">
            {contacts.map((contact) => (
              <li key={contact.id} className="p-3 bg-slate-700/50 rounded-md shadow hover:bg-slate-700 transition-colors duration-150">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-200">{contact.name}</h3>
                    <p className="text-sm text-slate-400">{contact.role} - {contact.department}</p>
                    <p className="text-sm text-sky-400">{contact.phone}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleDial(contact.phone)}
                      className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-full text-white transition-colors"
                      title={`Call ${contact.name}`}
                      aria-label={`Call ${contact.name}`}
                    >
                      <DialIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenModal(contact)} className="p-1.5 text-slate-400 hover:text-sky-400" title="Edit Contact" aria-label={`Edit ${contact.name}`}>
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 id="contact-modal-title" className="text-xl font-semibold text-slate-100 mb-4">{editingContact ? 'Edit' : 'Add'} Contact</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" required />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                <input type="text" name="role" id="role" value={formData.role || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                <input type="text" name="department" id="department" value={formData.department || ''} onChange={handleChange} className="w-full p-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500" />
              </div>
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

export default EmergencyContactsCard;
