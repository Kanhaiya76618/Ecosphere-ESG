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
