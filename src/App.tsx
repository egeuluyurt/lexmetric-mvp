import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { IngestView } from '@/views/IngestView';
import { MyCasesView } from '@/views/MyCasesView';
import { SettingsView } from '@/views/SettingsView';
import { LandingView } from '@/views/LandingView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingView />} />

        {/* Protected Dashboard Routes (Wrapped in SidebarLayout) */}
        <Route path="/dashboard" element={
          <SidebarLayout>
            <IngestView key="new" />
          </SidebarLayout>
        } />

        <Route path="/audit/:id" element={
          <SidebarLayout>
            <IngestView />
          </SidebarLayout>
        } />

        <Route path="/cases" element={
          <SidebarLayout>
            <MyCasesView />
          </SidebarLayout>
        } />

        <Route path="/settings" element={
          <SidebarLayout>
            <SettingsView />
          </SidebarLayout>
        } />

        {/* Redirect /reports to Dashboard for now as per MVP flow */}
        <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
