import { AppLayout } from '@/app/AppLayout';
import { useEcoSphere } from '@/store/EcoSphereContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, FileCheck, CheckCircle2, AlertCircle, 
  Clock, Plus, X, UserCheck, ShieldAlert, Award, FileText, BarChart, 
  ChevronRight, RefreshCw, Upload, Check, BellRing, Database
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

// ── Report Compliance Issue Modal ─────────────────────────────────────────────

interface ReportIssueModalProps {
  onClose: () => void;
}

function ReportIssueModal({ onClose }: ReportIssueModalProps) {
  const { activeDepartments, activeEmployees, activeAudits, dispatch } = useEcoSphere();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [departmentId, setDepartmentId] = useState(activeDepartments[0]?.id ?? '');
  const [dueDate, setDueDate] = useState('');
  const [ownerId, setOwnerId] = useState(activeEmployees[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [relatedAuditId, setRelatedAuditId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ownerId) {
      toast({
        title: 'Missing Assigned Owner',
        description: 'Every compliance issue must be assigned an owner at creation time.',
        variant: 'destructive',
      });
      return;
    }
    if (!dueDate) {
      toast({
        title: 'Missing Due Date',
        description: 'Every compliance issue must have a specified due date at creation time.',
        variant: 'destructive',
      });
      return;
    }

    const dept = activeDepartments.find(d => d.id === departmentId);
    const owner = activeEmployees.find(e => e.id === ownerId);

    dispatch({
      type: 'ADD_COMPLIANCE_ISSUE',
      payload: {
        title,
        severity,
        departmentId,
        departmentName: dept?.name ?? 'General',
        dueDate,
        ownerId,
        ownerName: owner?.name ?? 'Unassigned',
        description,
        relatedAuditId: relatedAuditId || null,
      },
    });

    toast({
      title: 'Compliance Issue Logged',
      description: `"${title}" has been successfully logged and assigned to ${owner?.name}.`,
    });
    onClose();
  };

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Report Compliance Issue</h3>
        <p className="text-sm text-gray-500 mb-6 font-medium">Log a corporate risk, policy violation, or audit exception.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Issue Title</label>
            <input 
              type="text" required 
              className={inputClass} 
              placeholder="e.g. Incomplete vendor safety checklists" 
              value={title} onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Severity</label>
              <select className={inputClass} value={severity} onChange={(e) => setSeverity(e.target.value as any)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
              <select className={inputClass} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                {activeDepartments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Assigned Owner</label>
              <select className={inputClass} value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
                {activeEmployees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Due Date</label>
              <input 
                type="date" required 
                className={inputClass} 
                value={dueDate} onChange={(e) => setDueDate(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea 
              required rows={3} 
              className={inputClass} 
              placeholder="Provide a detailed description of the non-compliant process..." 
              value={description} onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Related Audit (Optional)</label>
            <select className={inputClass} value={relatedAuditId} onChange={(e) => setRelatedAuditId(e.target.value)}>
              <option value="">None</option>
              {activeAudits.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#b45309] hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition">Log Issue</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Compliance Issue Review Drawer ─────────────────────────────────────────────

interface ReviewIssueDrawerProps {
  issue: any;
  onClose: () => void;
}

function ReviewIssueDrawer({ issue, onClose }: ReviewIssueDrawerProps) {
  const { activeEmployees, dispatch } = useEcoSphere();
  const { toast } = useToast();
  
  const [status, setStatus] = useState(issue.status);
  const [ownerId, setOwnerId] = useState(issue.ownerId);
  const [dueDate, setDueDate] = useState(issue.dueDate);

  const handleUpdate = () => {
    const owner = activeEmployees.find(e => e.id === ownerId);
    dispatch({
      type: 'UPDATE_COMPLIANCE_ISSUE',
      payload: {
        id: issue.id,
        status,
        ownerId,
        ownerName: owner?.name ?? 'Unassigned',
        dueDate,
      },
    });
    toast({
      title: 'Compliance Issue Updated',
      description: 'Changes have been saved successfully and the owner has been notified.',
    });
    onClose();
  };

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#b45309] font-bold block mb-1">
              Review Exception Queue
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{issue.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6 flex-1">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</h4>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">{issue.description}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Exception Parameters</h4>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Resolution Status</label>
              <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Assigned Owner</label>
              <select className={inputClass} value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
                {activeEmployees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Target Due Date</label>
              <input type="date" className={inputClass} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex gap-3 mt-auto">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleUpdate} className="flex-1 py-2.5 bg-[#b45309] hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Policy Management Drawer (Phase 4 / Prompt 12) ─────────────────────────────

interface ManagePolicyDrawerProps {
  policy: any;
  onClose: () => void;
}

function ManagePolicyDrawer({ policy, onClose }: ManagePolicyDrawerProps) {
  const { activeEmployees, activeAcknowledgements, dispatch } = useEcoSphere();
  const { toast } = useToast();

  const [name, setName] = useState(policy.name);
  const [description, setDescription] = useState(policy.description);
  const [version, setVersion] = useState(policy.version);
  const [status, setStatus] = useState(policy.status);

  // Math counts for acknowledged vs pending
  const acknowledgedEmployees = activeEmployees.filter(emp =>
    activeAcknowledgements.some(ack => ack.policyId === policy.id && ack.employeeId === emp.id && ack.status === 'Acknowledged')
  );
  
  const pendingEmployees = activeEmployees.filter(emp =>
    !activeAcknowledgements.some(ack => ack.policyId === policy.id && ack.employeeId === emp.id && ack.status === 'Acknowledged')
  );

  const handleSaveChanges = () => {
    dispatch({
      type: 'UPDATE_POLICY',
      payload: {
        id: policy.id,
        name,
        description,
        version,
        status,
      },
    });
    toast({
      title: 'Policy Saved',
      description: 'Metadata has been updated. Acknowledgement tracking remains active.',
    });
    onClose();
  };

  const handleUploadVersion = () => {
    // Increment version helper
    const matches = version.match(/v(\d+)\.(\d+)/);
    let nextVersion = 'v1.1';
    if (matches) {
      const major = parseInt(matches[1]);
      const minor = parseInt(matches[2]) + 1;
      nextVersion = `v${major}.${minor}`;
    }
    
    setVersion(nextVersion);

    dispatch({
      type: 'UPDATE_POLICY',
      payload: {
        id: policy.id,
        version: nextVersion,
        name,
        description,
        status,
      },
    });

    toast({
      title: 'New Version Uploaded',
      description: `Resetting acknowledgements tracking to 0% for version ${nextVersion}. Reminders sent to all active employees.`,
    });
    onClose();
  };

  const handleTriggerReminder = () => {
    dispatch({
      type: 'UPDATE_POLICY',
      payload: {
        id: policy.id,
        idOnly: true,
        triggerReminder: true,
      } as any,
    });
    toast({
      title: 'Acknowledgement Reminders Sent',
      description: `Dispatched warning alerts to ${pendingEmployees.length} pending signees.`,
    });
  };

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#b45309] font-bold block mb-1">
              Policy Manager
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{policy.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6 flex-1">
          {/* Metadata Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Metadata Details</h4>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Policy Name</label>
              <input type="text" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description Summary</label>
              <textarea rows={2} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Active Status</label>
                <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="Active">Active</option>
                  <option value="Review">Review</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Version Tag</label>
                <input type="text" className={inputClass} value={version} onChange={(e) => setVersion(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Version Upload section */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <div className="flex gap-2.5 items-start">
              <Upload className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-gray-800">Publish New Version</h5>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                  Uploading an updated document resets acknowledgement tracking to 0% and sends warnings to all employees.
                </p>
              </div>
            </div>
            <button 
              onClick={handleUploadVersion}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700 rounded-lg transition"
            >
              Upload PDF & Increment Version
            </button>
          </div>

          {/* Acknowledgements Status List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Acknowledgement Log ({acknowledgedEmployees.length}/{activeEmployees.length})
              </h4>
              <button 
                onClick={handleTriggerReminder}
                className="text-[10px] font-bold text-amber-600 hover:text-amber-700 uppercase flex items-center gap-1"
              >
                <BellRing className="w-3 h-3" /> Remind Pending
              </button>
            </div>

            <div className="max-h-[160px] overflow-y-auto divide-y divide-gray-50 border border-gray-100 rounded-xl bg-gray-50/50 p-2">
              {activeEmployees.map((emp) => {
                const signed = acknowledgedEmployees.some(e => e.id === emp.id);
                return (
                  <div key={emp.id} className="py-2 px-3 flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-700">{emp.name}</span>
                    {signed ? (
                      <span className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                        <Check className="w-3.5 h-3.5" /> Signed
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold text-[10px]">Pending</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex gap-3 mt-auto">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSaveChanges} className="flex-1 py-2.5 bg-[#b45309] hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition">Save Metadata</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Add Audit Modal (Phase 5 / Prompt 15) ──────────────────────────────────────

interface AddAuditModalProps {
  onClose: () => void;
}

function AddAuditModal({ onClose }: AddAuditModalProps) {
  const { activeDepartments, dispatch } = useEcoSphere();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [auditor, setAuditor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_AUDIT',
      payload: {
        title,
        date,
        auditor,
        score: '-',
      },
    });
    toast({
      title: 'Audit Scheduled',
      description: `"${title}" has been successfully registered under Pending status.`,
    });
    onClose();
  };

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Schedule ESG Compliance Audit</h3>
        <p className="text-sm text-gray-500 mb-6 font-medium">Schedule a certification review with external or internal auditors.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Audit Title</label>
            <input type="text" required className={inputClass} placeholder="e.g. Q3 Energy Efficiency Assessment" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Scheduled Date</label>
              <input type="date" required className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Auditor / Entity</label>
              <input type="text" required className={inputClass} placeholder="e.g. KPMG" value={auditor} onChange={(e) => setAuditor(e.target.value)} />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#b45309] hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition">Schedule Audit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── View/Upload Audit Report Drawer (Phase 5 / Prompt 16) ─────────────────────

interface AuditReportDrawerProps {
  audit: any;
  onClose: () => void;
}

function AuditReportDrawer({ audit, onClose }: AuditReportDrawerProps) {
  const { activeDepartments, dispatch } = useEcoSphere();
  const { toast } = useToast();

  const [score, setScore] = useState('');
  const [reportFile, setReportFile] = useState('audit-findings-summary.pdf');
  const [findings, setFindings] = useState('');
  const [departmentId, setDepartmentId] = useState(activeDepartments[0]?.id ?? '');

  const isCompleted = audit.status === 'Completed';

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || !findings) {
      toast({
        title: 'Fields required',
        description: 'Please input audit score and findings description details.',
        variant: 'destructive',
      });
      return;
    }

    const dept = activeDepartments.find(d => d.id === departmentId);

    dispatch({
      type: 'COMPLETE_AUDIT',
      payload: {
        auditId: audit.id,
        score,
        reportFile,
        findings,
        departmentId,
        departmentName: dept?.name ?? 'HR',
      },
    });

    toast({
      title: 'Audit Complete & Logged',
      description: 'Audit moved to Completed. High-severity compliance issue auto-generated from findings.',
    });
    onClose();
  };

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#b45309] font-bold block mb-1">
              Audit Report File Manager
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{audit.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6 flex-1">
          <div>
            <span className="block text-xs font-semibold text-gray-400">Scheduled Date</span>
            <span className="text-sm font-bold text-gray-800">{audit.date}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400">Auditor Agency</span>
            <span className="text-sm font-bold text-gray-800">{audit.auditor}</span>
          </div>

          {isCompleted ? (
            // Finished report details
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Completion Metrics</h4>
              <div className="p-4 bg-green-50/50 border border-green-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-600">Audit Score</span>
                  <span className="font-bold text-green-700 text-sm">{audit.score}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-600 font-mono">Attachment File</span>
                  <button 
                    onClick={() => toast({ title: 'Simulating Download', description: `Downloaded file: ${audit.reportFile}` })}
                    className="font-bold text-[#b45309] hover:underline"
                  >
                    {audit.reportFile}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Report not available (empty state) & Admin Completion form (Prompt 16)
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-xs text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">Report not yet available</h5>
                  <p className="mt-1 leading-relaxed text-amber-700/80">This audit has not been completed. Upload a report and input the final score to mark as completed.</p>
                </div>
              </div>

              <form onSubmit={handleComplete} className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Record Audit Findings</h4>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Final Score / Rating</label>
                  <input type="text" required className={inputClass} placeholder="e.g. A, A-, B+" value={score} onChange={(e) => setScore(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-mono">Report PDF File Name</label>
                  <input type="text" required className={inputClass} value={reportFile} onChange={(e) => setReportFile(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Responsible Department (Auto exception triggers)</label>
                  <select className={inputClass} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                    {activeDepartments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Findings Summary (Creates High-severity issue)</label>
                  <textarea required rows={2} className={inputClass} placeholder="e.g. Reagents disposal containers were stored near high voltage..." value={findings} onChange={(e) => setFindings(e.target.value)} />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#b45309] hover:bg-amber-800 text-white rounded-xl text-sm font-bold transition shadow-sm"
                >
                  Complete Audit & Raise Compliance Issues
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────

export default function Governance() {
  const { 
    activePolicies, 
    activeAcknowledgements, 
    activeAudits, 
    activeComplianceIssues, 
    state, 
    dispatch 
  } = useEcoSphere();
  
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddAuditModal, setShowAddAuditModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
  
  const { toast } = useToast();

  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'issues');

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get('tab') || 'issues');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = `${window.location.pathname}?tab=${value}`;
    window.history.pushState(null, '', newUrl);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Severity Weight sorting mapping (Prompt 6)
  const severityWeight = { High: 3, Medium: 2, Low: 1 };
  const sortedIssues = [...activeComplianceIssues].sort((a, b) => {
    const diff = severityWeight[b.severity] - severityWeight[a.severity];
    if (diff !== 0) return diff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Policies table sorting: Review first, then Name (Prompt 11)
  const policyStatusWeight = { Review: 1, Active: 2, Archived: 3 };
  const sortedPolicies = [...activePolicies].sort((a, b) => {
    const diff = policyStatusWeight[a.status] - policyStatusWeight[b.status];
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name);
  });

  // Health Metrics Rollups (Prompt 9)
  const avgPolicyAcceptance = activePolicies.length > 0
    ? Math.round(activePolicies.reduce((sum, p) => sum + p.acceptanceRate, 0) / activePolicies.length)
    : 92;

  const trainingCompletion = 0; // stub as 0 until gamification/training built

  const completedAudits = activeAudits.filter(a => a.status === 'Completed').length;
  const progressAudits = activeAudits.filter(a => a.status === 'In Progress').length;
  const totalAuditsCount = activeAudits.length;
  const auditReadiness = totalAuditsCount > 0 
    ? Math.round(((completedAudits * 100) + (progressAudits * 50)) / totalAuditsCount) 
    : 85;

  const getProgressColorClass = (val: number) => {
    if (val >= 90) return 'bg-[#16a34a]'; // green
    if (val >= 50) return 'bg-amber-500'; // orange
    return 'bg-red-500'; // red
  };

  // Action Required Callout Card (Prompt 10)
  const mostUrgentPolicy = activePolicies.find(p => p.acceptanceRate < 50);

  const handleAcknowledgePolicy = (policyId: string) => {
    dispatch({
      type: 'ACKNOWLEDGE_POLICY',
      payload: { policyId, employeeId: 'emp-6' }, // Sanya Mirza signs
    });
    toast({
      title: 'Policy Acknowledged',
      description: 'You have signed and acknowledged this ESG policy.',
    });
  };

  return (
    <AppLayout>
      {showReportModal && <ReportIssueModal onClose={() => setShowReportModal(false)} />}
      {showAddAuditModal && <AddAuditModal onClose={() => setShowAddAuditModal(false)} />}
      
      <AnimatePresence>
        {selectedIssue && (
          <ReviewIssueDrawer 
            issue={selectedIssue} 
            onClose={() => setSelectedIssue(null)} 
          />
        )}
        {selectedPolicy && (
          <ManagePolicyDrawer 
            policy={selectedPolicy} 
            onClose={() => setSelectedPolicy(null)} 
          />
        )}
        {selectedAudit && (
          <AuditReportDrawer 
            audit={selectedAudit} 
            onClose={() => setSelectedAudit(null)} 
          />
        )}
      </AnimatePresence>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Governance & Compliance</h2>
            <p className="text-gray-500 text-sm mt-1">Monitor corporate policies, manage audits, and resolve compliance issues.</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'audits' && (
              <button 
                onClick={() => setShowAddAuditModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition shadow-sm bg-white"
              >
                <Plus className="w-4 h-4" />
                Schedule Audit
              </button>
            )}
            <button 
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#b45309] hover:bg-amber-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <AlertTriangle className="w-4 h-4" />
              Report Issue
            </button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mt-8">
          <TabsList className="bg-gray-100 rounded-xl p-1 inline-flex">
            <TabsTrigger value="issues" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#b45309] data-[state=active]:shadow-sm transition-all">
              Compliance Issues
            </TabsTrigger>
            <TabsTrigger value="policies" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#b45309] data-[state=active]:shadow-sm transition-all">
              Policies
            </TabsTrigger>
            <TabsTrigger value="audits" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#b45309] data-[state=active]:shadow-sm transition-all">
              Audits
            </TabsTrigger>
          </TabsList>
          
          {/* ── Compliance Issues Tab ─────────────────────────────────── */}
          <TabsContent value="issues" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Active Issues List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Active Compliance Issues</h3>
                    <p className="text-sm text-gray-500 mt-1">Exceptions requiring immediate review, reassignment, or resolution.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {sortedIssues.map((issue, i) => (
                      <motion.div 
                        key={issue.id} 
                        variants={item} custom={i} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-amber-200 transition-all gap-4 group"
                      >
                        <div className="flex gap-4">
                          <div className="mt-1 shrink-0">
                            {issue.severity === 'High' ? (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            ) : issue.severity === 'Medium' ? (
                              <AlertTriangle className="w-5 h-5 text-amber-500" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 leading-snug">{issue.title}</h4>
                              {issue.isOverdue && (
                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-red-200 animate-pulse">
                                  Overdue
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{issue.description}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs font-semibold text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${issue.severity === 'High' ? 'bg-red-500' : issue.severity === 'Medium' ? 'bg-amber-500' : 'bg-gray-400'}`}></span>
                                {issue.severity} Severity
                              </span>
                              <span>•</span>
                              <span className="text-gray-500">{issue.departmentName}</span>
                              <span>•</span>
                              <span className="text-gray-600">Owner: {issue.ownerName}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Due {issue.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            issue.status === 'Open' ? 'bg-red-50 text-red-700 border-red-200' :
                            issue.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {issue.status}
                          </span>
                          <button 
                            onClick={() => setSelectedIssue(issue)}
                            className="text-xs font-bold uppercase tracking-wider text-[#b45309] hover:text-amber-800 transition hover:underline"
                          >
                            Review
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Health Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 border border-gray-100">
                  <div className="flex gap-2 items-center mb-6">
                    <BarChart className="w-5 h-5 text-gray-400 shrink-0" />
                    <h3 className="text-lg font-bold text-gray-900">Governance Health</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Policy Acceptance */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                        <span>Policy Acceptance Rate</span>
                        <span>{avgPolicyAcceptance}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${getProgressColorClass(avgPolicyAcceptance)}`} style={{ width: `${avgPolicyAcceptance}%` }}></div>
                      </div>
                    </div>

                    {/* Training Completion */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                        <span>Training Completion</span>
                        <span>{trainingCompletion}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${getProgressColorClass(trainingCompletion)}`} style={{ width: `${trainingCompletion}%` }}></div>
                      </div>
                    </div>

                    {/* Audit Readiness */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                        <span>Audit Readiness</span>
                        <span>{auditReadiness}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${getProgressColorClass(auditReadiness)}`} style={{ width: `${auditReadiness}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Required Card Callout */}
                  {mostUrgentPolicy && (
                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl mt-8">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-bold text-amber-800">Action Required</h5>
                          <p className="text-xs font-semibold text-amber-700 mt-1.5 leading-relaxed">
                            "{mostUrgentPolicy.name}" acceptance rate has dropped below standard 50% threshold. Immediate policy update and corporate reassessment are required.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Policies Tab (Prompt 11 & 12) ─────────────────────────── */}
          <TabsContent value="policies" className="mt-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Policy Name</th>
                    <th className="px-6 py-4">Version / Updated</th>
                    <th className="px-6 py-4">Acceptance Rate</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedPolicies.map((policy) => (
                    <tr key={policy.id} className="hover:bg-amber-50/50 transition-colors bg-white group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors shrink-0">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{policy.name}</span>
                            <span className="text-[10px] text-gray-400 leading-none">{policy.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold mr-2">{policy.version}</span>
                        <span className="text-gray-400 font-normal">({policy.updatedDate})</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 max-w-[140px]">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${getProgressColorClass(policy.acceptanceRate)}`} 
                              style={{ width: `${policy.acceptanceRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-8">{policy.acceptanceRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          policy.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                          policy.status === 'Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-3 justify-end items-center">
                          <button 
                            onClick={() => handleAcknowledgePolicy(policy.id)}
                            className="text-xs font-bold text-green-600 hover:text-green-800 transition"
                          >
                            Sign Acknowledgement
                          </button>
                          <button 
                            onClick={() => setSelectedPolicy(policy)}
                            className="text-xs font-bold uppercase tracking-wider text-[#b45309] hover:text-amber-800 transition"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ── Audits Tab (Prompt 14, 15 & 16) ─────────────────────────── */}
          <TabsContent value="audits" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeAudits.map((audit) => (
                <div key={audit.id} className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 border border-transparent hover:border-amber-100 transition-colors flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <h3 className="text-base font-bold text-gray-900 leading-snug">{audit.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider border shrink-0 ${
                        audit.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                        audit.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {audit.status}
                      </span>
                    </div>
                    <div className="space-y-2.5 text-xs text-gray-600 font-semibold mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date</span>
                        <span className="text-gray-800">{audit.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auditor</span>
                        <span className="text-gray-800">{audit.auditor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Score</span>
                        <span className="font-bold text-gray-800">{audit.score}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedAudit(audit)}
                    className="w-full py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    View Report
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}