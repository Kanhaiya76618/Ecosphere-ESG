// Mock data split per ESG module. Each module's data.ts re-exports its slice;
// swap a module to the real API by editing only that module's data.ts.
export * from './dashboard';
export * from './environmental';
export * from './social';
export * from './governance';
export * from './gamification';
export * from './settings';
