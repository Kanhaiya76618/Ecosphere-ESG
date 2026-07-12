import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, BarChart3, PieChart, FileSpreadsheet, Users } from 'lucide-react';

export default function Reports() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const REPORTS = [
    { title: 'Annual ESG Summary (2024)', type: 'PDF', date: 'Jan 15, 2025', size: '2.4 MB' },
    { title: 'Q1 Environmental Emissions', type: 'Excel', date: 'Apr 02, 2025', size: '1.1 MB' },
    { title: 'Diversity & Inclusion Metrics', type: 'PDF', date: 'Mar 10, 2025', size: '3.8 MB' },
    { title: 'Governance Audit Results', type: 'CSV', date: 'Feb 28, 2025', size: '450 KB' },
  ];

  return (
    <AppLayout>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Reports & Analytics</h2>
            <p className="text-zinc-400 text-sm mt-1">Generate, export, and analyze comprehensive ESG reports.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Custom Report Builder */}
          <div className="md:col-span-3 space-y-6">
            <Card className="bg-card border-card-border shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6 border-b border-card-border pb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-teal-500" />
                    Custom Report Builder
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Report Framework</label>
                    <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
                      <option>Global Reporting Initiative (GRI)</option>
                      <option>Sustainability Accounting Standards Board (SASB)</option>
                      <option>Task Force on Climate-related Financial Disclosures (TCFD)</option>
                      <option>Custom Internal Format</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Date Range</label>
                    <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
                      <option>Year to Date (YTD)</option>
                      <option>Last 12 Months</option>
                      <option>Previous Fiscal Year</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Pillar Selection</label>
                    <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
                      <option>All ESG Pillars</option>
                      <option>Environmental Only</option>
                      <option>Social Only</option>
                      <option>Governance Only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Department</label>
                    <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
                      <option>All Departments</option>
                      <option>Manufacturing</option>
                      <option>IT & Operations</option>
                      <option>Logistics</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-card-border">
                  <button className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    Generate Report
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 bg-background border border-border hover:bg-zinc-800 text-white rounded-md text-sm font-medium transition-colors">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 bg-background border border-border hover:bg-zinc-800 text-white rounded-md text-sm font-medium transition-colors">
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 px-1">Quick Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-card border-card-border hover:border-teal-500/50 transition-colors cursor-pointer group">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-white text-sm mb-1">Carbon Footprint Breakdown</h4>
                  <p className="text-xs text-zinc-500">Scope 1, 2 & 3 emissions analysis by region.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-card-border hover:border-teal-500/50 transition-colors cursor-pointer group">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-white text-sm mb-1">Workforce Demographics</h4>
                  <p className="text-xs text-zinc-500">Gender, age, and ethnicity statistics.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-card-border hover:border-teal-500/50 transition-colors cursor-pointer group">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-white text-sm mb-1">Executive Summary</h4>
                  <p className="text-xs text-zinc-500">High-level 1-pager for board meetings.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Exports Sidebar */}
          <div className="md:col-span-1">
            <Card className="bg-card border-card-border h-full">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-white mb-4 border-b border-card-border pb-3">Recent Exports</h3>
                <div className="space-y-4">
                  {REPORTS.map((report, i) => (
                    <motion.div key={i} variants={item} className="group relative pr-8">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                          report.type === 'PDF' ? 'bg-red-500/10 text-red-500' :
                          report.type === 'Excel' ? 'bg-green-500/10 text-green-500' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {report.type}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200 leading-tight group-hover:text-teal-400 transition-colors">{report.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-2 text-sm text-teal-500 hover:text-teal-400 font-medium transition-colors">
                  View All Archives →
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
