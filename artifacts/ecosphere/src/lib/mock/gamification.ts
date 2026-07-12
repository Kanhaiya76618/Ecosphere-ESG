// LEGACY: the Gamification module now uses the real API (see modules/gamification/data.ts).
// These arrays are kept for reference and for any remaining cross-module usage.

export const CHALLENGES = [
  { id: 'ch-1', title: 'Sustainability Sprint', description: 'Log 5 sustainable actions in a week.', points: 300, status: 'Active' },
  { id: 'ch-2', title: 'Recycle Challenge', description: 'Properly sort and recycle electronic waste.', points: 150, status: 'Under Review' },
  { id: 'ch-3', title: 'Go Green Week', description: 'Use public transport for 5 consecutive days.', points: 500, status: 'Completed' },
  { id: 'ch-4', title: 'Paperless Month', description: 'Zero printing for the entire month.', points: 400, status: 'Draft' },
];

export const BADGES = [
  { id: 'bdg-1', name: 'Eco Warrior', description: 'Completed 10 environmental challenges.', icon: 'Leaf', xp: 1000 },
  { id: 'bdg-2', name: 'Carbon Saver', description: 'Saved 500kg of CO2 emissions.', icon: 'Wind', xp: 2500 },
  { id: 'bdg-3', name: 'CSR Champion', description: 'Participated in 5 CSR activities.', icon: 'Heart', xp: 1500 },
  { id: 'bdg-4', name: 'Green Hero', description: 'Top 3 on leaderboard for a month.', icon: 'Award', xp: 3000 },
];

export const LEADERBOARD = [
  { rank: 1, name: 'Rahul Sharma', department: 'IT', xp: 2500, avatar: 'RS' },
  { rank: 2, name: 'Aman Gupta', department: 'Finance', xp: 2100, avatar: 'AG' },
  { rank: 3, name: 'Priya Patel', department: 'HR', xp: 1800, avatar: 'PP' },
  { rank: 4, name: 'Vikram Singh', department: 'Logistics', xp: 1650, avatar: 'VS' },
  { rank: 5, name: 'Neha Reddy', department: 'Manufacturing', xp: 1420, avatar: 'NR' },
];

export const REWARDS = [
  { id: 'rw-1', name: 'EcoSphere Coffee Mug', pts: 1000, image: 'mug' },
  { id: 'rw-2', name: 'Amazon Voucher ($25)', pts: 3000, image: 'voucher' },
  { id: 'rw-3', name: '1 Extra Paid Leave', pts: 5000, image: 'leave' },
  { id: 'rw-4', name: 'Premium Gym Membership', pts: 8000, image: 'gym' },
];
