import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SettingsView: React.FC = () => {
    const [divisor, setDivisor] = useState<string>('10438'); // Default FL
    const [defaultState, setDefaultState] = useState('FL');
    const [strictMode, setStrictMode] = useState(false);

    useEffect(() => {
        const storedDivisor = localStorage.getItem('lexmetric_divisor');
        const storedState = localStorage.getItem('lexmetric_state');
        const storedStrict = localStorage.getItem('lexmetric_strict');

        if (storedDivisor) setDivisor(storedDivisor);
        if (storedState) setDefaultState(storedState);
        if (storedStrict) setStrictMode(storedStrict === 'true');
    }, []);

    const handleSave = () => {
        localStorage.setItem('lexmetric_divisor', divisor);
        localStorage.setItem('lexmetric_state', defaultState);
        localStorage.setItem('lexmetric_strict', String(strictMode));
        alert('Settings saved successfully.');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--color-navy)' }}>Settings</h1>
                <p style={{ color: '#64748b', margin: 0 }}>Configure local audit parameters and engine preferences.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Card title="Jurisdiction Rules">
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Default State</label>
                        <select
                            value={defaultState}
                            onChange={(e) => setDefaultState(e.target.value)}
                            style={{ padding: '10px', width: '100%', maxWidth: '300px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="FL">Florida</option>
                            <option value="NY">New York</option>
                            <option value="NJ">New Jersey</option>
                            <option value="CA">California</option>
                            <option value="TX">Texas</option>
                        </select>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                            Determines the baseline lookback period and regional penalty rules.
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Penalty Divisor ($)</label>
                        <input
                            type="number"
                            value={divisor}
                            onChange={(e) => setDivisor(e.target.value)}
                            style={{ padding: '10px', width: '100%', maxWidth: '300px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                            The average monthly private patient care rate for the region. Used to calculate penalty months.
                        </div>
                    </div>
                </Card>

                <Card title="Engine Preferences">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Strict Privacy Mode (Hybrid Cloud)</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '500px' }}>
                                If enabled, the system will NEVER attempt to send illegible text to cloud logic, even if "Hybrid" is selected.
                                Note: Current version is purely local regardless of this setting.
                            </div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                            <input
                                type="checkbox"
                                checked={strictMode}
                                onChange={(e) => setStrictMode(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: strictMode ? 'var(--color-teal)' : '#cbd5e1',
                                borderRadius: '34px', transition: '.4s'
                            }}>
                                <span style={{
                                    position: 'absolute', content: '""', height: '18px', width: '18px', left: '4px', bottom: '4px',
                                    backgroundColor: 'white', borderRadius: '50%', transition: '.4s',
                                    transform: strictMode ? 'translateX(24px)' : 'none'
                                }}></span>
                            </span>
                        </label>
                    </div>
                </Card>

                <div>
                    <Button onClick={handleSave}>Save Preference</Button>
                </div>
            </div>
        </div>
    );
};
