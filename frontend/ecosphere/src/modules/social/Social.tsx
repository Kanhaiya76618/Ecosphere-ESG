import { AppLayout } from '@/app/AppLayout';
import { useEcoSphere } from '@/store/EcoSphereContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, Check, X, Calendar, MapPin, Award, 
  Plus, FolderHeart, Info, ShieldAlert, BadgeInfo, XCircle, Trash2, CheckCircle2,
  Database, ShieldCheck, UserCheck, RefreshCw, Layers
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { syncHRISMetrics } from '@/services/socialService';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// ── Create Campaign / CSR Activity Modal ───────────────────────────────────────

interface CreateCampaignModalProps {
  onClose: () => void;
}

export function CreateCampaignModal({ onClose }: CreateCampaignModalProps) {
  const { activeCategories, dispatch } = useEcoSphere();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(activeCategories[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [pointsAvailable, setPointsAvailable] = useState('');
  const [location, setLocation] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cat = activeCategories.find(c => c.id === categoryId);
    dispatch({
      type: 'ADD_CSR_ACTIVITY',
      payload: {
        id: `csr-${Date.now()}`,
        title,
        categoryId,
        category: cat?.name ?? 'General',
        description,
        date,
        status: 'Upcoming', // Prompt 6: On submit, create with Status='Upcoming'
        pointsAvailable: parseInt(pointsAvailable) || 100,
        location,
        participants: [],
      },
    });
    onClose();
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Create CSR Campaign</h3>
        <p className="text-sm text-gray-500 mb-6 font-medium">Launch a corporate social responsibility initiative.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Campaign Title</label>
            <input type="text" required className={inputClass} placeholder="e.g. Tree Plantation drive" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
            <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {activeCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Campaign Description</label>
            <textarea required rows={3} className={inputClass} placeholder="Outline the activity milestones..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">XP Points Available</label>
              <input type="number" required min="10" className={inputClass} placeholder="e.g. 200" value={pointsAvailable} onChange={(e) => setPointsAvailable(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Campaign Date</label>
              <input type="date" required className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Location / Venue (Optional)</label>
            <input type="text" className={inputClass} placeholder="e.g. HQ Central Courtyard" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#be185d] hover:bg-rose-800 text-white rounded-xl text-sm font-semibold transition">Start Campaign</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── CSR Activity Detail Drawer ─────────────────────────────────────────────────

interface ActivityDetailDrawerProps {
  activity: any;
  onClose: () => void;
}

function ActivityDetailDrawer({ activity, onClose }: ActivityDetailDrawerProps) {
  const { activeParticipations, state, dispatch } = useEcoSphere();
  const { toast } = useToast();

  const activityParticipations = activeParticipations.filter(
    (p) => p.activityId === activity.id
  );

  const isCompleted = activity.status === 'Completed';
  const userRole = state.currentUserRole;
  const isAdmin = userRole === 'Sustainability Officer';

  const markAsCompleted = () => {
    dispatch({
      type: 'UPDATE_CSR_ACTIVITY',
      payload: { id: activity.id, status: 'Completed' },
    });
    toast({
      title: 'Activity Completed',
      description: 'The campaign status was successfully updated to Completed.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
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
            <span className="text-[10px] uppercase tracking-widest text-[#be185d] font-bold block mb-1">
              {activity.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{activity.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6 flex-1">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</h4>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">{activity.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div>
              <span className="block text-xs font-semibold text-gray-400">Date</span>
              <span className="text-sm font-bold text-gray-800">{activity.date}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-400">Location</span>
              <span className="text-sm font-bold text-gray-800">{activity.location || 'Remote'}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Participant Status Log ({activityParticipations.length})
            </h4>
            <div className="divide-y divide-gray-50">
              {activityParticipations.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 italic">No participation logs found for this activity.</div>
              ) : (
                activityParticipations.map((part) => (
                  <div key={part.id} className="py-2.5 flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800">{part.employeeName}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      part.approvalStatus === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      part.approvalStatus === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {part.approvalStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && !isCompleted && (
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2 mt-auto">
            <button
              onClick={markAsCompleted}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Activity as Completed
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Connect HRIS Modal ─────────────────────────────────────────────────────────

interface ConnectHRISModalProps {
  onClose: () => void;
}

function ConnectHRISModal({ onClose }: ConnectHRISModalProps) {
  const { dispatch } = useEcoSphere();
  const { toast } = useToast();
  const [provider, setProvider] = useState('Workday');
  const [apiKey, setApiKey] = useState('');
  const [oauthToken, setOauthToken] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call socialService scheduled sync job stub
    const syncedMetrics = syncHRISMetrics(provider);
    
    dispatch({
      type: 'CONNECT_HRIS',
      payload: {
        provider,
        metrics: syncedMetrics,
      },
    });

    toast({
      title: 'HRIS Connected Successfully',
      description: `Imported demographic metrics and headcount stats from ${provider}.`,
    });
    onClose();
  };

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Connect HRIS Integration</h3>
        <p className="text-sm text-gray-500 mb-6 font-medium">Link Workday or BambooHR to fetch diversity demographics.</p>
        
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Provider</label>
            <select className={inputClass} value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="Workday">Workday</option>
              <option value="BambooHR">BambooHR</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">API Endpoint Key</label>
            <input 
              type="text" 
              required 
              className={inputClass} 
              placeholder="e.g. hris_client_secret_xyz123" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">OAuth Client Secret (Optional)</label>
            <input 
              type="password" 
              className={inputClass} 
              placeholder="••••••••••••••••" 
              value={oauthToken} 
              onChange={(e) => setOauthToken(e.target.value)} 
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-[#be185d] hover:bg-rose-800 text-white rounded-xl text-sm font-semibold transition">Connect Provider</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────

export default function Social() {
  const { 
    activeCSRActivities, 
    activeParticipations, 
    activeChallengeParticipations, 
    activeEmployees, 
    activeDiversityMetrics,
    state, 
    dispatch 
  } = useEcoSphere();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const { toast } = useToast();

  const searchParams = new URLSearchParams(window.location.search);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'activities');

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get('tab') || 'activities');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = `${window.location.pathname}?tab=${value}`;
    window.history.pushState(null, '', newUrl);
  };

  // Merge EmployeeParticipation (CSR) and ChallengeParticipation (Gamification) for Approvals queue
  const csrSubmissions = activeParticipations.map(p => ({
    ...p,
    isChallenge: false,
    title: p.activityTitle,
    typeLabel: 'CSR Campaign'
  }));

  const challengeSubmissions = activeChallengeParticipations.map(c => ({
    ...c,
    isChallenge: true,
    title: c.challengeTitle,
    typeLabel: 'Gamification Challenge'
  }));

  const mergedQueue = [...csrSubmissions, ...challengeSubmissions];
  const pendingCount = mergedQueue.filter(p => p.approvalStatus === 'Pending').length;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Handle approvals decision (Prompt 9)
  const handleApprove = (part: any) => {
    const evidenceRequired = state.settings.evidenceRequirement;
    if (evidenceRequired && !part.proofFile) {
      toast({
        title: 'Evidence Required',
        description: 'Submission approval blocked. A valid proof file attachment is mandated by active ESG policy.',
        variant: 'destructive',
      });
      return;
    }

    if (part.isChallenge) {
      dispatch({ type: 'APPROVE_CHALLENGE_SUBMISSION', payload: { participationId: part.id } });
    } else {
      dispatch({ type: 'APPROVE_SUBMISSION', payload: { participationId: part.id } });
    }

    toast({
      title: 'Submission Approved',
      description: `${part.employeeName} has been awarded ${part.pointsEarned} XP!`,
    });
  };

  const handleReject = (part: any) => {
    if (part.isChallenge) {
      dispatch({ type: 'REJECT_CHALLENGE_SUBMISSION', payload: { participationId: part.id } });
    } else {
      dispatch({ type: 'REJECT_SUBMISSION', payload: { participationId: part.id } });
    }

    toast({
      title: 'Submission Rejected',
      description: `Submission for ${part.employeeName} was marked as rejected.`,
    });
  };

  const handleDownloadProof = (filename: string) => {
    toast({
      title: 'Downloading file',
      description: `Simulating download: ${filename}`,
    });
  };

  // ── Diversity Metrics Synced Dashboard (Prompt 12) ──────────────────────────

  // Extract gender data
  const genderMetrics = activeDiversityMetrics.filter(m => m.metricType === 'Gender');
  const genderDistribution = [
    { name: 'Female', value: genderMetrics.filter(m => m.categoryValue === 'Female').reduce((sum, m) => sum + m.count, 0), color: '#be185d' },
    { name: 'Male', value: genderMetrics.filter(m => m.categoryValue === 'Male').reduce((sum, m) => sum + m.count, 0), color: '#3b82f6' },
    { name: 'Non-binary', value: genderMetrics.filter(m => m.categoryValue === 'Non-binary').reduce((sum, m) => sum + m.count, 0), color: '#8b5cf6' },
  ].filter(g => g.value > 0);

  // Extract age data
  const ageMetrics = activeDiversityMetrics.filter(m => m.metricType === 'Age Group');
  const ageDistribution = [
    { name: '20-30', count: ageMetrics.filter(m => m.categoryValue === '20-30').reduce((sum, m) => sum + m.count, 0) },
    { name: '31-45', count: ageMetrics.filter(m => m.categoryValue === '31-45').reduce((sum, m) => sum + m.count, 0) },
    { name: '46+', count: ageMetrics.filter(m => m.categoryValue === '46+').reduce((sum, m) => sum + m.count, 0) },
  ].filter(a => a.count > 0);

  // Extract ethnicity data
  const ethnicityMetrics = activeDiversityMetrics.filter(m => m.metricType === 'Ethnicity');
  const ethnicityDemographics = [
    { label: 'Asian', count: ethnicityMetrics.filter(m => m.categoryValue === 'Asian').reduce((sum, m) => sum + m.count, 0) },
    { label: 'White', count: ethnicityMetrics.filter(m => m.categoryValue === 'White').reduce((sum, m) => sum + m.count, 0) },
    { label: 'Hispanic', count: ethnicityMetrics.filter(m => m.categoryValue === 'Hispanic').reduce((sum, m) => sum + m.count, 0) },
  ].filter(e => e.count > 0);

  return (
    <AppLayout>
      {showCreateModal && <CreateCampaignModal onClose={() => setShowCreateModal(false)} />}
      {showConnectModal && <ConnectHRISModal onClose={() => setShowConnectModal(false)} />}
      <AnimatePresence>
        {selectedActivity && (
          <ActivityDetailDrawer 
            activity={selectedActivity} 
            onClose={() => setSelectedActivity(null)} 
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
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Social & CSR</h2>
            <p className="text-gray-500 text-sm mt-1">Manage corporate social responsibility initiatives and employee engagement.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#be185d] hover:bg-rose-800 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Heart className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Tabs navigation */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mt-8">
          <TabsList className="bg-gray-100 rounded-xl p-1 inline-flex">
            <TabsTrigger value="activities" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#be185d] data-[state=active]:shadow-sm transition-all">
              CSR Activities
            </TabsTrigger>
            <TabsTrigger value="approvals" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#be185d] data-[state=active]:shadow-sm transition-all flex items-center gap-2">
              Approvals 
              {pendingCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="diversity" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#be185d] data-[state=active]:shadow-sm transition-all">
              Diversity & Inclusion
            </TabsTrigger>
          </TabsList>
          
          {/* ── CSR Activities Tab ─────────────────────────────────────── */}
          <TabsContent value="activities" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCSRActivities.map((activity, i) => {
                const confirmedSubmissions = activeParticipations.filter(
                  p => p.activityId === activity.id && p.approvalStatus === 'Approved'
                );
                const confirmedCount = confirmedSubmissions.length;
                
                return (
                  <motion.div key={activity.id} variants={item} custom={i}>
                    <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow group border border-transparent hover:border-rose-100">
                      <div className={`h-2 w-full ${
                        activity.status === 'Active' ? 'bg-[#be185d]' :
                        activity.status === 'Completed' ? 'bg-[#16a34a]' :
                        'bg-gray-300'
                      }`}></div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              activity.status === 'Active' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              activity.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {activity.status}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                              {activity.category}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#be185d] transition-colors">{activity.title}</h3>
                          <p className="text-xs font-medium text-gray-500 leading-relaxed mb-5 line-clamp-2">{activity.description}</p>
                          
                          <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-2.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold">{activity.date}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{confirmedCount} Participants Confirmed</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Award className="w-4 h-4 text-rose-500" />
                              <span className="text-rose-700 font-bold">{activity.pointsAvailable} Points available</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                          {confirmedCount > 0 ? (
                            <div className="flex -space-x-2">
                              {confirmedSubmissions.slice(0, 3).map((sub, idx) => {
                                const initials = sub.employeeName.split(' ').map(n => n[0]).join('') ?? 'U';
                                return (
                                  <div
                                    key={sub.id}
                                    title={sub.employeeName}
                                    className="w-8 h-8 rounded-full border-2 border-white bg-rose-100 text-[#be185d] flex items-center justify-center text-xs font-bold shrink-0"
                                  >
                                    {initials}
                                  </div>
                                );
                              })}
                              {confirmedCount > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 text-gray-500 flex items-center justify-center text-xs font-bold">
                                  +{confirmedCount - 3}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No confirmed participants</span>
                          )}
                          <button
                            onClick={() => setSelectedActivity(activity)}
                            className="text-xs font-bold text-[#be185d] hover:text-rose-800 transition hover:underline"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* ── Approvals Tab ──────────────────────────────────────────── */}
          <TabsContent value="approvals" className="mt-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Employee Submission Queue</h3>
                  <p className="text-sm text-gray-500 mt-1">Review proof of participation in CSR campaigns and gamification challenges.</p>
                </div>
                {state.settings.evidenceRequirement && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-xl font-semibold">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Evidence Requirement Policy is ON</span>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Campaign / Activity</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Proof Attachment</th>
                      <th className="px-6 py-4">XP Points</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mergedQueue.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium">
                          No submissions logged in the system.
                        </td>
                      </tr>
                    ) : (
                      mergedQueue.map((approval) => {
                        const hasNoProof = !approval.proofFile;
                        const blockApproval = state.settings.evidenceRequirement && hasNoProof;
                        
                        return (
                          <tr key={approval.id} className="hover:bg-gray-50/80 transition-colors bg-white">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {approval.employeeName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="font-semibold text-gray-900">{approval.employeeName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-semibold">{approval.title}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                approval.isChallenge 
                                  ? 'bg-violet-50 text-violet-700 border-violet-200' 
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                {approval.typeLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {approval.proofFile ? (
                                <button
                                  onClick={() => handleDownloadProof(approval.proofFile!)}
                                  className="text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1.5 font-bold text-xs"
                                >
                                  <FolderHeart className="w-3.5 h-3.5" />
                                  {approval.proofFile}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 italic">
                                  <BadgeInfo className="w-3.5 h-3.5 text-gray-300" />
                                  No proof attached
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-gray-700">{approval.pointsEarned} XP</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                approval.approvalStatus === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                approval.approvalStatus === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {approval.approvalStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {approval.approvalStatus === 'Pending' && (
                                <div className="flex items-center justify-end gap-2">
                                  {blockApproval ? (
                                    <button
                                      disabled
                                      onClick={() => handleApprove(approval)}
                                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 border border-gray-100 bg-gray-50 cursor-not-allowed"
                                      title="Approval blocked: Proof attachment required"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleApprove(approval)}
                                      className="w-8 h-8 rounded-full flex items-center justify-center text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors border border-gray-200"
                                      title="Approve Submission"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleReject(approval)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-gray-200"
                                    title="Reject Submission"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {/* ── Diversity & Inclusion Tab (Prompt 11, 12, 13) ───────────── */}
          <TabsContent value="diversity" className="mt-6">
            {!state.settings.hrisIntegrationConnected ? (
              // Empty State Placeholder (Prompt 11)
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-[#be185d]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Diversity Metrics Dashboard</h3>
                <p className="text-gray-500 max-w-md leading-relaxed">Connect your HRIS (Workday, BambooHR) to automatically populate diversity, equity, and inclusion analytics.</p>
                <button 
                  onClick={() => setShowConnectModal(true)}
                  className="mt-8 px-6 py-2.5 bg-[#be185d] hover:bg-rose-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Connect HRIS Integration
                </button>
              </div>
            ) : (
              // Real Diversity Metrics Synced Dashboard (Prompt 12)
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex gap-3 items-center">
                    <Database className="w-6 h-6 text-green-600 shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">Demographic Sync Status</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Connected to {state.settings.hrisProvider} (Last sync: just now)</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      toast({ title: 'Re-syncing data...', description: 'Triggered cron stub sync job.' });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-sync
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Gender Distribution Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[340px]">
                    <h4 className="font-bold text-gray-900 text-sm mb-4">Gender Ratio</h4>
                    <div className="flex-1 min-h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={genderDistribution} 
                            cx="50%" cy="50%" 
                            innerRadius={45} outerRadius={70} 
                            dataKey="value"
                          >
                            {genderDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex gap-4 justify-center text-xs font-semibold">
                      {genderDistribution.map((g) => (
                        <div key={g.name} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                          <span className="text-gray-500">{g.name}: {g.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Age Distribution Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[340px]">
                    <h4 className="font-bold text-gray-900 text-sm mb-4">Age Distribution</h4>
                    <div className="flex-1 min-h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageDistribution}>
                          <XAxis dataKey="name" stroke="transparent" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                          <YAxis hide />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={28} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">Headcount per bracket</p>
                  </div>

                  {/* Ethnic demographics Card */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[340px]">
                    <h4 className="font-bold text-gray-900 text-sm mb-4">Headcount Demographic</h4>
                    <div className="flex-1 overflow-y-auto space-y-4">
                      {ethnicityDemographics.map((eth) => {
                        const total = ethnicityDemographics.reduce((sum, e) => sum + e.count, 0);
                        const pct = total > 0 ? Math.round((eth.count / total) * 100) : 0;
                        return (
                          <div key={eth.label} className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                              <span>{eth.label}</span>
                              <span>{eth.count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#be185d] h-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
