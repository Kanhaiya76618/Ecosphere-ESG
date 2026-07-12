export const DEPARTMENTS = [
  { id: 'dept-it', name: 'IT', code: 'IT', head: 'Rajesh Kumar', parentDept: '-', employees: 45, status: 'Active', score: 80 },
  { id: 'dept-hr', name: 'HR', code: 'HR', head: 'Anita Desai', parentDept: '-', employees: 32, status: 'Active', score: 90 },
  { id: 'dept-fin', name: 'Finance', code: 'FIN', head: 'Vikram Mehta', parentDept: '-', employees: 28, status: 'Active', score: 85 },
  { id: 'dept-log', name: 'Logistics', code: 'LOG', head: 'Sunil Singh', parentDept: '-', employees: 71, status: 'Active', score: 75 },
  { id: 'dept-mfg', name: 'Manufacturing', code: 'MFG', head: 'Arjun Reddy', parentDept: '-', employees: 120, status: 'Active', score: 70 },
];

export const EMISSION_FACTORS = [
  { id: 'ef-1', name: 'Diesel', value: 2.68, unit: 'kg CO2/L' },
  { id: 'ef-2', name: 'Petrol', value: 2.31, unit: 'kg CO2/L' },
  { id: 'ef-3', name: 'Electricity', value: 0.82, unit: 'kg CO2/kWh' },
  { id: 'ef-4', name: 'Natural Gas', value: 2.04, unit: 'kg CO2/m3' },
];

export const CARBON_TRANSACTIONS = [
  { id: 'tx-1', fuelType: 'Electricity', department: 'Manufacturing', target: 12000, current: 8500, progress: 70.8, deadline: '2025-12-31', status: 'On Track' },
  { id: 'tx-2', fuelType: 'Diesel', department: 'Logistics', target: 5000, current: 4800, progress: 96, deadline: '2025-08-15', status: 'At Risk' },
  { id: 'tx-3', fuelType: 'Petrol', department: 'Sales', target: 3000, current: 3100, progress: 103.3, deadline: '2025-06-30', status: 'Overdue' },
  { id: 'tx-4', fuelType: 'Electricity', department: 'IT', target: 4500, current: 2100, progress: 46.6, deadline: '2025-12-31', status: 'On Track' },
  { id: 'tx-5', fuelType: 'Natural Gas', department: 'Manufacturing', target: 8000, current: 3200, progress: 40, deadline: '2025-12-31', status: 'On Track' },
];

export const SUSTAINABILITY_GOALS = [
  { id: 'sg-1', title: 'Reduce Scope 2 Emissions by 15%', current: 5000, target: 4200, unit: 'kg CO2', progress: 84 },
  { id: 'sg-2', title: 'Transition Logistics to EVs', current: 15, target: 50, unit: 'Vehicles', progress: 30 },
  { id: 'sg-3', title: 'Zero Waste to Landfill', current: 60, target: 100, unit: '% Diverted', progress: 60 },
];

export const CSR_ACTIVITIES = [
  { id: 'csr-1', title: 'Tree Plantation Drive', participants: 45, points: 200, status: 'Upcoming', date: '2025-07-20' },
  { id: 'csr-2', title: 'Blood Donation Camp', participants: 28, points: 150, status: 'Completed', date: '2025-05-15' },
  { id: 'csr-3', title: 'Beach Cleanup', participants: 67, points: 250, status: 'Active', date: '2025-06-25' },
  { id: 'csr-4', title: 'Corporate Sustainability Workshop', participants: 34, points: 100, status: 'Upcoming', date: '2025-08-05' },
];

export const EMPLOYEE_APPROVALS = [
  { id: 'ea-1', employee: 'Sanya Mirza', challenge: 'Car-Free Week', proof: 'transit-pass.jpg', points: 150, status: 'Pending' },
  { id: 'ea-2', employee: 'Rahul Sharma', challenge: 'Zero Waste Lunch', proof: 'lunchbox.jpg', points: 50, status: 'Pending' },
  { id: 'ea-3', employee: 'Priya Patel', challenge: 'Tree Plantation', proof: 'planting.jpg', points: 200, status: 'Approved' },
  { id: 'ea-4', employee: 'Vikram Singh', challenge: 'Beach Cleanup', proof: 'cleanup.jpg', points: 250, status: 'Rejected' },
];

export const POLICIES = [
  { id: 'pol-1', title: 'Anti-Bribery and Corruption', version: 'v2.1', updated: '2025-01-15', acceptance: 94, status: 'Active' },
  { id: 'pol-2', title: 'Data Privacy & Protection', version: 'v3.0', updated: '2025-03-10', acceptance: 88, status: 'Active' },
  { id: 'pol-3', title: 'Diversity & Inclusion', version: 'v1.4', updated: '2024-11-05', acceptance: 100, status: 'Active' },
  { id: 'pol-4', title: 'Vendor Code of Conduct', version: 'v1.0', updated: '2025-05-20', acceptance: 45, status: 'Review' },
];

export const AUDITS = [
  { id: 'aud-1', title: 'Annual ESG Audit', date: '2025-06-01', auditor: 'Deloitte', status: 'Completed', score: 'A-' },
  { id: 'aud-2', title: 'Fire Safety Audit', date: '2025-07-15', auditor: 'Internal', status: 'In Progress', score: '-' },
  { id: 'aud-3', title: 'Data Privacy Audit', date: '2025-08-10', auditor: 'KPMG', status: 'Pending', score: '-' },
];

export const COMPLIANCE_ISSUES = [
  { id: 'ci-1', title: 'Fire Extinguisher Missing in Zone B', severity: 'High', department: 'Facilities', dueDate: '2025-07-20', status: 'Open' },
  { id: 'ci-2', title: 'Lab waste disposal non-compliant', severity: 'Medium', department: 'Manufacturing', dueDate: '2025-06-15', status: 'Resolved' },
  { id: 'ci-3', title: 'Incomplete vendor screening', severity: 'Low', department: 'Procurement', dueDate: '2025-08-01', status: 'In Progress' },
];

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

export const DASHBOARD_TREND = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 74 },
  { month: 'Mar', score: 75 },
  { month: 'Apr', score: 74 },
  { month: 'May', score: 76 },
  { month: 'Jun', score: 78 },
  { month: 'Jul', score: 79 },
  { month: 'Aug', score: 81 },
  { month: 'Sep', score: 80 },
  { month: 'Oct', score: 82 },
  { month: 'Nov', score: 81 },
  { month: 'Dec', score: 81 },
];
