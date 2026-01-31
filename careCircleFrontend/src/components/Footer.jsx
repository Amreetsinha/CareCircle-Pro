import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] pt-16 pb-8 border-t border-[#d2d2d7] text-xs text-[#86868b]">
      <div className="max-w-[980px] mx-auto px-6">

        {/* Top Section */}
        <div className="border-b border-[#d2d2d7] pb-4 mb-4">
          <p className="mb-2">
            <span className="font-semibold text-[#1d1d1f]">CareCircle Pro</span> is a demonstrated platform for connecting families with trusted caregivers.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-[#1d1d1f] mb-2">Shop & Learn</h3>
            <ul className="space-y-2">
              <li><Link to="/find-nanny" className="hover:underline">Find Nanny</Link></li>
              <li><Link to="/register-nanny" className="hover:underline">Become a Caregiver</Link></li>
              <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#1d1d1f] mb-2">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/safety" className="hover:underline">Safety & Trust</Link></li>
              <li><Link to="/background-checks" className="hover:underline">Background Checks</Link></li>
              <li><Link to="/insurance" className="hover:underline">Insurance</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#1d1d1f] mb-2">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:underline">Manage ID</Link></li>
              <li><Link to="/parent-dashboard" className="hover:underline">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#1d1d1f] mb-2">About CareCircle</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:underline">Newsroom</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
              <li><Link to="/investors" className="hover:underline">Investors</Link></li>
              <li><Link to="/ethics" className="hover:underline">Ethics & Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start pt-4 border-t border-[#d2d2d7]">
          <div className="mb-2 md:mb-0">
            <p>Copyright © 2026 CareCircle Inc. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline border-r border-[#d2d2d7] pr-4">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline border-r border-[#d2d2d7] pr-4">Terms of Use</Link>
            <Link to="/sales-policy" className="hover:underline border-r border-[#d2d2d7] pr-4">Sales Policy</Link>
            <Link to="/legal" className="hover:underline">Legal</Link>
          </div>
          <div className="mt-2 md:mt-0 text-[#1d1d1f]">
            India
          </div>
        </div>

      </div>
    </footer>
  );
}
