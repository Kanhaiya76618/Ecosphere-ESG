import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  api,
  type Challenge,
  type ChallengeStatus,
  type Participation,
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Award,
  Gift,
  Trophy,
  Star,
  Zap,
  Plus,
  Check,
  X,
  Lock,
  Building2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_COLUMNS: { key: ChallengeStatus; label: string }[] = [
  { key: 'draft', label: 'Draft' },
  { key: 'active', label: 'Active' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'completed', label: 'Completed' },
];

const NEXT_ACTION: Partial<
  Record<ChallengeStatus, { to: ChallengeStatus; label: string }>
> = {
  draft: { to: 'active', label: 'Activate' },
  active: { to: 'under_review', label: 'Send to Review' },
  under_review: { to: 'completed', label: 'Mark Completed' },
};

const tabTriggerClass =
  'rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#7c3aed] data-[state=active]:shadow-sm transition-all';

export default function Gamification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees,
  });
  const employees = employeesQuery.data ?? [];
  // Default to the first employee once loaded ("viewing as").
  const currentEmployeeId = employeeId ?? employees[0]?.id ?? null;

  const summaryQuery = useQuery({
    queryKey: ['summary', currentEmployeeId],
    queryFn: () => api.employeeSummary(currentEmployeeId!),
    enabled: currentEmployeeId != null,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['challenges'] });
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    queryClient.invalidateQueries({ queryKey: ['badges'] });
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
    queryClient.invalidateQueries({ queryKey: ['summary'] });
  };

  const onError = (err: unknown) =>
    toast({
      title: 'Something went wrong',
      description: err instanceof Error ? err.message : String(err),
      variant: 'destructive',
    });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <AppLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Gamification & Rewards
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Engage employees with challenges, leaderboards, and rewards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={currentEmployeeId ? String(currentEmployeeId) : undefined}
              onValueChange={(v) => setEmployeeId(Number(v))}
            >
              <SelectTrigger className="w-[190px] bg-white" data-testid="employee-select">
                <SelectValue placeholder="Viewing as..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.name} · {e.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 bg-violet-50 px-5 py-2.5 rounded-full border border-violet-200 shadow-sm whitespace-nowrap">
              <Zap className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-bold text-violet-800" data-testid="xp-balance">
                {summaryQuery.isLoading || summaryQuery.data == null
                  ? '…'
                  : `${summaryQuery.data.balance.toLocaleString()} XP`}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="challenges" className="w-full mt-8">
          <TabsList className="bg-gray-100 rounded-xl p-1 inline-flex">
            <TabsTrigger value="challenges" className={tabTriggerClass}>
              Challenges
            </TabsTrigger>
            <TabsTrigger value="approvals" className={tabTriggerClass}>
              Approvals
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className={tabTriggerClass}>
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="badges" className={tabTriggerClass}>
              Badges
            </TabsTrigger>
            <TabsTrigger value="rewards" className={tabTriggerClass}>
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="mt-6">
            <ChallengesBoard
              currentEmployeeId={currentEmployeeId}
              onError={onError}
              invalidateAll={invalidateAll}
            />
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <ApprovalsQueue onError={onError} invalidateAll={invalidateAll} />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <LeaderboardView />
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <BadgeGallery currentEmployeeId={currentEmployeeId} />
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <RewardsCatalog
              currentEmployeeId={currentEmployeeId}
              balance={summaryQuery.data?.balance ?? 0}
              onError={onError}
              invalidateAll={invalidateAll}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}

// ---------- Challenges board ----------

function ChallengesBoard({
  currentEmployeeId,
  onError,
  invalidateAll,
}: {
  currentEmployeeId: number | null;
  onError: (err: unknown) => void;
  invalidateAll: () => void;
}) {
  const { toast } = useToast();
  const challengesQuery = useQuery({
    queryKey: ['challenges'],
    queryFn: api.challenges,
  });

  const transition = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ChallengeStatus }) =>
      api.transitionChallenge(id, status),
    onSuccess: (c) => {
      toast({ title: `Challenge moved to "${c.status.replace('_', ' ')}"` });
      invalidateAll();
    },
    onError,
  });

  const join = useMutation({
    mutationFn: (challengeId: number) =>
      api.joinChallenge(challengeId, currentEmployeeId!),
    onSuccess: () => {
      toast({ title: 'Joined the challenge!' });
      invalidateAll();
    },
    onError,
  });

  if (challengesQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATUS_COLUMNS.map((c) => (
          <Skeleton key={c.key} className="h-[400px] rounded-[16px]" />
        ))}
      </div>
    );
  }
  if (challengesQuery.isError) {
    return (
      <ErrorPanel
        message={(challengesQuery.error as Error).message}
        onRetry={() => challengesQuery.refetch()}
      />
    );
  }

  const challenges = challengesQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateChallengeDialog onError={onError} invalidateAll={invalidateAll} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {STATUS_COLUMNS.map((column) => {
          const cards = challenges.filter((c) => c.status === column.key);
          return (
            <div
              key={column.key}
              className="bg-gray-50/80 rounded-[16px] p-4 border border-gray-100 min-h-[400px]"
            >
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-4 px-1 flex justify-between items-center">
                {column.label}
                <span className="bg-white text-gray-500 px-2 py-0.5 rounded-full text-[10px] shadow-sm border border-gray-100">
                  {cards.length}
                </span>
              </h3>
              <div className="space-y-3">
                {cards.length === 0 && (
                  <p className="text-xs text-gray-400 text-center pt-8">
                    No {column.label.toLowerCase()} challenges.
                  </p>
                )}
                {cards.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    currentEmployeeId={currentEmployeeId}
                    onTransition={(status) =>
                      transition.mutate({ id: challenge.id, status })
                    }
                    onJoin={() => join.mutate(challenge.id)}
                    busy={transition.isPending || join.isPending}
                    onError={onError}
                    invalidateAll={invalidateAll}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChallengeCard({
  challenge,
  currentEmployeeId,
  onTransition,
  onJoin,
  busy,
  onError,
  invalidateAll,
}: {
  challenge: Challenge;
  currentEmployeeId: number | null;
  onTransition: (status: ChallengeStatus) => void;
  onJoin: () => void;
  busy: boolean;
  onError: (err: unknown) => void;
  invalidateAll: () => void;
}) {
  const mine = challenge.participations.find(
    (p) => p.employeeId === currentEmployeeId,
  );
  const next = NEXT_ACTION[challenge.status];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-violet-200 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-900 text-sm leading-tight pr-2">
          {challenge.title}
        </h4>
        <span className="flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100 shrink-0">
          <Star className="w-3 h-3" /> {challenge.xp}
        </span>
      </div>
      <p className="text-xs font-medium text-gray-500 leading-relaxed mb-3">
        {challenge.description}
      </p>
      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
        <span>{challenge.difficulty}</span>
        <span>
          {challenge.participations.length}{' '}
          {challenge.participations.length === 1 ? 'participant' : 'participants'}
        </span>
      </div>

      {challenge.status === 'active' && currentEmployeeId != null && !mine && (
        <Button
          size="sm"
          className="w-full mb-2 bg-[#7c3aed] hover:bg-[#6d28d9]"
          disabled={busy}
          onClick={onJoin}
          data-testid={`join-${challenge.id}`}
        >
          Join Challenge
        </Button>
      )}
      {mine && (
        <MyParticipation
          participation={mine}
          challengeStatus={challenge.status}
          onError={onError}
          invalidateAll={invalidateAll}
        />
      )}

      <div className="pt-2 border-t border-gray-100 flex gap-2">
        {next && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            disabled={busy}
            onClick={() => onTransition(next.to)}
            data-testid={`transition-${challenge.id}`}
          >
            {next.label}
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-gray-400 hover:text-red-500"
          disabled={busy}
          onClick={() => onTransition('archived')}
        >
          Archive
        </Button>
      </div>
    </div>
  );
}

function MyParticipation({
  participation,
  challengeStatus,
  onError,
  invalidateAll,
}: {
  participation: Participation;
  challengeStatus: ChallengeStatus;
  onError: (err: unknown) => void;
  invalidateAll: () => void;
}) {
  const { toast } = useToast();
  const [progress, setProgress] = useState(String(participation.progress));
  const [proof, setProof] = useState(participation.proof ?? '');

  const update = useMutation({
    mutationFn: () =>
      api.updateParticipation(participation.id, {
        progress: Number(progress),
        proof: proof || undefined,
      }),
    onSuccess: () => {
      toast({ title: 'Progress updated' });
      invalidateAll();
    },
    onError,
  });

  const statusColors = {
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    approved: 'text-green-600 bg-green-50 border-green-200',
    rejected: 'text-red-600 bg-red-50 border-red-200',
  } as const;

  return (
    <div className="mb-2 rounded-lg bg-violet-50/50 border border-violet-100 p-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">
          My participation
        </span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusColors[participation.approvalStatus]}`}
        >
          {participation.approvalStatus}
          {participation.approvalStatus === 'approved' &&
            ` · +${participation.xpAwarded} XP`}
        </span>
      </div>
      {participation.approvalStatus === 'pending' &&
        (challengeStatus === 'active' || challengeStatus === 'under_review') && (
          <>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="h-7 text-xs bg-white"
                placeholder="Progress %"
              />
              <Input
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                className="h-7 text-xs bg-white"
                placeholder="Proof URL / filename"
                data-testid={`proof-${participation.id}`}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-7 text-xs"
              disabled={update.isPending}
              onClick={() => update.mutate()}
            >
              {update.isPending ? 'Saving…' : 'Submit Progress'}
            </Button>
          </>
        )}
    </div>
  );
}

function CreateChallengeDialog({
  onError,
  invalidateAll,
}: {
  onError: (err: unknown) => void;
  invalidateAll: () => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'environmental',
    description: '',
    xp: '200',
    difficulty: 'medium',
    evidenceRequired: 'photo',
  });

  const create = useMutation({
    mutationFn: () =>
      api.createChallenge({
        ...form,
        xp: Number(form.xp),
      }),
    onSuccess: (c) => {
      toast({ title: `Challenge "${c.title}" created as draft` });
      setOpen(false);
      setForm({ ...form, title: '', description: '' });
      invalidateAll();
    },
    onError,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7c3aed] hover:bg-[#6d28d9]" data-testid="new-challenge">
          <Plus className="w-4 h-4 mr-1" /> New Challenge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Challenge</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Bike to Work Week"
              data-testid="challenge-title"
            />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What do employees need to do?"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">XP</Label>
              <Input
                type="number"
                value={form.xp}
                onChange={(e) => setForm({ ...form, xp: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Difficulty</Label>
              <Select
                value={form.difficulty}
                onValueChange={(v) => setForm({ ...form, difficulty: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9]"
            disabled={!form.title || !Number(form.xp) || create.isPending}
            onClick={() => create.mutate()}
            data-testid="create-challenge-submit"
          >
            {create.isPending ? 'Creating…' : 'Create Draft'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Approvals queue ----------

function ApprovalsQueue({
  onError,
  invalidateAll,
}: {
  onError: (err: unknown) => void;
  invalidateAll: () => void;
}) {
  const { toast } = useToast();
  const challengesQuery = useQuery({
    queryKey: ['challenges'],
    queryFn: api.challenges,
  });

  const review = useMutation({
    mutationFn: ({
      id,
      decision,
    }: {
      id: number;
      decision: 'approved' | 'rejected';
    }) => api.reviewParticipation(id, decision),
    onSuccess: (result) => {
      const badgeNote =
        result.newBadges.length > 0
          ? ` — badge unlocked: ${result.newBadges.map((b) => b.name).join(', ')}! 🏅`
          : '';
      toast({
        title:
          result.participation.approvalStatus === 'approved'
            ? `Approved: +${result.xpAwarded} XP awarded${badgeNote}`
            : 'Participation rejected',
      });
      invalidateAll();
    },
    onError,
  });

  if (challengesQuery.isLoading)
    return <Skeleton className="h-64 rounded-[14px]" />;
  if (challengesQuery.isError)
    return (
      <ErrorPanel
        message={(challengesQuery.error as Error).message}
        onRetry={() => challengesQuery.refetch()}
      />
    );

  const pending = (challengesQuery.data ?? []).flatMap((c) =>
    c.participations
      .filter((p) => p.approvalStatus === 'pending')
      .map((p) => ({ ...p, challenge: c })),
  );

  if (pending.length === 0) {
    return (
      <div className="bg-white rounded-[14px] border border-gray-100 p-12 text-center">
        <Check className="w-10 h-10 text-green-400 mx-auto mb-3" />
        <p className="font-bold text-gray-700">All caught up</p>
        <p className="text-sm text-gray-400 mt-1">
          No participations waiting for review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Challenge</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Proof</th>
              <th className="px-6 py-4">XP</th>
              <th className="px-6 py-4 text-right">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pending.map((p) => (
              <tr key={p.id} className="hover:bg-violet-50/30">
                <td className="px-6 py-4 font-bold text-gray-900">
                  {p.employeeName}
                </td>
                <td className="px-6 py-4 text-gray-500">{p.challenge.title}</td>
                <td className="px-6 py-4 text-gray-500">{p.progress}%</td>
                <td className="px-6 py-4">
                  {p.proof ? (
                    <span className="font-mono text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded border border-violet-100">
                      {p.proof}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">no proof</span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-violet-600">
                  {p.challenge.xp}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 h-8"
                      disabled={review.isPending}
                      onClick={() =>
                        review.mutate({ id: p.id, decision: 'approved' })
                      }
                      data-testid={`approve-${p.id}`}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50 h-8"
                      disabled={review.isPending}
                      onClick={() =>
                        review.mutate({ id: p.id, decision: 'rejected' })
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Leaderboard ----------

function LeaderboardView() {
  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: api.leaderboard,
  });

  if (leaderboardQuery.isLoading)
    return <Skeleton className="h-96 rounded-[14px]" />;
  if (leaderboardQuery.isError)
    return (
      <ErrorPanel
        message={(leaderboardQuery.error as Error).message}
        onRetry={() => leaderboardQuery.refetch()}
      />
    );

  const { employees, departments } = leaderboardQuery.data!;
  const rankBubble = (rank: number) =>
    rank === 1 ? (
      <span className="inline-flex w-8 h-8 rounded-full bg-amber-100 text-amber-600 items-center justify-center font-bold border border-amber-200 shadow-sm">
        1
      </span>
    ) : rank === 2 ? (
      <span className="inline-flex w-8 h-8 rounded-full bg-gray-100 text-gray-500 items-center justify-center font-bold border border-gray-200 shadow-sm">
        2
      </span>
    ) : rank === 3 ? (
      <span className="inline-flex w-8 h-8 rounded-full bg-orange-100 text-orange-700 items-center justify-center font-bold border border-orange-200 shadow-sm">
        3
      </span>
    ) : (
      <span className="text-gray-400 font-bold">{rank}</span>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-violet-50 to-purple-50 flex items-end p-6 border-b border-violet-100 relative overflow-hidden">
          <Trophy className="absolute right-8 -bottom-10 w-40 h-40 text-violet-500/10" />
          <h3 className="text-xl font-bold text-violet-900 relative z-10">
            Employee Leaderboard
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-20 text-center">Rank</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                    No employees yet.
                  </td>
                </tr>
              )}
              {employees.map((user) => (
                <tr key={user.id} className="hover:bg-violet-50/30 bg-white">
                  <td className="px-6 py-4 text-center">{rankBubble(user.rank)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                          user.rank <= 3
                            ? 'bg-violet-100 text-violet-700 border-violet-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {user.name
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <span className="font-bold text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-lg border border-violet-100">
                      {user.xp.toLocaleString()} XP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-violet-600" />
          <h3 className="font-bold text-gray-900">Department Leaderboard</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {departments.map((d) => (
            <div key={d.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {rankBubble(d.rank)}
                <div>
                  <p className="font-bold text-gray-900 text-sm">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.members} members</p>
                </div>
              </div>
              <span className="font-mono font-bold text-violet-600 text-sm">
                {d.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Badges ----------

function BadgeGallery({ currentEmployeeId }: { currentEmployeeId: number | null }) {
  const badgesQuery = useQuery({ queryKey: ['badges'], queryFn: api.badges });
  const summaryQuery = useQuery({
    queryKey: ['summary', currentEmployeeId],
    queryFn: () => api.employeeSummary(currentEmployeeId!),
    enabled: currentEmployeeId != null,
  });

  if (badgesQuery.isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-64 rounded-[14px]" />
        ))}
      </div>
    );
  if (badgesQuery.isError)
    return (
      <ErrorPanel
        message={(badgesQuery.error as Error).message}
        onRetry={() => badgesQuery.refetch()}
      />
    );

  const badges = badgesQuery.data ?? [];
  const earnedIds = new Set(summaryQuery.data?.badgeIds ?? []);

  if (badges.length === 0) {
    return (
      <div className="bg-white rounded-[14px] border border-gray-100 p-12 text-center text-gray-400">
        No badges configured yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {badges.map((badge) => {
        const earned = earnedIds.has(badge.id);
        return (
          <div
            key={badge.id}
            className={`bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-8 text-center transition-transform duration-300 border ${
              earned
                ? 'border-violet-200 hover:-translate-y-1'
                : 'border-transparent opacity-60'
            }`}
            data-testid={`badge-${badge.id}`}
          >
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 shadow-sm border ${
                earned
                  ? 'bg-violet-50 border-violet-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {earned ? (
                <Award className="w-10 h-10 text-violet-600" />
              ) : (
                <Lock className="w-8 h-8 text-gray-300" />
              )}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{badge.name}</h3>
            <p className="text-xs font-medium text-gray-500 mb-4 leading-relaxed">
              {badge.description}
            </p>
            <div className="inline-flex px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-mono font-semibold text-gray-500 border border-gray-100">
              {badge.unlockRule.type === 'xp_total'
                ? `Unlocks at ${badge.unlockRule.threshold.toLocaleString()} XP`
                : `Complete ${badge.unlockRule.count} challenges`}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-wider font-semibold">
              {earned
                ? 'Earned ✓'
                : `${badge.earnedBy.length} ${badge.earnedBy.length === 1 ? 'employee has' : 'employees have'} this`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Rewards ----------

function RewardsCatalog({
  currentEmployeeId,
  balance,
  onError,
  invalidateAll,
}: {
  currentEmployeeId: number | null;
  balance: number;
  onError: (err: unknown) => void;
  invalidateAll: () => void;
}) {
  const { toast } = useToast();
  const rewardsQuery = useQuery({ queryKey: ['rewards'], queryFn: api.rewards });

  const redeem = useMutation({
    mutationFn: (rewardId: number) =>
      api.redeemReward(rewardId, currentEmployeeId!),
    onSuccess: (result) => {
      toast({
        title: `Redeemed! New balance: ${result.newBalance.toLocaleString()} XP`,
      });
      invalidateAll();
    },
    onError,
  });

  if (rewardsQuery.isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-72 rounded-[14px]" />
        ))}
      </div>
    );
  if (rewardsQuery.isError)
    return (
      <ErrorPanel
        message={(rewardsQuery.error as Error).message}
        onRetry={() => rewardsQuery.refetch()}
      />
    );

  const rewards = rewardsQuery.data ?? [];
  if (rewards.length === 0) {
    return (
      <div className="bg-white rounded-[14px] border border-gray-100 p-12 text-center text-gray-400">
        No rewards in the catalog yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {rewards.map((reward) => {
        const outOfStock = reward.stock <= 0;
        const cantAfford = balance < reward.pointsRequired;
        return (
          <div
            key={reward.id}
            className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full hover:border-violet-200 transition-colors border border-transparent"
          >
            <div className="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative">
              <Gift className="w-12 h-12 text-gray-300" />
              <span
                className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  outOfStock
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-green-50 text-green-600 border-green-200'
                }`}
              >
                {outOfStock ? 'Out of stock' : `${reward.stock} left`}
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-900 mb-1 leading-tight">
                {reward.name}
              </h3>
              <p className="text-xs text-gray-400 mb-2">{reward.description}</p>
              <div className="text-violet-600 font-mono font-bold text-sm mb-5">
                {reward.pointsRequired.toLocaleString()} Points
              </div>
              <Button
                className="mt-auto w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-200 disabled:text-gray-400"
                disabled={
                  outOfStock ||
                  cantAfford ||
                  redeem.isPending ||
                  currentEmployeeId == null
                }
                onClick={() => redeem.mutate(reward.id)}
                data-testid={`redeem-${reward.id}`}
              >
                {outOfStock
                  ? 'Out of Stock'
                  : cantAfford
                    ? 'Not Enough Points'
                    : redeem.isPending
                      ? 'Redeeming…'
                      : 'Redeem Reward'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- shared ----------

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-[14px] p-8 text-center">
      <p className="font-bold text-red-600 mb-1">Failed to load</p>
      <p className="text-sm text-red-400 mb-4">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
