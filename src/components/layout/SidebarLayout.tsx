import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../Logo';
import { ShieldCheck, FileSearch, Scale, FileText, Settings } from 'lucide-react';
import './SidebarLayout.css';

interface SidebarLayoutProps {
    children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Logo />
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                        <FileSearch size={20} /> New Audit
                    </NavLink>
                    <NavLink to="/cases" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Scale size={20} /> My Cases
                    </NavLink>
                    <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FileText size={20} /> Reports
                    </NavLink>
                    <div className="spacer"></div>
                    <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Settings size={20} /> Settings
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="security-badge">
                        <ShieldCheck size={16} color="var(--color-teal)" />
                        <span>Local Mode: <strong>Secure</strong></span>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};
