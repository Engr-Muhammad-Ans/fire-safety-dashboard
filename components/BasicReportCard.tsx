import React, { useState } from 'react';
import SectionCard from './SectionCard';
import { AlertIcon } from './icons'; // Using AlertIcon for critical reporting

interface BasicReportCardProps {
  title: string;
  icon?: React.ReactNode;
  isZoomed?: boolean;
  onToggleZoom?: (title: string) => void;
}

const BasicReportCard: React.FC<BasicReportCardProps> = ({ title, icon, isZoomed, onToggleZoom }) => {
  const [showModal, setShowModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');


  const handleReportIncident = () => {
    setShowModal(true);
    setSubmitMessage('');
  };

  const handleSubmitReport = () => {
    if (!reportText.trim()) {
      setSubmitMessage('Report details cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('');
    console.log('Incident Reported:', {
      timestamp: new Date().toISOString(),
      details: reportText,
      location: 'User Input (to be added)', // Placeholder for location tagging
    });
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Incident reported successfully!');
      setReportText(''); // Clear text area
      setTimeout(() => { // Close modal after a delay
          setShowModal(false);
          setSubmitMessage('');
      }, 2000);
    }, 1500);
  };

  return (
    <>
      <SectionCard title={title} icon={icon} isZoomed={isZoomed} onToggleZoom={onToggleZoom}>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-slate-300 text-center">
            Instantly report fire incidents or hazards.
          </p>
          <button
            onClick={handleReportIncident}
            className="w-full flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          >
            <AlertIcon className="w-5 h-5 mr-2" />
            Report New Incident
          </button>
          <p className="text-xs text-slate-500 text-center mt-2">
            This will trigger an immediate alert. Use responsibly.
          </p>
        </div>
      </SectionCard>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-100">Report New Incident</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">&times;</button>
            </div>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe the incident or hazard... Be specific about location and nature."
              className="w-full h-32 p-3 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 mb-4 resize-none"
              disabled={isSubmitting}
            />
            {/* Placeholder for location input - future enhancement */}
            {/* <input type="text" placeholder="Location (e.g., Evaporator Deck 1)" className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md mb-4" /> */}
            
            {submitMessage && (
              <p className={`text-sm mb-3 ${submitMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                {submitMessage}
              </p>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-md transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BasicReportCard;