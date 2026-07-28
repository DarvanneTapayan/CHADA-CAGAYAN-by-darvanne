import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  CheckCircle2,
  PhoneCall,
  Send,
  ShieldAlert,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { NotificationItem, PushNotificationSettings } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PushNotificationSettings;
  setSettings: React.Dispatch<React.SetStateAction<PushNotificationSettings>>;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  onTestNotification: (topic: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  notifications,
  onClearNotifications,
  onTestNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');
  const [permissionState, setPermissionState] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  if (!isOpen) return null;

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setPermissionState(res);
      if (res === 'granted') {
        setSettings((prev) => ({ ...prev, enabled: true }));
        new Notification('CDO Pulse Enabled', {
          body: 'You will now receive real-time updates for Cagayan de Oro City!',
          icon: '/favicon.ico',
        });
      }
    }
  };

  const handleTopicToggle = (topicKey: keyof PushNotificationSettings['topics']) => {
    setSettings((prev) => ({
      ...prev,
      topics: {
        ...prev.topics,
        [topicKey]: !prev.topics[topicKey],
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">CDO Push Notification Hub</h2>
              <p className="text-xs text-slate-400">Manage real-time CDO alerts & advisories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Alert Settings
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors relative ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Feed Log ({notifications.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'settings' ? (
            <>
              {/* Browser Status Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Browser Web Push Status</span>
                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                      permissionState === 'granted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {permissionState.toUpperCase()}
                  </span>
                </div>

                {permissionState !== 'granted' && (
                  <button
                    onClick={requestBrowserPermission}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2 rounded-lg text-xs transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Enable System Push Notifications</span>
                  </button>
                )}
              </div>

              {/* Master Switch & Sound Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">Push Notification Engine</h3>
                    <p className="text-[11px] text-slate-400">Receive breaking CDO news when app is open or in background</p>
                  </div>
                  <button
                    onClick={() => setSettings((p) => ({ ...p, enabled: !p.enabled }))}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      settings.enabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">Audio Alert Sound</h3>
                    <p className="text-[11px] text-slate-400">Play subtle chime when urgent alert arrives</p>
                  </div>
                  <button
                    onClick={() => setSettings((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      settings.soundEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Subscribed Topics Checklist */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Subscribed CDO Alert Topics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'breaking', label: '🚨 PAGASA & River Flood Flash' },
                    { key: 'mayor', label: '🏛️ Mayor Klarex Uy Advisories' },
                    { key: 'crime', label: '🛡️ COCPO Police & Crime Alerts' },
                    { key: 'traffic', label: '🚦 RTA Traffic & Road Closures' },
                    { key: 'hospitals', label: '🏥 Hospital & Health Advisories' },
                    { key: 'events', label: '🎈 Higalaay & Local Events' },
                  ].map((topic) => {
                    const topicKey = topic.key as keyof PushNotificationSettings['topics'];
                    const isSubbed = settings.topics[topicKey];
                    return (
                      <button
                        key={topic.key}
                        onClick={() => handleTopicToggle(topicKey)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSubbed
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{topic.label}</span>
                        {isSubbed && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Test Notification Simulator */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400">Test Push Engine</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onTestNotification('breaking')}
                    className="flex items-center gap-1 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Test Flood Flash</span>
                  </button>
                  <button
                    onClick={() => onTestNotification('mayor')}
                    className="flex items-center gap-1 bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-800 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Test Mayor EO</span>
                  </button>
                  <button
                    onClick={() => onTestNotification('traffic')}
                    className="flex items-center gap-1 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Test RTA Traffic</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* History Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Received Alerts Log</span>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Clear Log
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No alerts received yet. Click "Test Push Engine" above to preview live notifications.
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                        <span>{item.title}</span>
                        <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
