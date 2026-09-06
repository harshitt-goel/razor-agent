import React from 'react';
import { AuditLog } from '../../types';
import { Terminal, Shield, CheckCircle2, AlertTriangle, ShoppingCart, Search, Sparkles, CreditCard, Clock } from 'lucide-react';

interface ActivityTimelineProps {
  logs: AuditLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'USER_REQUEST': return <Terminal className="w-3.5 h-3.5 text-slate-400" />;
      case 'CATALOG_SEARCH': return <Search className="w-3.5 h-3.5 text-cyan-400" />;
      case 'RECOMMENDATION': return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
      case 'UPSELL_PROPOSED': return <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />;
      case 'USER_APPROVAL': return <Shield className="w-3.5 h-3.5 text-indigo-400" />;
      case 'ORDER_CREATED': return <CreditCard className="w-3.5 h-3.5 text-purple-400" />;
      case 'PAYMENT_SUCCESS': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'PAYMENT_FAILURE': return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case 'CATALOG_SEARCH': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'RECOMMENDATION': return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'UPSELL_PROPOSED': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'USER_APPROVAL': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'PAYMENT_SUCCESS': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PAYMENT_FAILURE': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-[#151c2e] border border-[#232f48] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">Agent Action Audit Log</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Live Stream
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-mono">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No agent actions logged yet. Start shopping!
          </div>
        ) : (
          logs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            return (
              <div key={log.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {getEventIcon(log.eventType)}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getEventBadgeClass(log.eventType)}`}>
                      {log.eventType}
                    </span>
                  </div>
                  <span className="text-slate-500">{timeStr}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs mt-1 leading-relaxed">
                  {log.description}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
