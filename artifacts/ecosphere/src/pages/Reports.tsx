import { AppLayout } from '@/components/layout/AppLayout';
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
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h2>
            <p className="text-gray-500 text-sm mt-1">Generate, export, and analyze comprehensive ESG reports.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Custom Report Builder */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                      <Filter className="w-4 h-4 text-teal-600" />
                    </div>
                    Custom Report Builder
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">Report Framework</label>
                    <div className="relative">
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none shadow-sm transition-all cursor-pointer hover:bg-gray-100">
                        <option>Global Reporting Initiative (GRI)</option>
                        <option>Sustainability Accounting Standards Board (SASB)</option>
                        <option>Task Force on Climate-related Financial Disclosures (TCFD)</option>
                        <option>Custom Internal Format</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">Date Range</label>
                    <div className="relative">
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none shadow-sm transition-all cursor-pointer hover:bg-gray-100">
                        <option>Year to Date (YTD)</option>
                        <option>Last 12 Months</option>
                        <option>Previous Fiscal Year</option>
                        <option>Custom Range</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">Pillar Selection</label>
                    <div className="relative">
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none shadow-sm transition-all cursor-pointer hover:bg-gray-100">
                        <option>All ESG Pillars</option>
                        <option>Environmental Only</option>
                        <option>Social Only</option>
                        <option>Governance Only</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">Department</label>
                    <div className="relative">
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none shadow-sm transition-all cursor-pointer hover:bg-gray-100">
                        <option>All Departments</option>
                        <option>Manufacturing</option>
                        <option>IT & Operations</option>
                        <option>Logistics</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                  <button className="flex items-center gap-2 px-6 py-3 bg-[#0f766e] hover:bg-teal-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    <BarChart3 className="w-4 h-4" />
                    Generate Report
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mt-8 mb-4 px-1">Quick Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-teal-100 p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PieChart className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">Carbon Footprint</h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">Scope 1, 2 & 3 emissions analysis by region.</p>
              </div>
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-teal-100 p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">Demographics</h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">Gender, age, and ethnicity workforce statistics.</p>
              </div>
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-teal-100 p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">Executive Summary</h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">High-level 1-pager tailored for board meetings.</p>
              </div>
            </div>
          </div>

          {/* Recent Exports Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-full p-6">
              <h3 className="text-base font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Recent Exports</h3>
              <div className="space-y-5">
                {REPORTS.map((report, i) => (
                  <motion.div key={i} variants={item} className="group relative pr-8">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border ${
                        report.type === 'PDF' ? 'bg-red-50 text-red-600 border-red-100' :
                        report.type === 'Excel' ? 'bg-green-50 text-green-600 border-green-100' :
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {report.type}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 leading-tight group-hover:text-teal-600 transition-colors mb-1">{report.title}</p>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                          <span>{report.date}</span>
                          <span className="text-gray-300">•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-8 py-3 bg-gray-50 hover:bg-gray-100 text-sm text-teal-700 font-bold transition-colors rounded-xl border border-gray-100">
                View All Archives
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}