'use client'

import { useEffect, useMemo, useState } from 'react';
import { Tooltip } from '@mantine/core';
import {
    FiActivity,
    FiBatteryCharging,
    FiCpu,
    FiDisc,
    FiInfo,
    FiPower,
    FiSliders,
    FiSun,
    FiThermometer,
    FiWind,
    FiZap,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';

const paintOptions = [
    { name: 'Obsidian Pearl', value: '#0b0f19', glow: '#74f7ff' },
    { name: 'Ion Silver', value: '#d9e5ea', glow: '#8a5cff' },
    { name: 'Solar Copper', value: '#c96c3b', glow: '#ffcf5a' },
    { name: 'Neural Blue', value: '#123d72', glow: '#4df8ba' },
];

const launchProfiles = [
    { name: 'Calm', multiplier: 0.72, note: 'Smooth pedal map, comfort dampers, quiet aero.' },
    { name: 'Pulse', multiplier: 0.9, note: 'Balanced response for fast road driving.' },
    { name: 'Ludicrous', multiplier: 1.08, note: 'Preheated pack, full boost, launch traction ready.' },
];

const specCards = [
    {
        label: '0-60 mph',
        value: '1.7s',
        detail: 'Tri-motor vector launch',
        tooltip: 'Estimated launch time from standstill to highway speed using full traction preconditioning.',
    },
    {
        label: 'Range',
        value: '612 mi',
        detail: 'Solid-state aero pack',
        tooltip: 'Conceptual maximum cruising range from a high-density pack and low-drag body profile.',
    },
    {
        label: 'Drag',
        value: '0.168 Cd',
        detail: 'Active skin aero',
        tooltip: 'Coefficient of drag. Lower numbers mean the car slips through air with less energy loss.',
    },
    {
        label: 'Charge',
        value: '8 min',
        detail: '10-80% peak curve',
        tooltip: 'Target fast-charge window under ideal charger, temperature, and battery conditioning.',
    },
];

const featureCards = [
    {
        Icon: FiBatteryCharging,
        title: 'Structural Blade Pack',
        detail: 'Battery spine doubles as a torsional core for lighter, stiffer handling.',
        metric: '96%',
        accent: 'Pack integrity',
    },
    {
        Icon: FiWind,
        title: 'Morphing Aero',
        detail: 'Vents, diffuser, and wheel shutters adjust continuously at speed.',
        metric: '14 deg',
        accent: 'Rear blade angle',
    },
    {
        Icon: FiCpu,
        title: 'Local Autonomy Core',
        detail: 'Redundant onboard inference keeps core drive assistance responsive offline.',
        metric: '7 ms',
        accent: 'Control loop',
    },
];

export default function TestPage() {
    const [paintIndex, setPaintIndex] = useState(1);
    const [rideMode, setRideMode] = useState<'street' | 'track'>('street');
    const [activeFeature, setActiveFeature] = useState(0);
    const [launchIndex, setLaunchIndex] = useState(1);
    const [aeroBalance, setAeroBalance] = useState(48);
    const [cabinTemp, setCabinTemp] = useState(68);
    const [lightsOn, setLightsOn] = useState(true);
    const [mobileDetail, setMobileDetail] = useState<{ title: string; body: string } | null>(null);
    const [launchPulse, setLaunchPulse] = useState(false);

    const paint = paintOptions[paintIndex];
    const launchProfile = launchProfiles[launchIndex];
    const activeSystem = featureCards[activeFeature];

    const modeStats = useMemo(() => {
        const output = rideMode === 'track' ? 1420 : 820;
        const tunedOutput = Math.round(output * launchProfile.multiplier);
        const drag = (0.192 - aeroBalance / 2200).toFixed(3);

        return rideMode === 'track'
            ? [
                { label: 'power', value: `${tunedOutput.toLocaleString()} hp`, tooltip: 'Maximum combined motor output for short-duration launch and track sessions.' },
                { label: 'stance', value: aeroBalance > 55 ? 'Pinned' : 'Low', tooltip: 'Suspension lowers for center of gravity and reduced front lift.' },
                { label: 'aero', value: `${drag} Cd`, tooltip: 'Diffuser, shutters, and rear blade prioritize downforce over efficiency.' },
                { label: 'cabin', value: `${cabinTemp} F`, tooltip: 'Displays simplify to speed, battery thermal state, braking, and lap deltas.' },
            ]
            : [
                { label: 'power', value: `${tunedOutput.toLocaleString()} hp`, tooltip: 'Road-tuned output for smooth response, efficiency, and tire longevity.' },
                { label: 'stance', value: aeroBalance > 60 ? 'Hunkered' : 'Adaptive', tooltip: 'Ride height changes based on speed, surface, and comfort settings.' },
                { label: 'aero', value: `${drag} Cd`, tooltip: 'Aero surfaces stay mostly closed to reduce turbulence and cabin noise.' },
                { label: 'cabin', value: `${cabinTemp} F`, tooltip: 'Interior prioritizes comfort, ambient lighting, navigation, and media.' },
            ];
    }, [aeroBalance, cabinTemp, launchProfile.multiplier, rideMode]);

    const wheelSpinClass = launchIndex === 2 || rideMode === 'track' || launchPulse ? 'animate-spin' : '';
    const bladeAngle = Math.round((aeroBalance - 50) / 4);
    const cabinGlow = cabinTemp < 67 ? '#9fdcff' : cabinTemp > 72 ? '#ffcf5a' : paint.glow;
    const showMobileDetail = (title: string, body: string) => {
        setMobileDetail((current) => current?.title === title ? null : { title, body });
    };
    const triggerLaunchPulse = () => {
        setLaunchPulse(true);
        navigator.vibrate?.(18);
    };

    useEffect(() => {
        if (!launchPulse) {
            return;
        }

        const timer = window.setTimeout(() => setLaunchPulse(false), 900);
        return () => window.clearTimeout(timer);
    }, [launchPulse]);

    return (
        <main className="h-[100dvh] w-full overflow-hidden bg-[#07080c] text-[#f7fbff] md:min-h-screen md:overflow-auto">
            <section className="relative mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden px-4 py-4 sm:px-6 md:min-h-screen md:px-10 md:py-7">
                <div className="pointer-events-none absolute inset-0 opacity-35">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_50%_18%,rgba(116,247,255,0.24),transparent_28%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,44px_44px,44px_44px]" />
                </div>

                <header className="relative z-10 flex flex-col gap-3 border-b border-white/10 pb-3 md:gap-5 md:pb-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] sm:text-sm sm:tracking-[0.28em]" style={{ color: paint.glow }}>
                            <FiZap aria-hidden="true" />
                            Project Echelon
                        </div>
                        <h1 className="mt-2 text-4xl font-bold leading-none sm:text-5xl md:mt-3 md:text-7xl">
                            Model XZ-1
                        </h1>
                    </div>
                    <p className="hidden max-w-xl text-sm leading-6 text-[#b6c4d6] md:block md:text-base">
                        A no-compromise electric grand tourer concept with live controls for paint, launch tuning, aero balance, cabin climate, and display focus.
                    </p>
                </header>

                <section className="relative z-10 flex min-h-0 flex-1 flex-col py-3 md:grid md:items-start md:gap-6 md:py-7 lg:grid-cols-[0.86fr_1.48fr_0.9fr] lg:items-center lg:gap-8 lg:py-10">
                    <aside className="hidden gap-3 md:order-2 md:grid md:grid-cols-3 lg:order-1 lg:grid-cols-1 lg:space-y-1">
                        {featureCards.map(({ Icon, title, detail, metric, accent }, index) => (
                            <button
                                key={title}
                                type="button"
                                onClick={() => setActiveFeature(index)}
                                className={`border p-4 text-left backdrop-blur transition-all focus:outline-none focus:ring-2 focus:ring-white/50 ${activeFeature === index ? 'border-white/35 bg-white/[0.11]' : 'border-white/10 bg-white/[0.055] hover:bg-white/[0.08]'}`}
                                style={activeFeature === index ? { boxShadow: `0 0 28px ${paint.glow}1f` } : undefined}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="text-xl" style={{ color: paint.glow }} aria-hidden="true" />
                                    <h2 className="text-sm font-semibold sm:text-base">{title}</h2>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-[#a9b5c4]">{detail}</p>
                                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs uppercase tracking-[0.14em] text-[#8795a8]">
                                    <span>{accent}</span>
                                    <span className="font-semibold normal-case tracking-normal text-white">{metric}</span>
                                </div>
                            </button>
                        ))}
                    </aside>

                    <div className="relative min-h-0 flex-1 md:order-1 md:min-h-[640px] lg:order-2 lg:min-h-[560px]">
                        <div className="absolute left-1/2 top-[32%] h-[240px] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[280px] md:top-[42%] md:h-[340px]" style={{ backgroundColor: `${paint.glow}24` }} />

                        <div className="absolute left-1/2 top-[31%] h-[230px] w-[100%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 sm:h-[260px] md:top-[42%] md:h-[300px]">
                            <button
                                type="button"
                                onClick={triggerLaunchPulse}
                                aria-label="Trigger launch pulse"
                                title="Trigger launch pulse"
                                className="absolute inset-x-[6%] top-[16%] z-40 h-[64%] cursor-pointer rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            {launchPulse && (
                                <>
                                    <div className="pointer-events-none absolute left-[11%] top-[47%] z-40 h-12 w-[78%] rounded-full border border-white/35 opacity-80 animate-ping" style={{ borderColor: paint.glow }} />
                                    <div className="pointer-events-none absolute left-[12%] top-[55%] z-40 h-1.5 w-[76%] rounded-full" style={{ backgroundColor: paint.glow, boxShadow: `0 0 34px ${paint.glow}` }} />
                                </>
                            )}
                            <div className="absolute left-[7%] top-[53%] z-20 h-20 w-20 rounded-full border-[8px] border-[#101827] bg-[#03050a] shadow-[inset_0_0_20px_rgba(255,255,255,0.08),0_14px_30px_rgba(0,0,0,0.45)] sm:h-28 sm:w-28 sm:border-[11px]">
                                <div className="absolute inset-3 rounded-full border border-white/10 bg-[#111827] sm:inset-4" />
                                <FiDisc className={`absolute left-1/2 top-1/2 text-3xl -translate-x-1/2 -translate-y-1/2 sm:text-4xl ${wheelSpinClass}`} style={{ color: paint.glow }} aria-hidden="true" />
                            </div>
                            <div className="absolute right-[7%] top-[53%] z-20 h-20 w-20 rounded-full border-[8px] border-[#101827] bg-[#03050a] shadow-[inset_0_0_20px_rgba(255,255,255,0.08),0_14px_30px_rgba(0,0,0,0.45)] sm:h-28 sm:w-28 sm:border-[11px]">
                                <div className="absolute inset-3 rounded-full border border-white/10 bg-[#111827] sm:inset-4" />
                                <FiDisc className={`absolute left-1/2 top-1/2 text-3xl -translate-x-1/2 -translate-y-1/2 sm:text-4xl ${wheelSpinClass}`} style={{ color: paint.glow }} aria-hidden="true" />
                            </div>

                            <div className="absolute left-[9%] top-[36%] z-10 h-32 w-[82%] rounded-[54%_46%_24%_26%/72%_72%_28%_28%] border border-white/20 shadow-[0_32px_70px_rgba(0,0,0,0.52)] sm:h-40" style={{ background: `linear-gradient(115deg, rgba(255,255,255,0.86), ${paint.value} 27%, #070a12 76%)` }} />
                            <div className="absolute left-[18%] top-[31%] z-20 h-2.5 w-16 rounded-full sm:h-3 sm:w-20" style={lightsOn ? { backgroundColor: paint.glow, boxShadow: `0 0 22px ${paint.glow}` } : { backgroundColor: '#334155' }} />
                            <div className="absolute right-[14%] top-[43%] z-20 h-2.5 w-20 rounded-full sm:h-3 sm:w-24" style={lightsOn ? { backgroundColor: '#ff4d5f', boxShadow: '0 0 20px rgba(255,77,95,0.7)' } : { backgroundColor: '#401820' }} />
                            <div className="absolute left-[22%] top-[19%] z-20 h-24 w-[52%] skew-x-[-18deg] rounded-t-[110px] border border-white/15 bg-[#101826]/95 shadow-[inset_0_0_28px_rgba(159,220,255,0.16)] sm:h-28" />
                            <div className="absolute left-[30%] top-[25%] z-30 h-14 w-[19%] skew-x-[-18deg] rounded-tl-[70px] border-l border-t border-white/20 sm:h-16" style={{ backgroundColor: `${cabinGlow}38` }} />
                            <div className="absolute left-[51%] top-[25%] z-30 h-14 w-[18%] skew-x-[-18deg] border-r border-t border-white/20 sm:h-16" style={{ backgroundColor: `${cabinGlow}20` }} />
                            <div className="absolute left-[44%] top-[23%] z-30 h-16 border-l border-white/15 sm:h-20" />
                            <div className="absolute left-[34%] top-[43%] z-30 h-1.5 w-12 rounded-full bg-white/60 sm:w-16" />
                            <div className="absolute right-[27%] top-[43%] z-30 h-1.5 w-12 rounded-full bg-white/35 sm:w-16" />
                            <div className="absolute left-[14%] top-[54%] z-30 h-3 w-[72%] rounded-full sm:h-4" style={{ backgroundColor: paint.glow, boxShadow: `0 0 ${lightsOn ? 30 : 10}px ${paint.glow}` }} />
                            <div className="absolute left-[21%] top-[70%] z-30 h-3 w-[58%] rounded-full bg-white/10" />
                            <div className="absolute left-[49%] top-[61%] z-30 h-16 w-20 skew-x-[-22deg] border-l border-white/10 bg-black/10 sm:h-20 sm:w-28" />
                            <div className="absolute right-[17%] top-[28%] z-20 h-2 w-28 rounded-full bg-white/20 origin-left transition-transform" style={{ transform: `rotate(${bladeAngle}deg)` }} />
                            <div className="absolute bottom-[1%] left-[2%] h-4 w-[96%] rounded-full bg-black/80 blur-sm" />
                        </div>

                        <div className="absolute left-1/2 top-[50%] w-full max-w-md -translate-x-1/2 px-2 md:top-auto md:bottom-36 lg:hidden">
                            <button
                                type="button"
                                onClick={() => showMobileDetail(activeSystem.title, activeSystem.detail)}
                                className="w-full border border-white/10 bg-[#0d121d]/80 p-3 text-center backdrop-blur transition-colors hover:bg-[#151d2d] focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label={`Show ${activeSystem.title} details`}
                            >
                                <p className="text-xs uppercase tracking-[0.18em] text-[#8fa0b5]">{activeSystem.accent}</p>
                                <p className="mt-1 text-xl font-bold" style={{ color: paint.glow }}>{activeSystem.metric}</p>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-[#a9b5c4]">
                                    {activeSystem.title}
                                    <FiInfo aria-hidden="true" />
                                </p>
                            </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 space-y-2 md:hidden">
                            <div className="grid grid-cols-4 gap-1.5">
                                {modeStats.map((stat) => (
                                    <button
                                        key={stat.label}
                                        type="button"
                                        onClick={() => showMobileDetail(stat.label, stat.tooltip)}
                                        className="min-h-[50px] border border-white/10 bg-[#0d121d]/80 px-1.5 py-2 text-center backdrop-blur transition-colors hover:bg-[#151d2d] focus:outline-none focus:ring-2 focus:ring-white/50"
                                        aria-label={`Show ${stat.label} details`}
                                    >
                                        <p className="flex items-center justify-center gap-1 truncate text-[10px] uppercase tracking-[0.12em] text-[#8fa0b5]">
                                            {stat.label}
                                            <FiInfo aria-hidden="true" />
                                        </p>
                                        <p className="mt-1 truncate text-xs font-semibold" style={{ color: paint.glow }}>{stat.value}</p>
                                    </button>
                                ))}
                            </div>

                            {mobileDetail && (
                                <button
                                    type="button"
                                    onClick={() => setMobileDetail(null)}
                                    className="w-full border border-white/10 bg-[#111827]/95 px-3 py-2 text-left backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Dismiss detail"
                                >
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: paint.glow }}>
                                        {mobileDetail.title}
                                    </p>
                                    <p className="mt-1 max-h-8 overflow-hidden text-xs leading-4 text-[#c2cfdf]">{mobileDetail.body}</p>
                                </button>
                            )}

                            <div className="border border-white/10 bg-[#0d121d]/90 p-2 backdrop-blur">
                                <div className="grid grid-cols-[1.2fr_1fr] gap-2">
                                    <div className="flex items-center gap-1.5">
                                        {paintOptions.map((option, index) => (
                                            <button
                                                key={option.name}
                                                type="button"
                                                onClick={() => setPaintIndex(index)}
                                                aria-label={`Select ${option.name}`}
                                                className={`h-8 flex-1 border border-white/15 p-1 focus:outline-none focus:ring-2 focus:ring-white/50 ${paintIndex === index ? 'ring-2 ring-white/70' : ''}`}
                                            >
                                                <span className="block h-full w-full rounded-[3px]" style={{ backgroundColor: option.value }} />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-4 gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setRideMode((mode) => mode === 'street' ? 'track' : 'street')}
                                            aria-label="Toggle ride mode"
                                            className="flex h-8 items-center justify-center border border-white/15 bg-white/[0.06] text-xs font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-white/50"
                                            style={{ color: paint.glow }}
                                        >
                                            {rideMode}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveFeature((index) => (index + 1) % featureCards.length)}
                                            aria-label="Cycle active system"
                                            className="flex h-8 items-center justify-center border border-white/15 bg-white/[0.06] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
                                        >
                                            <FiActivity style={{ color: paint.glow }} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLaunchIndex((index) => (index + 1) % launchProfiles.length)}
                                            aria-label="Cycle launch profile"
                                            className="flex h-8 items-center justify-center border border-white/15 bg-white/[0.06] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
                                        >
                                            <FiZap style={{ color: paint.glow }} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLightsOn((current) => !current)}
                                            aria-label="Toggle lights"
                                            className="flex h-8 items-center justify-center border border-white/15 bg-white/[0.06] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
                                        >
                                            <FiSun style={{ color: lightsOn ? paint.glow : '#7f8da0' }} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#c2cfdf]">
                                    <label htmlFor="mobile-aero-balance">
                                        <span className="flex items-center justify-between gap-2">
                                            <span>Aero</span>
                                            <span className="text-white">{aeroBalance}%</span>
                                        </span>
                                        <input
                                            id="mobile-aero-balance"
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={aeroBalance}
                                            onChange={(event) => setAeroBalance(Number(event.target.value))}
                                            className="mt-1 h-2 w-full cursor-pointer accent-current"
                                            style={{ color: paint.glow }}
                                        />
                                    </label>
                                    <label htmlFor="mobile-cabin-temp">
                                        <span className="flex items-center justify-between gap-2">
                                            <span>Cabin</span>
                                            <span className="text-white">{cabinTemp} F</span>
                                        </span>
                                        <input
                                            id="mobile-cabin-temp"
                                            type="range"
                                            min="62"
                                            max="78"
                                            value={cabinTemp}
                                            onChange={(event) => setCabinTemp(Number(event.target.value))}
                                            className="mt-1 h-2 w-full cursor-pointer accent-current"
                                            style={{ color: paint.glow }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-1/2 hidden w-full max-w-xl -translate-x-1/2 grid-cols-2 gap-2 md:grid md:grid-cols-4 md:gap-3">
                            {specCards.map((spec) => (
                                <Tooltip
                                    key={spec.label}
                                    label={spec.tooltip}
                                    multiline
                                    w={260}
                                    withArrow
                                    color="dark"
                                    position="top"
                                >
                                    <button type="button" className="min-h-[106px] border border-white/10 bg-[#0d121d]/80 p-3 text-center backdrop-blur transition-colors hover:bg-[#151d2d] focus:outline-none focus:ring-2 focus:ring-white/50">
                                        <p className="flex items-center justify-center gap-1 text-xs text-[#9caabd]">
                                            {spec.label}
                                            <FiInfo aria-hidden="true" />
                                        </p>
                                        <p className="mt-1 text-lg font-bold sm:text-xl" style={{ color: paint.glow }}>{spec.value}</p>
                                        <p className="mt-1 text-[11px] leading-4 text-[#7f8da0]">{spec.detail}</p>
                                    </button>
                                </Tooltip>
                            ))}
                        </div>
                    </div>

                    <aside className="hidden gap-4 md:order-3 md:grid md:grid-cols-2 lg:grid-cols-1">
                        <div className="border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <FiSliders style={{ color: paint.glow }} aria-hidden="true" />
                                <h2 className="text-lg font-semibold sm:text-xl">Design Studio</h2>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {paintOptions.map((option, index) => (
                                    <Button
                                        key={option.name}
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setPaintIndex(index)}
                                        aria-label={`Select ${option.name}`}
                                        title={option.name}
                                        className={`h-12 w-full border-white/15 bg-transparent p-1 hover:bg-white/10 ${paintIndex === index ? 'ring-2 ring-white/70' : ''}`}
                                    >
                                        <span className="h-full w-full rounded-[4px] border border-white/10" style={{ backgroundColor: option.value }} />
                                    </Button>
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-[#a9b5c4]">Paint: <span className="font-semibold text-white">{paint.name}</span></p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setLightsOn((current) => !current)}
                                className="mt-4 w-full border-white/15 bg-transparent text-white hover:bg-white/10"
                            >
                                <FiSun aria-hidden="true" />
                                {lightsOn ? 'Lights on' : 'Lights off'}
                            </Button>
                        </div>

                        <div className="border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
                            <h2 className="text-lg font-semibold sm:text-xl">Ride Mode</h2>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {(['street', 'track'] as const).map((mode) => (
                                    <Button
                                        key={mode}
                                        type="button"
                                        variant={rideMode === mode ? 'default' : 'outline'}
                                        onClick={() => setRideMode(mode)}
                                        className="capitalize"
                                        style={rideMode === mode ? { backgroundColor: paint.glow, color: '#05070b' } : undefined}
                                    >
                                        {mode}
                                    </Button>
                                ))}
                            </div>
                            <div className="mt-5 space-y-3 text-sm">
                                {modeStats.map((stat) => (
                                    <Tooltip
                                        key={stat.label}
                                        label={stat.tooltip}
                                        multiline
                                        w={260}
                                        withArrow
                                        color="dark"
                                        position="left"
                                    >
                                        <button type="button" className="flex w-full justify-between gap-3 border-b border-white/10 pb-2 text-left transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">
                                            <span className="flex items-center gap-1 capitalize text-[#9caabd]">
                                                {stat.label}
                                                <FiInfo aria-hidden="true" />
                                            </span>
                                            <span className="font-semibold">{stat.value}</span>
                                        </button>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>

                        <div className="border border-white/10 bg-white/[0.055] p-4 backdrop-blur sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <FiActivity style={{ color: paint.glow }} aria-hidden="true" />
                                    <h2 className="text-lg font-semibold sm:text-xl">Launch Setup</h2>
                                </div>
                                <FiPower style={{ color: paint.glow }} aria-hidden="true" />
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {launchProfiles.map((profile, index) => (
                                    <Button
                                        key={profile.name}
                                        type="button"
                                        variant={launchIndex === index ? 'default' : 'outline'}
                                        onClick={() => setLaunchIndex(index)}
                                        className="px-2 text-xs sm:text-sm"
                                        style={launchIndex === index ? { backgroundColor: paint.glow, color: '#05070b' } : undefined}
                                    >
                                        {profile.name}
                                    </Button>
                                ))}
                            </div>
                            <p className="mt-3 min-h-[40px] text-sm leading-5 text-[#a9b5c4]">{launchProfile.note}</p>

                            <label className="mt-4 block text-sm text-[#c2cfdf]" htmlFor="aero-balance">
                                <span className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2"><FiWind aria-hidden="true" /> Aero balance</span>
                                    <span className="font-semibold text-white">{aeroBalance}%</span>
                                </span>
                                <input
                                    id="aero-balance"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={aeroBalance}
                                    onChange={(event) => setAeroBalance(Number(event.target.value))}
                                    className="mt-2 h-2 w-full cursor-pointer accent-current"
                                    style={{ color: paint.glow }}
                                />
                            </label>

                            <label className="mt-4 block text-sm text-[#c2cfdf]" htmlFor="cabin-temp">
                                <span className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2"><FiThermometer aria-hidden="true" /> Cabin temp</span>
                                    <span className="font-semibold text-white">{cabinTemp} F</span>
                                </span>
                                <input
                                    id="cabin-temp"
                                    type="range"
                                    min="62"
                                    max="78"
                                    value={cabinTemp}
                                    onChange={(event) => setCabinTemp(Number(event.target.value))}
                                    className="mt-2 h-2 w-full cursor-pointer accent-current"
                                    style={{ color: paint.glow }}
                                />
                            </label>
                        </div>
                    </aside>
                </section>

                <footer className="relative z-10 hidden flex-col gap-3 border-t border-white/10 pt-5 text-sm text-[#8d9aad] md:flex md:flex-row md:items-center md:justify-between">
                    <p>Original EV concept design for a future flagship sedan-coupe.</p>
                    <p className="font-mono text-xs sm:text-sm" style={{ color: paint.glow }}>ENVY_INDEX: UNREASONABLE</p>
                </footer>
            </section>
        </main>
    );
}
