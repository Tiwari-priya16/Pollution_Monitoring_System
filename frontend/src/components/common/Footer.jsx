import React from 'react';
import { Leaf, Mail, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-md">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                EcoWatch <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-forest-900 text-forest-300 font-semibold border border-forest-700">PMS</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A centralized digital governance platform bridging citizens, certified pollution control officers, and civic administrators to monitor, manage, and resolve environmental violations swiftly and transparently.
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-400 pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-forest-500 animate-pulse"></span>
              Environmental Grievance Redressal Architecture (Stage 1 Active)
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/#categories" className="hover:text-forest-400 transition-colors">Pollution Categories</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-forest-400 transition-colors">Reporting Process</a>
              </li>
              <li>
                <a href="/#benefits" className="hover:text-forest-400 transition-colors">Role Responsibilities</a>
              </li>
              <li>
                <a href="/#system-status" className="hover:text-forest-400 transition-colors">System Health Check</a>
              </li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Access Portals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-forest-400 transition-colors flex items-center gap-1">
                  Citizen Portal <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Stage 2</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-forest-400 transition-colors flex items-center gap-1">
                  Officer Inspection Suite <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Stage 2</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-forest-400 transition-colors flex items-center gap-1">
                  Administrator Console <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Stage 2</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Pollution Monitoring System (PMS). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with React, Vite, Node.js & MongoDB for Civic Redressal
          </p>
        </div>
      </div>
    </footer>
  );
}

