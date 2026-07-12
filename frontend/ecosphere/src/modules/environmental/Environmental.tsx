import { AppLayout } from '@/app/AppLayout';
import { useEcoSphere } from '@/store/EcoSphereContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Droplets, Zap, Flame, Plus, Filter, Download,
  CheckCircle2, AlertTriangle, XCircle, Cpu, Wrench, X, Edit2, Calendar, FileSpreadsheet, FileText, ChevronRight, Lock, Eye, Check, Target, Building
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useLocation } from 'wouter';
import type { EmissionScope, EnvironmentalGoal, EmissionFactor, UserRole } from '@/types';
import { calculateTransactionStatus, calculateTCO2e, calculateProgress, exportToCSV, exportToPDF } from '@/services/emissionService';

// ── Add/Edit Transaction Modal ──────────────────────────────────────────────────

export function AddTransactionModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { activeFactors, activeDepartments, dispatch } = useEcoSphere();
  const [fuelTypeId, setFuelTypeId] = useState(activeFactors[0]?.id ?? '');
  const [departmentId, setDepartmentId] = useState(activeDepartments[0]?.id ?? '');
  const [quantity, setQuantity] = useState('');
  const [limit, setLimit] = useState('');
  const [deadline, setDeadline] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ef = activeFactors.find((f) => f.id === fuelTypeId);
    const dept = activeDepartments.find((d) => d.id === departmentId);
    if (!ef || !dept) return;
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        fuelTypeId: ef.id,
        fuelType: ef.fuelType,
        departmentId: dept.id,
        department: dept.name,
        quantity: parseFloat(quantity),
        limit: parseFloat(limit),
        deadline,
        sourceType: 'Manual',
        emissionFactor: ef,
      },
    });
    onClose();
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Add Carbon Transaction</h3>
        <p className="text-sm text-gray-500 mb-6">Enter the details for a new manual emission record.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fuel Type</label>
            <select className={inputClass} value={fuelTypeId} onChange={(e) => setFuelTypeId(e.target.value)}>
              {activeFactors.map((f) => (
                <option key={f.id} value={f.id}>{f.fuelType} ({f.unit})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
            <select className={inputClass} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
              {activeDepartments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Quantity ({activeFactors.find((f) => f.id === fuelTypeId)?.unit ?? 'units'})
              </label>
              <input
                type="number" min="0" step="any" required
                className={inputClass} placeholder="e.g. 1500"
                value={quantity} onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Limit (kg CO2e)</label>
              <input
                type="number" min="0" step="any" required
                className={inputClass} placeholder="e.g. 5000"
                value={limit} onChange={(e) => setLimit(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Deadline</label>
            <input type="date" required className={inputClass} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          {quantity && limit && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-gray-500">Calculated tCO2e: </span>
              <span className="font-bold text-[#166534]">
                {calculateTCO2e(
                  parseFloat(quantity) || 0,
                  activeFactors.find((f) => f.id === fuelTypeId) ?? { co2eFactor: 0 },
                ).toFixed(3)} tCO2e
              </span>
              <span className="ml-3 text-gray-400">|</span>
              <span className="ml-3 text-gray-500"> Status: </span>
              <span className="font-semibold text-gray-800">
                {deadline
                  ? calculateTransactionStatus(
                      calculateTCO2e(parseFloat(quantity) || 0, activeFactors.find((f) => f.id === fuelTypeId) ?? { co2eFactor: 0 }) * 1000,
                      parseFloat(limit) || 1,
                      deadline,
                    )
                  : '—'}
              </span>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#166534] hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Add/Edit Factor Modal ──────────────────────────────────────────────────────

function AddFactorModal({
  onClose,
  editFactor,
}: {
  onClose: () => void;
  editFactor?: EmissionFactor;
}) {
  const { dispatch } = useEcoSphere();
  const [fuelType, setFuelType] = useState(editFactor?.fuelType ?? '');
  const [scope, setScope] = useState<EmissionScope>(editFactor?.scope ?? 1);
  const [co2eFactor, setCo2eFactor] = useState(editFactor?.co2eFactor.toString() ?? '');
  const [unit, setUnit] = useState(editFactor?.unit ?? '');
  const [effectiveDate, setEffectiveDate] = useState(editFactor?.effectiveDate ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editFactor) {
      dispatch({
        type: 'UPDATE_EMISSION_FACTOR',
        payload: {
          id: editFactor.id,
          fuelType,
          scope,
          co2eFactor: parseFloat(co2eFactor),
          unit,
          effectiveDate,
        },
      });
    } else {
      dispatch({
        type: 'ADD_EMISSION_FACTOR',
        payload: {
          id: `ef-${Date.now()}`,
          fuelType,
          scope,
          co2eFactor: parseFloat(co2eFactor),
          unit,
          effectiveDate,
        },
      });
    }
    onClose();
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{editFactor ? 'Edit Emission Factor' : 'Add Emission Factor'}</h3>
        <p className="text-sm text-gray-500 mb-6">Define conversion metrics to calculate carbon emissions.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fuel / Energy Type</label>
            <input type="text" required className={inputClass} placeholder="e.g. LPG" value={fuelType} onChange={(e) => setFuelType(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">GHG Scope</label>
              <select className={inputClass} value={scope} onChange={(e) => setScope(parseInt(e.target.value) as EmissionScope)}>
                <option value={1}>Scope 1 (Direct)</option>
                <option value={2}>Scope 2 (Indirect)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit</label>
              <input type="text" required className={inputClass} placeholder="L / kWh / m³" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CO2e / unit (kg)</label>
              <input type="number" min="0" step="any" required className={inputClass} placeholder="e.g. 2.68" value={co2eFactor} onChange={(e) => setCo2eFactor(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Effective Date</label>
              <input type="date" required className={inputClass} value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#166534] hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition">Save Factor</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Add/Edit Goal Modal ────────────────────────────────────────────────────────

function AddGoalModal({
  onClose,
  editGoal,
}: {
  onClose: () => void;
  editGoal?: EnvironmentalGoal;
}) {
  const { activeDepartments, dispatch } = useEcoSphere();
  const [title, setTitle] = useState(editGoal?.title ?? '');
  const [metricType, setMetricType] = useState(editGoal?.metricType ?? 'Emissions (tCO2e)');
  const [targetValue, setTargetValue] = useState(editGoal?.targetValue.toString() ?? '');
  const [currentValue, setCurrentValue] = useState(editGoal?.currentValue.toString() ?? '');
  const [unit, setUnit] = useState(editGoal?.unit ?? 'tCO2e');
  const [deadline, setDeadline] = useState(editGoal?.deadline ?? '');
  const [departmentId, setDepartmentId] = useState(editGoal?.departmentId ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title,
      metricType: metricType as any,
      targetValue: parseFloat(targetValue),
      currentValue: parseFloat(currentValue),
      unit,
      deadline,
      departmentId: departmentId || null,
    };

    if (editGoal) {
      dispatch({
        type: 'UPDATE_GOAL',
        payload: { id: editGoal.id, ...payload },
      });
    } else {
      dispatch({
        type: 'ADD_GOAL',
        payload: { id: `sg-${Date.now()}`, ...payload },
      });
    }
    onClose();
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{editGoal ? 'Edit Goal' : 'Create Goal'}</h3>
        <p className="text-sm text-gray-500 mb-6">Define organizational environmental objectives.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Goal Description / Title</label>
            <input type="text" required className={inputClass} placeholder="e.g. Reduce Scope 2 emissions by 20%" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Metric Type</label>
              <select className={inputClass} value={metricType} onChange={(e) => setMetricType(e.target.value as any)}>
                <option value="Emissions (tCO2e)">Emissions (tCO2e)</option>
                <option value="Energy (kWh)">Energy (kWh)</option>
                <option value="Water (kL)">Water (kL)</option>
                <option value="Waste (%)">Waste (%)</option>
                <option value="Vehicles (EV)">Vehicles (EV)</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
              <select className={inputClass} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                <option value="">Company-wide</option>
                {activeDepartments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current</label>
              <input type="number" required className={inputClass} value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Target</label>
              <input type="number" required className={inputClass} value={targetValue} onChange={(e) => setTargetValue(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit</label>
              <input type="text" required className={inputClass} placeholder="tCO2e / kL" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Target Date / Deadline</label>
            <input type="date" required className={inputClass} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#166534] hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition">Save Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === 'On Track')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
        <CheckCircle2 className="w-3 h-3" /> On Track
      </span>
    );
  if (status === 'At Risk')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">
        <AlertTriangle className="w-3 h-3" /> At Risk
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200">
      <XCircle className="w-3 h-3" /> Overdue
    </span>
  );
}

// ── Tab Skeleton Loader ────────────────────────────────────────────────────────

function TabSkeleton() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 space-y-5 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
        <div className="h-9 bg-gray-100 rounded-lg w-10"></div>
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-50 rounded-lg w-full"></div>
        <div className="h-10 bg-gray-50 rounded-lg w-full"></div>
        <div className="h-10 bg-gray-50 rounded-lg w-full"></div>
        <div className="h-10 bg-gray-50 rounded-lg w-full"></div>
      </div>
    </div>
  );
}

// ── Transaction Detail Drawer ──────────────────────────────────────────────────

interface DetailDrawerProps {
  txId: string;
  onClose: () => void;
}

function DetailDrawer({ txId, onClose }: DetailDrawerProps) {
  const { activeTransactions, activeFactors, dispatch } = useEcoSphere();
  const tx = activeTransactions.find((t) => t.id === txId);
  const [isEditing, setIsEditing] = useState(false);

  const [quantity, setQuantity] = useState(tx?.quantity.toString() ?? '');
  const [limit, setLimit] = useState(tx?.limit.toString() ?? '');
  const [deadline, setDeadline] = useState(tx?.deadline ?? '');

  if (!tx) return null;

  const ef = activeFactors.find((f) => f.id === tx.fuelTypeId);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!ef) return;
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: {
        id: txId,
        quantity: parseFloat(quantity),
        limit: parseFloat(limit),
        deadline,
        emissionFactor: ef,
      },
    });
    setIsEditing(false);
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Details</span>
            <h3 className="text-lg font-bold text-gray-900 mt-1">{tx.id.toUpperCase()}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block mb-1">Carbon Output</span>
                  <span className="text-2xl font-bold text-gray-800">{tx.calculatedTCO2e.toFixed(3)} <span className="text-sm font-semibold text-gray-400">tCO2e</span></span>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block mb-1">Limit Budget</span>
                  <span className="text-lg font-bold text-gray-700">{tx.limit.toLocaleString()} <span className="text-xs text-gray-400">kg</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Usage Progress</span>
                  <span className="font-semibold text-gray-700">{tx.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${tx.progress > 100 ? 'bg-red-500' : tx.progress > 90 ? 'bg-amber-500' : 'bg-[#16a34a]'}`}
                    style={{ width: `${Math.min(tx.progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                {[
                  { label: 'Fuel / Energy Type', val: tx.fuelType },
                  { label: 'Scope Classification', val: `Scope ${ef?.scope ?? 1}` },
                  { label: 'Consuming Department', val: tx.department },
                  { label: 'Raw Quantity Consumed', val: `${tx.quantity.toLocaleString()} ${ef?.unit}` },
                  { label: 'Compliance Status', val: <StatusBadge status={tx.status} /> },
                  { label: 'Reporting Deadline', val: tx.deadline },
                  { label: 'Source System', val: tx.sourceType },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm py-1">
                    <span className="text-gray-400 font-medium">{item.label}</span>
                    <span className="text-gray-800 font-semibold">{item.val}</span>
                  </div>
                ))}
              </div>

              {tx.sourceType === 'Auto-calculated' ? (
                <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4 mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-violet-600" />
                    <span className="text-xs font-bold text-violet-800 uppercase tracking-wider">Linked Audit Trace</span>
                  </div>
                  <p className="text-xs text-violet-600 leading-relaxed mb-3">
                    This transaction was automatically compiled from connected fleet fuel and utility logs.
                  </p>
                  <div className="bg-white border border-violet-100 rounded-lg p-2.5 flex items-center justify-between text-xs text-violet-800">
                    <div>
                      <span className="block font-semibold">Ref ID: FLEET-29384-L</span>
                      <span className="text-violet-500">Fleet Operations log</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-violet-400" />
                  </div>
                </div>
              ) : (
                <div className="pt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition shadow-sm"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" /> Edit Transaction
                  </button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Quantity ({ef?.unit ?? 'units'})
                </label>
                <input
                  type="number" min="0" step="any" required
                  className={inputClass} value={quantity} onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Limit (kg CO2e)
                </label>
                <input
                  type="number" min="0" step="any" required
                  className={inputClass} value={limit} onChange={(e) => setLimit(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Deadline
                </label>
                <input
                  type="date" required
                  className={inputClass} value={deadline} onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              {ef && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
                  <span className="text-gray-500">New Output Estimate: </span>
                  <span className="font-bold text-[#166534]">
                    {calculateTCO2e(parseFloat(quantity) || 0, ef).toFixed(3)} tCO2e
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#166534] hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition">Save Changes</button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function Environmental() {
  const { activeTransactions, activeFactors, activeGoals, activeMetrics, activeDepartments, state, dispatch } = useEcoSphere();
  
  // Modals state
  const [showTxModal, setShowTxModal] = useState(false);
  const [showFactorModal, setShowFactorModal] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor | undefined>(undefined);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<EnvironmentalGoal | undefined>(undefined);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  // User Role settings
  const currentUserRole = state.currentUserRole;
  const isAuthorized = currentUserRole === 'Sustainability Officer';

  // Tab state for lazy loading
  const [activeTab, setActiveTab] = useState('transactions');
  const [loadedTabs, setLoadedTabs] = useState<Record<string, boolean>>({
    transactions: true,
  });

  // Filters State via URL parameters
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const [showFilters, setShowFilters] = useState(false);

  const filterDept = searchParams.get('department') || '';
  const filterFuel = searchParams.get('fuelType') || '';
  const filterStatus = searchParams.get('status') || '';
  const filterStart = searchParams.get('startDate') || '';
  const filterEnd = searchParams.get('endDate') || '';

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (!loadedTabs[value]) {
      setTimeout(() => {
        setLoadedTabs((prev) => ({ ...prev, [value]: true }));
      }, 350);
    }
  };

  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setLocation(`/environmental?${params.toString()}`);
  };

  const resetFilters = () => {
    setLocation('/environmental');
  };

  // Filter and sort transactions
  const sortedTransactions = [...activeTransactions].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const filteredTransactions = sortedTransactions.filter((tx) => {
    if (filterDept && tx.departmentId !== filterDept) return false;
    if (filterFuel && tx.fuelTypeId !== filterFuel) return false;
    if (filterStatus && tx.status !== filterStatus) return false;
    if (filterStart && new Date(tx.deadline) < new Date(filterStart)) return false;
    if (filterEnd && new Date(tx.deadline) > new Date(filterEnd)) return false;
    return true;
  });

  // KPI Calculations
  const scope1kgCO2e = activeTransactions
    .filter((tx) => activeFactors.find((f) => f.id === tx.fuelTypeId)?.scope === 1)
    .reduce((sum, tx) => sum + tx.calculatedTCO2e * 1000, 0);

  const scope2kgCO2e = activeTransactions
    .filter((tx) => activeFactors.find((f) => f.id === tx.fuelTypeId)?.scope === 2)
    .reduce((sum, tx) => sum + tx.calculatedTCO2e * 1000, 0);

  const waterUsage = activeMetrics
    .filter((m) => m.category === 'Water')
    .reduce((sum, m) => sum + m.value, 0);
  const waterFormatted = waterUsage >= 1000 ? `${(waterUsage / 1000).toFixed(1)}k` : waterUsage.toLocaleString();

  const wasteMetrics = activeMetrics.filter((m) => m.category === 'Waste');
  const wasteDiverted = wasteMetrics.length > 0
    ? Math.round(wasteMetrics.reduce((sum, m) => sum + m.value, 0) / wasteMetrics.length)
    : 0;

  // Goals Aggregation
  const overallGoalProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(filteredTransactions);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions, {
      department: activeDepartments.find((d) => d.id === filterDept)?.name,
      fuelType: activeFactors.find((f) => f.id === filterFuel)?.fuelType,
      status: filterStatus,
      startDate: filterStart,
      endDate: filterEnd,
    });
  };

  const hasActiveFilters = filterDept || filterFuel || filterStatus || filterStart || filterEnd;

  return (
    <AppLayout>
      {showTxModal && <AddTransactionModal onClose={() => setShowTxModal(false)} />}
      
      {showFactorModal && (
        <AddFactorModal
          editFactor={selectedFactor}
          onClose={() => {
            setShowFactorModal(false);
            setSelectedFactor(undefined);
          }}
        />
      )}

      {showGoalModal && (
        <AddGoalModal
          editGoal={selectedGoal}
          onClose={() => {
            setShowGoalModal(false);
            setSelectedGoal(undefined);
          }}
        />
      )}
      
      <AnimatePresence>
        {selectedTxId && (
          <DetailDrawer txId={selectedTxId} onClose={() => setSelectedTxId(null)} />
        )}
      </AnimatePresence>

      <div className="w-full space-y-6">
        {/* Role Simulator Banner */}
        <div className="bg-[#f0faf4] border border-green-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-800 font-semibold">Role Simulation Mode:</span>
            <span className="text-gray-500">Emission factors modification checks current context authorization.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Act as:</span>
            <select
              value={currentUserRole}
              onChange={(e) => dispatch({ type: 'SET_USER_ROLE', payload: e.target.value as UserRole })}
              className="bg-white border border-green-200 rounded-lg px-2 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-400"
            >
              <option value="Sustainability Officer">Sustainability Officer (Jane Doe)</option>
              <option value="Employee">Employee (Standard View)</option>
              <option value="Visitor">Visitor (Read-Only)</option>
            </select>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Environmental Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Track emissions, energy usage, and sustainability goals.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
                <Download className="w-4 h-4" /> Export
              </button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30 min-w-[120px] transition-all">
                <button onClick={handleExportCSV} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" /> Excel/CSV
                </button>
                <button onClick={handleExportPDF} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                  <FileText className="w-3.5 h-3.5 text-red-500" /> PDF Report
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowTxModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#166534] hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>

        {/* KPI summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Scope 1 Emissions', value: (scope1kgCO2e / 1000).toFixed(2), unit: 'tCO2e', icon: Flame,    color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Scope 2 Emissions', value: (scope2kgCO2e / 1000).toFixed(2), unit: 'tCO2e', icon: Zap,      color: 'text-amber-600',  bg: 'bg-amber-50'  },
            { label: 'Water Usage',       value: waterFormatted,                    unit: 'kL',    icon: Droplets, color: 'text-blue-600',   bg: 'bg-blue-50'   },
            { label: 'Waste Diverted',    value: wasteDiverted.toString(),          unit: '%',     icon: Leaf,     color: 'text-[#16a34a]',  bg: 'bg-green-50'  },
          ].map((stat, i) => (
            <div key={i}>
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value} <span className="text-sm font-medium text-gray-400">{stat.unit}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabbed Section */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mt-8">
          <TabsList className="bg-gray-100 rounded-xl p-1 inline-flex">
            {['transactions', 'goals', 'factors'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#166534] data-[state=active]:shadow-sm transition-all capitalize"
              >
                {tab === 'factors' ? 'Emission Factors' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Transactions Tab ─────────────────────────────────────────── */}
          <TabsContent value="transactions" className="mt-6">
            {!loadedTabs.transactions ? (
              <TabSkeleton />
            ) : (
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Carbon Transactions Log</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Showing {filteredTransactions.length} of {activeTransactions.length} records · Default sorted by deadline
                      </p>
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                        showFilters || hasActiveFilters
                          ? 'bg-green-50 text-[#166534] border-green-200 shadow-sm'
                          : 'text-gray-400 border-gray-200 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Filter className="w-4 h-4" /> Filters
                      {hasActiveFilters && (
                        <span className="w-2 h-2 rounded-full bg-[#166534]" />
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-gray-100 pt-4 mt-2 space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Department</label>
                            <select
                              value={filterDept}
                              onChange={(e) => updateFilters({ department: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
                            >
                              <option value="">All Departments</option>
                              {activeDepartments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Fuel Type</label>
                            <select
                              value={filterFuel}
                              onChange={(e) => updateFilters({ fuelType: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
                            >
                              <option value="">All Fuels</option>
                              {activeFactors.map((f) => (
                                <option key={f.id} value={f.id}>{f.fuelType}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                            <select
                              value={filterStatus}
                              onChange={(e) => updateFilters({ status: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
                            >
                              <option value="">All Statuses</option>
                              <option value="On Track">On Track</option>
                              <option value="At Risk">At Risk</option>
                              <option value="Overdue">Overdue</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Deadline Start</label>
                            <input
                              type="date"
                              value={filterStart}
                              onChange={(e) => updateFilters({ startDate: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Deadline End</label>
                            <input
                              type="date"
                              value={filterEnd}
                              onChange={(e) => updateFilters({ endDate: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
                            />
                          </div>
                        </div>

                        {hasActiveFilters && (
                          <div className="flex justify-end pt-2">
                            <button
                              onClick={resetFilters}
                              className="text-xs font-semibold text-[#166534] bg-green-50 hover:bg-green-100 rounded-lg px-3 py-1.5 transition-colors"
                            >
                              Reset Active Filters
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Fuel Type</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4">tCO2e</th>
                        <th className="px-6 py-4">Progress to Limit</th>
                        <th className="px-6 py-4">Deadline</th>
                        <th className="px-6 py-4">Source</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/20">
                            No matching carbon logs found. Try altering your filter parameters.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((tx) => {
                          const ef = activeFactors.find((f) => f.id === tx.fuelTypeId);
                          return (
                            <tr
                              key={tx.id}
                              onClick={() => setSelectedTxId(tx.id)}
                              className="hover:bg-green-50/85 transition-colors bg-white cursor-pointer group"
                            >
                              <td className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-green-700">{tx.id.toUpperCase()}</td>
                              <td className="px-6 py-4 font-medium text-gray-900">{tx.fuelType}</td>
                              <td className="px-6 py-4 text-gray-600">{tx.department}</td>
                              <td className="px-6 py-4 text-gray-600 tabular-nums">
                                {tx.quantity.toLocaleString()} <span className="text-gray-400 text-xs">{ef?.unit}</span>
                              </td>
                              <td className="px-6 py-4 font-semibold text-gray-800 tabular-nums">
                                {tx.calculatedTCO2e.toFixed(3)}
                                <span className="text-gray-400 font-normal text-xs ml-1">t</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1.5 w-44">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">{(tx.calculatedTCO2e * 1000).toFixed(0)} / {tx.limit.toLocaleString()} kg</span>
                                    <span className="font-semibold text-gray-700">{tx.progress}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${tx.progress > 100 ? 'bg-red-500' : tx.progress > 90 ? 'bg-amber-500' : 'bg-[#16a34a]'}`}
                                      style={{ width: `${Math.min(tx.progress, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-500 text-xs">{tx.deadline}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  tx.sourceType === 'Manual'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-violet-50 text-violet-700 border-violet-200'
                                }`}>
                                  {tx.sourceType === 'Manual' ? <Wrench className="w-2.5 h-2.5" /> : <Cpu className="w-2.5 h-2.5" />}
                                  {tx.sourceType}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <StatusBadge status={tx.status} />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Goals Tab (Section 5 / Prompt 11) ────────────────────────── */}
          <TabsContent value="goals" className="mt-6">
            {!loadedTabs.goals ? (
              <TabSkeleton />
            ) : (
              <div className="space-y-6">
                {/* Radial summary overall progress card */}
                <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aggregate Progress</span>
                    <h3 className="text-xl font-bold text-gray-900">Environmental Goals Attainment</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      Computed average completion of active organizational environmental goals feeding directly into dynamic department ESG scores.
                    </p>
                    <button
                      onClick={() => setShowGoalModal(true)}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#166534] hover:bg-green-800 text-white rounded-lg text-sm font-semibold transition"
                    >
                      <Plus className="w-4 h-4" /> Create Goal
                    </button>
                  </div>
                  
                  {/* Radial / Ring indicator */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="50" stroke="#e8ede6" strokeWidth="10" fill="none" />
                        <circle
                          cx="72" cy="72" r="50"
                          stroke="#16a34a" strokeWidth="10" fill="none" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 50}
                          strokeDashoffset={2 * Math.PI * 50 - (overallGoalProgress / 100) * (2 * Math.PI * 50)}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="text-center z-10 flex flex-col">
                        <span className="text-3xl font-extrabold text-[#166534]">{overallGoalProgress}%</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goals Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {activeGoals.map((goal) => {
                    const deptName = activeDepartments.find((d) => d.id === goal.departmentId)?.name ?? 'Company-wide';
                    return (
                      <div key={goal.id} className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between hover:shadow-md transition group">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <h3 className="font-bold text-gray-900 leading-snug group-hover:text-[#166534] transition-colors">{goal.title}</h3>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full shrink-0">{goal.metricType}</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Current: <span className="text-gray-900 font-semibold">{goal.currentValue.toLocaleString()}</span></span>
                              <span>Target: <span className="text-gray-900 font-semibold">{goal.targetValue.toLocaleString()}</span></span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#16a34a] rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(goal.progress, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] font-semibold text-gray-500 mt-2">
                              <span>{goal.progress.toFixed(1)}% Complete</span>
                              <span>{goal.unit}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Building className="w-3.5 h-3.5" />
                            <span className="font-medium text-gray-500">{deptName}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedGoal(goal);
                                setShowGoalModal(true);
                              }}
                              className="text-gray-400 hover:text-gray-700 font-semibold"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-400">{goal.deadline}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Emission Factors Tab (Section 6 / Prompt 12) ─────────────── */}
          <TabsContent value="factors" className="mt-6">
            {!loadedTabs.factors ? (
              <TabSkeleton />
            ) : (
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">Emission Factors Configuration</h3>
                      {!isAuthorized && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">CO2e conversion factors. Only Sustainability Officer role has write-access permissions.</p>
                  </div>
                  
                  {isAuthorized ? (
                    <button
                      onClick={() => setShowFactorModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#166534] hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add Factor
                    </button>
                  ) : (
                    <button
                      disabled
                      title="Only Sustainability Officer roles can configure conversion metrics"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg text-sm font-medium cursor-not-allowed shrink-0"
                    >
                      <Lock className="w-4 h-4" /> Add Factor
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Fuel / Energy Type</th>
                        <th className="px-6 py-4">GHG Scope</th>
                        <th className="px-6 py-4">CO2e Factor</th>
                        <th className="px-6 py-4">Unit</th>
                        <th className="px-6 py-4">Effective Date</th>
                        <th className="px-6 py-4">Status</th>
                        {isAuthorized && <th className="px-6 py-4 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeFactors.map((ef) => (
                        <tr key={ef.id} className="hover:bg-green-50/50 transition-colors bg-white">
                          <td className="px-6 py-4 font-bold text-gray-900">{ef.fuelType}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              ef.scope === 1
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              Scope {ef.scope}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-semibold text-gray-800">{ef.co2eFactor}</td>
                          <td className="px-6 py-4 text-gray-500">kg CO2e / {ef.unit}</td>
                          <td className="px-6 py-4 text-gray-500 text-xs">{ef.effectiveDate}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold">
                              <Check className="w-3.5 h-3.5" /> Active
                            </span>
                          </td>
                          {isAuthorized && (
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedFactor(ef);
                                  setShowFactorModal(true);
                                }}
                                className="text-xs font-semibold text-[#166534] bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition"
                              >
                                Edit
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}