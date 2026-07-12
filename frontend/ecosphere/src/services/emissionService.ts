// ─────────────────────────────────────────────────────────────────────────────
// EcoSphere — Emission Service
// Pure, side-effect-free functions for emission calculations and status logic.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CarbonTransaction,
  EmissionFactor,
  TransactionStatus,
} from '@/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Returns the number of calendar days between today and a future deadline.
 *  Negative values mean the deadline has already passed. */
function daysUntil(deadline: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  return Math.round((dl.getTime() - now.getTime()) / MS_PER_DAY);
}

// ── Status Calculation ────────────────────────────────────────────────────────

/**
 * Determines the compliance status of a CarbonTransaction.
 *
 * Rules:
 *  • "Overdue"   — progress ≥ 100 %  OR  deadline has already passed
 *  • "At Risk"   — progress ≥ 90 %  AND  deadline is within the next 30 days
 *  • "On Track"  — everything else (progress < 90 %)
 *
 * @param current   Quantity of emissions already recorded (kg CO2e or tCO2e)
 * @param limit     Allowed emission limit in the same unit
 * @param deadline  ISO 8601 date string, e.g. "2026-12-31"
 * @returns         TransactionStatus
 */
export function calculateTransactionStatus(
  current: number,
  limit: number,
  deadline: string,
): TransactionStatus {
  const progress = limit > 0 ? (current / limit) * 100 : 0;
  const days = daysUntil(deadline);

  if (progress >= 100 || days < 0) return 'Overdue';
  if (progress >= 90 && days <= 30) return 'At Risk';
  return 'On Track';
}

// ── tCO2e Calculation ─────────────────────────────────────────────────────────

/**
 * Converts a raw quantity into metric tons of CO2 equivalent (tCO2e).
 *
 * Formula:  (quantity × co2eFactor) / 1000
 *
 * The division by 1000 converts kg CO2e → tCO2e.
 *
 * @param quantity       Amount consumed (e.g. litres, kWh, m³)
 * @param emissionFactor The matching EmissionFactor record
 * @returns              tCO2e, rounded to 3 decimal places
 */
export function calculateTCO2e(
  quantity: number,
  emissionFactor: Pick<EmissionFactor, 'co2eFactor'>,
): number {
  return Math.round(((quantity * emissionFactor.co2eFactor) / 1000) * 1000) / 1000;
}

// ── Progress ──────────────────────────────────────────────────────────────────

/**
 * Returns progress percentage (current / limit × 100), capped at 2 decimal places.
 * Safe: returns 0 when limit is 0.
 */
export function calculateProgress(current: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.round((current / limit) * 10000) / 100;
}

// ── Source record types ───────────────────────────────────────────────────────

/** A generic source activity record (Purchase, Manufacturing, Expense, Fleet) */
export interface SourceRecord {
  id: string;
  sourceType: 'Purchase' | 'Manufacturing' | 'Expense' | 'Fleet';
  fuelTypeId: string;        // FK → EmissionFactor.id
  departmentId: string;      // FK → Department.id
  departmentName: string;    // Display label
  quantity: number;          // In the emission factor's unit
  date: string;              // ISO date
}

// ── Auto-generation ───────────────────────────────────────────────────────────

/**
 * When "Auto Emission Calculation" is enabled in Settings, this function
 * converts raw source activity records into CarbonTransaction objects.
 *
 * Each transaction is stamped with sourceType = "Auto-calculated" and
 * receives a status determined by calculateTransactionStatus().
 *
 * @param sourceRecords   Activity records from Purchase / Mfg / Expense / Fleet
 * @param emissionFactors All available EmissionFactor records
 * @param defaultLimit    Default emission limit (kg CO2e) applied when the source has none
 * @param defaultDeadline ISO date used as the deadline when the source has none
 * @returns               Array of CarbonTransaction objects (not yet persisted)
 */
export function autoGenerateTransactions(
  sourceRecords: SourceRecord[],
  emissionFactors: EmissionFactor[],
  defaultLimit = 10000,
  defaultDeadline = `${new Date().getFullYear()}-12-31`,
): Omit<CarbonTransaction, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>[] {
  const factorMap = new Map(emissionFactors.map((ef) => [ef.id, ef]));
  const now = new Date().toISOString().slice(0, 10);

  return sourceRecords
    .map((record) => {
      const factor = factorMap.get(record.fuelTypeId);
      if (!factor) return null; // skip unknown fuel types

      const calculatedTCO2e = calculateTCO2e(record.quantity, factor);
      // Convert tCO2e → kg for progress comparison (limit is in kg)
      const currentKg = calculatedTCO2e * 1000;
      const progress = calculateProgress(currentKg, defaultLimit);
      const status = calculateTransactionStatus(currentKg, defaultLimit, defaultDeadline);

      return {
        fuelTypeId: factor.id,
        fuelType: factor.fuelType,
        departmentId: record.departmentId,
        department: record.departmentName,
        quantity: record.quantity,
        calculatedTCO2e,
        limit: defaultLimit,
        deadline: defaultDeadline,
        status,
        sourceType: 'Auto-calculated' as const,
        progress,
      };
    })
    .filter(Boolean) as Omit<
    CarbonTransaction,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  >[];
}

// ── Export Utilities ──────────────────────────────────────────────────────────

export function exportToCSV(transactions: CarbonTransaction[]) {
  const headers = ['Transaction ID', 'Fuel Type', 'Department', 'Quantity', 'tCO2e', 'Limit (kg)', 'Deadline', 'Source Type', 'Status'];
  const rows = transactions.map(tx => [
    tx.id.toUpperCase(),
    tx.fuelType,
    tx.department,
    tx.quantity,
    tx.calculatedTCO2e,
    tx.limit,
    tx.deadline,
    tx.sourceType,
    tx.status
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `carbon_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(
  transactions: CarbonTransaction[],
  filters: { department?: string; fuelType?: string; status?: string; startDate?: string; endDate?: string }
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const filterMeta = [
    `<strong>Department:</strong> ${filters.department || 'All'}`,
    `<strong>Fuel Type:</strong> ${filters.fuelType || 'All'}`,
    `<strong>Status:</strong> ${filters.status || 'All'}`,
    `<strong>Date Range:</strong> ${filters.startDate || 'Beginning'} to ${filters.endDate || 'Present'}`
  ].join(' | ');

  const html = `
    <html>
      <head>
        <title>EcoSphere ESG Report - Carbon Transactions Log</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #166534; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #111; }
          .metadata { font-size: 12px; color: #666; margin-bottom: 20px; }
          .filters { background-color: #f6f8f4; border: 1px solid #e8ede6; padding: 15px; border-radius: 8px; font-size: 13px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #166534; color: white; text-align: left; padding: 10px; font-size: 12px; text-transform: uppercase; }
          td { padding: 10px; border-bottom: 1px solid #e8ede6; font-size: 13px; }
          .status { font-weight: bold; }
          .status-on-track { color: #16a34a; }
          .status-at-risk { color: #d97706; }
          .status-overdue { color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">EcoSphere ESG Carbon Report</div>
            <div class="metadata">Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          </div>
          <div style="text-align: right; color: #166534; font-weight: bold;">EcoSphere ESG Platform</div>
        </div>
        
        <div class="filters">
          <strong>Report Filters Applied:</strong><br/>
          ${filterMeta}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fuel Type</th>
              <th>Department</th>
              <th>Quantity</th>
              <th>Emissions (tCO2e)</th>
              <th>Limit (kg)</th>
              <th>Deadline</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(tx => `
              <tr>
                <td style="font-family: monospace;">${tx.id.toUpperCase()}</td>
                <td>${tx.fuelType}</td>
                <td>${tx.department}</td>
                <td>${tx.quantity}</td>
                <td>${tx.calculatedTCO2e.toFixed(3)}</td>
                <td>${tx.limit}</td>
                <td>${tx.deadline}</td>
                <td>${tx.sourceType}</td>
                <td>
                  <span class="status status-${tx.status.toLowerCase().replace(' ', '-')}">${tx.status}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

