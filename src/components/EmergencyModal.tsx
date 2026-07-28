import React from 'react';
import { Hospital, MapPin, PhoneCall, ShieldAlert, Truck, X } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/mockCDOFeeds';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-rose-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600 text-white shadow">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-base text-white">CDO Emergency & Hotline Directory</h2>
              <p className="text-xs text-rose-200">Cagayan de Oro City Official Contacts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-rose-200 hover:text-white hover:bg-rose-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Directory Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick 911 Dial */}
          <div className="bg-gradient-to-r from-rose-900 to-rose-950 border border-rose-700/80 rounded-xl p-4 flex items-center justify-between shadow-inner">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300 block">
                Primary City Emergency
              </span>
              <h3 className="text-xl font-black text-white">ORO RESCUE 911 / CDRRMD</h3>
              <p className="text-xs text-rose-200">24/7 Flood, Medical & Disaster Response</p>
            </div>
            <a
              href="tel:911"
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black px-4 py-2 rounded-xl text-sm shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911</span>
            </a>
          </div>

          {/* List of Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Essential Public Safety Directory
            </h4>
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div>
                  <h5 className="font-extrabold text-sm text-slate-100">{contact.name}</h5>
                  <p className="text-xs text-amber-400 font-medium">{contact.agency}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{contact.address}</span>
                  </p>
                </div>
                <a
                  href={`tel:${contact.phone.split('/')[0].trim()}`}
                  className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-3 py-1.5 rounded-lg text-xs border border-slate-700 transition-colors self-start sm:self-center"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>

          {/* Police Stations 1-10 Reference */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <span>COCPO Police Station Precinct Hotline Quick List</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
              <div>• PS1 Divisoria: 0917-771-0063</div>
              <div>• PS2 Cogon: 0917-771-0064</div>
              <div>• PS3 Agora: 0917-771-0065</div>
              <div>• PS4 Carmen: 0917-771-0066</div>
              <div>• PS5 Macabalan: 0917-771-0067</div>
              <div>• PS6 Puerto: 0917-771-0068</div>
              <div>• PS7 Bulua: 0917-771-0069</div>
              <div>• PS8 Lumbia: 0917-771-0070</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
