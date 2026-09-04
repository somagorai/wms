import { Activity, AlertTriangle, CheckCircle2, TrendingUp, Server, Database, Cpu, HardDrive, Zap, Cloud, Box, Boxes, Scan, Archive, Package, ShoppingCart, BarChart3, ChevronUp, ChevronDown, Filter, X, Check, XCircle, ChevronRight, Home, Star, RefreshCw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { ServiceDetailPanel } from "../components/ServiceDetailPanel";
import { DatabaseDetailPanel } from "../components/DatabaseDetailPanel";
import { useBookmarks } from "../contexts/BookmarkContext";
import { useVersionTheme } from "../contexts/VersionThemeContext";
import {
  MasterTableContainer,
  MasterTable,
  MasterTableHead,
  MasterTableTh,
  MasterTableBody,
  MasterTableRow,
  MasterTableCell,
} from "../components/tables/MasterTable";

// Mock services data
const servicesData = [
 { name: "Conductor", status: "healthy", uptime: "99.98%", responseTime: "34ms", lastCheck: "1 min ago", version: "v2.4.1" },
 { name: "Gateway", status: "healthy", uptime: "99.95%", responseTime: "45ms", lastCheck: "2 min ago", version: "v3.1.0" },
 { name: "Host Adapter", status: "degraded", uptime: "98.50%", responseTime: "112ms", lastCheck: "1 min ago", version: "v1.8.3" },
 { name: "Work", status: "healthy", uptime: "99.99%", responseTime: "28ms", lastCheck: "30 sec ago", version: "v2.7.2" },
 { name: "Scan", status: "down", uptime: "0.00%", responseTime: "N/A", lastCheck: "15 min ago", version: "v2.3.5" },
 { name: "Storage", status: "healthy", uptime: "99.96%", responseTime: "52ms", lastCheck: "2 min ago", version: "v3.0.1" },
 { name: "Item", status: "healthy", uptime: "99.94%", responseTime: "38ms", lastCheck: "1 min ago", version: "v2.5.0" },
 { name: "Inventory", status: "warning", uptime: "97.80%", responseTime: "156ms", lastCheck: "3 min ago", version: "v2.2.8" },
];

// Mock servers data
const serversData = [
 { name: "App Server", computerName: "WMS-APP-PROD-01", environment: "Production", status: "healthy", uptime: "99.99%", cpu: 42, memory: 68, disk: 54, lastReboot: "14 days ago" },
 { name: "App Server", computerName: "WMS-APP-SAND-01", environment: "Sandbox", status: "down", uptime: "0.00%", cpu: 0, memory: 0, disk: 0, lastReboot: "N/A" },
 { name: "DB Server", computerName: "WMS-DB-PROD-01", environment: "Production", status: "healthy", uptime: "99.98%", cpu: 55, memory: 78, disk: 62, lastReboot: "28 days ago" },
 { name: "DB Server", computerName: "WMS-DB-SAND-01", environment: "Sandbox", status: "down", uptime: "0.00%", cpu: 0, memory: 0, disk: 0, lastReboot: "N/A" },
 { name: "Kommand Server", computerName: "WMS-KMND-PROD-01", environment: "Production", status: "degraded", uptime: "98.45%", cpu: 72, memory: 85, disk: 48, lastReboot: "21 days ago" },
 { name: "Kommand Server", computerName: "WMS-KMND-SAND-01", environment: "Sandbox", status: "healthy", uptime: "99.12%", cpu: 38, memory: 58, disk: 35, lastReboot: "3 days ago" },
 { name: "Connect Server", computerName: "WMS-CONN-PROD-01", environment: "Production", status: "healthy", uptime: "99.95%", cpu: 48, memory: 61, disk: 44, lastReboot: "17 days ago" },
 { name: "Connect Server", computerName: "WMS-CONN-SAND-01", environment: "Sandbox", status: "down", uptime: "0.00%", cpu: 0, memory: 0, disk: 0, lastReboot: "N/A" },
];

// Mock database data
const databaseData = [
 { 
 name: "SQL Server",
 computerName: "WMS-DB-PROD-01",
 dataType: "SQL Server",
 type: "Production", 
 status: "healthy", 
 connections: 247, 
 maxConnections: 500, 
 queryTime: "12ms", 
 transactions: "8.5k/min",
 size: "142 GB",
 growth: "+2.3 GB/week"
 },
 { 
 name: "SQL Server",
 computerName: "WMS-DB-SAND-01",
 dataType: "SQL Server",
 type: "Sandbox", 
 status: "healthy", 
 connections: 45, 
 maxConnections: 200, 
 queryTime: "18ms", 
 transactions: "1.2k/min",
 size: "38 GB",
 growth: "+0.5 GB/week"
 },
 { 
 name: "PostgreSQL",
 computerName: "WMS-DB-PROD-02",
 dataType: "PostgreSQL",
 type: "Production", 
 status: "healthy", 
 connections: 182, 
 maxConnections: 400, 
 queryTime: "8ms", 
 transactions: "12.3k/min",
 size: "218 GB",
 growth: "+3.8 GB/week"
 },
 { 
 name: "PostgreSQL",
 computerName: "WMS-DB-SAND-02",
 dataType: "PostgreSQL",
 type: "Sandbox", 
 status: "healthy", 
 connections: 28, 
 maxConnections: 150, 
 queryTime: "15ms", 
 transactions: "890/min",
 size: "52 GB",
 growth: "+0.8 GB/week"
 },
 { 
 name: "MongoDB",
 computerName: "WMS-DB-PROD-03",
 dataType: "MongoDB",
 type: "Production", 
 status: "warning", 
 connections: 356, 
 maxConnections: 500, 
 queryTime: "24ms", 
 transactions: "15.7k/min",
 size: "384 GB",
 growth: "+8.2 GB/week"
 },
 { 
 name: "MongoDB",
 computerName: "WMS-DB-SAND-03",
 dataType: "MongoDB",
 type: "Sandbox", 
 status: "healthy", 
 connections: 62, 
 maxConnections: 200, 
 queryTime: "19ms", 
 transactions: "1.8k/min",
 size: "94 GB",
 growth: "+1.2 GB/week"
 },
 { 
 name: "RabbitMQ",
 computerName: "WMS-MQ-PROD-01",
 dataType: "RabbitMQ",
 type: "Production", 
 status: "healthy", 
 connections: 124, 
 maxConnections: 300, 
 queryTime: "3ms", 
 transactions: "42.5k/min",
 size: "15,847",
 growth: "18 channels"
 },
 { 
 name: "RabbitMQ",
 computerName: "WMS-MQ-SAND-01",
 dataType: "RabbitMQ",
 type: "Sandbox", 
 status: "healthy", 
 connections: 18, 
 maxConnections: 100, 
 queryTime: "2ms", 
 transactions: "2.8k/min",
 size: "342",
 growth: "6 channels"
 },
];

// Mock Camunda data
const camundaData = [
 {
 environment: "Production",
 status: "healthy",
 openIncidents: 3,
 openHumanTasks: 24,
 runningProcessInstances: [
 { processType: "merge_item", count: 127, avgDuration: "4.2 min" },
 { processType: "putaway_process", count: 89, avgDuration: "6.8 min" },
 { processType: "picklist_process", count: 156, avgDuration: "12.4 min" },
 { processType: "inspect_list", count: 43, avgDuration: "8.1 min" },
 { processType: "cycle_count_process", count: 31, avgDuration: "5.3 min" },
 { processType: "replenishment_process", count: 67, avgDuration: "9.7 min" },
 ],
 },
 {
 environment: "Sandbox",
 status: "healthy",
 openIncidents: 1,
 openHumanTasks: 8,
 runningProcessInstances: [
 { processType: "merge_item", count: 12, avgDuration: "3.8 min" },
 { processType: "putaway_process", count: 15, avgDuration: "5.9 min" },
 { processType: "picklist_process", count: 23, avgDuration: "11.2 min" },
 { processType: "inspect_list", count: 7, avgDuration: "7.5 min" },
 { processType: "cycle_count_process", count: 5, avgDuration: "4.8 min" },
 { processType: "replenishment_process", count: 9, avgDuration: "8.9 min" },
 ],
 },
];

export default function HealthDashboard() {
  const { version } = useVersionTheme();
  const isV6 = version === "Master Blue V6";
 const { isSidebarExpanded } = useLayout();
 const location = useLocation();
 const { toggleBookmark, isBookmarked } = useBookmarks();

 // Handle bookmark tile
 const handleBookmarkTile = (e: React.MouseEvent, id: string, title: string, subType: string, status: string, iconName: string, data: any) => {
 e.stopPropagation();
 toggleBookmark({
 id,
 title,
 type: "health",
 subType,
 icon: iconName,
 data: {
 ...data,
 status
 }
 });
 };
 
 // Section management state
 const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(["Services", "Servers", "Data", "Camunda"]));
 const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["Services", "Servers", "Data", "Camunda"]));
 const [showFilterPanel, setShowFilterPanel] = useState(false);
 const [sectionSearch, setSectionSearch] = useState("");
 const [activeDropdown, setActiveDropdown] = useState<'section' | null>(null);
 const [showFilterTooltip, setShowFilterTooltip] = useState(false);

 // Status filters for each section
 const [servicesStatusFilter, setServicesStatusFilter] = useState<string | null>(null);
 const [serversStatusFilter, setServersStatusFilter] = useState<string | null>(null);
 const [dataStatusFilter, setDataStatusFilter] = useState<string | null>(null);

 // Service detail panel state
 const [selectedService, setSelectedService] = useState<string | null>(null);

 // Database detail panel state
 const [selectedDatabase, setSelectedDatabase] = useState<{ name: string; type: string; computerName: string; dataType: string } | null>(null);

 // Handle hash fragment navigation on mount and hash change
 useEffect(() => {
 const hash = location.hash.slice(1); // Remove the # character
 console.log('HealthDashboard hash detected:', hash);
 console.log('Full location:', location);
 
 if (hash) {
 // Map hash to section name (hash is lowercase, section names are capitalized)
 const hashToSection: { [key: string]: string } = {
 'services': 'Services',
 'servers': 'Servers',
 'databases': 'Data',
 'data': 'Data',
 'camunda': 'Camunda'
 };
 
 const sectionName = hashToSection[hash];
 console.log('Section name from hash:', sectionName);
 
 // Ensure the section is selected and expanded
 if (sectionName) {
 setSelectedSections(prev => new Set(prev).add(sectionName));
 setExpandedSections(prev => new Set(prev).add(sectionName));
 }
 
 // Use requestAnimationFrame to ensure DOM is painted
 const attemptScroll = (attempt = 0, maxAttempts = 10) => {
 const element = document.getElementById(hash);
 console.log(`Attempt ${attempt + 1}: Looking for element with id:`, hash);
 console.log('Element found:', element);
 
 if (element) {
 console.log('Scrolling to element with scrollIntoView');
 
 // Use scrollIntoView with custom offset
 element.scrollIntoView({ behavior: 'smooth', block: 'start' });
 
 // Then adjust for the sticky header (240px)
 setTimeout(() => {
 window.scrollBy({
 top: -240,
 behavior: 'smooth'
 });
 }, 100);
 } else if (attempt < maxAttempts) {
 // Try again
 console.log(`Element not found, retrying... (${attempt + 1}/${maxAttempts})`);
 setTimeout(() => attemptScroll(attempt + 1, maxAttempts), 100);
 } else {
 console.log(`Element with id "${hash}" not found after ${maxAttempts} attempts`);
 // List all elements with ids
 const allElementsWithIds = document.querySelectorAll('[id]');
 console.log('All elements with IDs:', Array.from(allElementsWithIds).map(el => el.id));
 }
 };

 // Wait for browser to paint
 requestAnimationFrame(() => {
 requestAnimationFrame(() => {
 attemptScroll();
 });
 });
 }
 }, [location]); // Re-run when location changes

 const allSections = ["Services", "Servers", "Data", "Camunda"];

 const toggleSection = (section: string) => {
 const newSelected = new Set(selectedSections);
 if (newSelected.has(section)) {
 newSelected.delete(section);
 } else {
 newSelected.add(section);
 }
 setSelectedSections(newSelected);
 };

 const toggleSectionExpansion = (section: string) => {
 const newExpanded = new Set(expandedSections);
 if (newExpanded.has(section)) {
 newExpanded.delete(section);
 } else {
 newExpanded.add(section);
 }
 setExpandedSections(newExpanded);
 };

 const clearAllFilters = () => {
 setSelectedSections(new Set(allSections));
 setSectionSearch("");
 setServicesStatusFilter(null);
 setServersStatusFilter(null);
 setDataStatusFilter(null);
 };

 const hasActiveFilters = selectedSections.size !== allSections.length;
 const totalFilterCount = selectedSections.size !== allSections.length ? 1 : 0;

 const getStatusColor = (status: string) => {
 switch (status) {
 case "healthy":
 return "text-[var(--state-success)]";
 case "degraded":
 case "warning":
 return "text-[var(--state-warning)]";
 case "down":
 return "text-[var(--state-error)]";
 default:
 return "text-[var(--muted-foreground)]";
 }
 };

 const getStatusBgColor = (status: string) => {
  switch (status.toLowerCase()) {
  case "healthy":
  return "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--state-success)]/30 hover:border-[var(--state-success)]/60";
  case "degraded":
  case "warning":
  return "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--state-warning)]/30 hover:border-[var(--state-warning)]/60";
  case "down":
  return "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--state-error)]/30 hover:border-[var(--state-error)]/60";
  default:
  return "bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)] ";
  }
  };

 // Services calculations
 const servicesHealthy = servicesData.filter(s => s.status === "healthy").length;
 const servicesDegraded = servicesData.filter(s => s.status === "degraded" || s.status === "warning").length;
 const servicesDown = servicesData.filter(s => s.status === "down").length;

 // Servers calculations
 const serversHealthy = serversData.filter(s => s.status === "healthy").length;
 const serversDegraded = serversData.filter(s => s.status === "degraded" || s.status === "warning").length;
 const serversDown = serversData.filter(s => s.status === "down").length;

 // Database calculations
 const dbHealthy = databaseData.filter(d => d.status === "healthy").length;
 const dbDegraded = databaseData.filter(d => d.status === "warning" || d.status === "degraded").length;
 const dbDown = databaseData.filter(d => d.status === "down").length;

 // Filtered data based on status filters
 const filteredServicesData = servicesStatusFilter ? servicesData.filter(s => {
 if (servicesStatusFilter === "degraded") return s.status === "degraded" || s.status === "warning";
 return s.status === servicesStatusFilter;
 }) : servicesData;

 const filteredServersData = serversStatusFilter ? serversData.filter(s => {
 if (serversStatusFilter === "degraded") return s.status === "degraded" || s.status === "warning";
 return s.status === serversStatusFilter;
 }) : serversData;

 const filteredDatabaseData = dataStatusFilter ? databaseData.filter(d => {
 if (dataStatusFilter === "degraded") return d.status === "degraded" || d.status === "warning";
 return d.status === dataStatusFilter;
 }) : databaseData;

 return (
 <div className={`flex flex-col min-h-screen transition-all duration-300 ${selectedService ? 'pr-[624px]' : selectedDatabase ? 'pr-[724px]' : ''}`}>
 {/* Sticky Header */}
 <div className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md text-[var(--foreground)] border-b border-[var(--border)] px-8 pt-6 pb-4">
 <div className="flex items-center justify-between gap-4 mb-0">
 <nav className="flex items-center gap-2 text-sm">
 <Link to="/app/home" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors flex items-center gap-1">
 <Home size={14} />Home
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <Link to="/app/navigation?section=dashboards" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors">
 Business Insights
 </Link>
 <ChevronRight size={14} className="text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]" />
 <span className="text-[var(--foreground)]  font-semibold text-lg flex items-center gap-2">
 <Activity size={20} className="text-[var(--primary)] dark:text-[var(--primary)]" />
 Monitoring Dashboard
 </span>
 </nav>
 <div className="flex items-center gap-3 relative">
 <button onClick={() => window.location.reload()} className="p-2 rounded-lg border-[var(--border)]  bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] text-[var(--muted-foreground)] transition-colors" title="Refresh">
 <RefreshCw size={16} />
 </button>
 {/* Filter Button */}
 <button
 onClick={() => {
 setShowFilterPanel(!showFilterPanel);
 }}
 onMouseEnter={() => setShowFilterTooltip(true)}
 onMouseLeave={() => setShowFilterTooltip(false)}
 className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border ${
 showFilterPanel || hasActiveFilters
 ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 border border-transparent"
 : "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] border border-transparent"
 }`}
 >
 <Filter size={18} />
 <span>Filter</span>
 {hasActiveFilters && (
 <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
 {totalFilterCount}
 </span>
 )}
 </button>
 
 {/* Filter Tooltip */}
 {showFilterTooltip && hasActiveFilters && (
 <div className="absolute top-full right-0 mt-2 z-50 w-72 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg p-4 animate-in fade-in slide-in- duration-150">
 <div className="space-y-3">
 <div className="flex items-center justify-between mb-2">
 <h4 className="text-sm font-semibold text-[var(--foreground)] ">Active Filters</h4>
 <span className="text-xs text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
 {totalFilterCount} filter{totalFilterCount !== 1 ? 's' : ''}
 </span>
 </div>

 {selectedSections.size !== allSections.length && (
 <div>
 <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Sections</p>
 <div className="flex flex-wrap gap-1.5">
 {Array.from(selectedSections).map((section) => (
 <span
 key={section}
 className="inline-flex items-center px-2 py-1 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs"
 >
 {section}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>

      <div className="flex-1 p-8">
        {/* Filter Panel */}
        {showFilterPanel && (
 <div className="mb-6 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl p-6 animate-in slide-in- duration-200">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-[var(--foreground)]  font-semibold">Filters</h3>
 <div className="flex items-center gap-2">
 {hasActiveFilters && (
 <button
 onClick={clearAllFilters}
 className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors"
 >
 Clear All
 </button>
 )}
 <button
 onClick={() => setShowFilterPanel(false)}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors"
 >
 <X size={20} />
 </button>
 </div>
 </div>

 <div className="relative">
 <label className="text-sm font-medium text-[var(--foreground)]  mb-2 block">Sections</label>
 <div className="bg-[var(--surface-container-low)] dark:bg-[var(--card)] border-[var(--border)]  rounded-lg p-2 min-h-[42px]">
 {/* Selected Items as Chips */}
 {selectedSections.size !== allSections.length && (
 <div className="flex flex-wrap gap-1.5 mb-2">
 {Array.from(selectedSections).map((section) => (
 <span
 key={section}
 className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--primary)]  text-[var(--primary-foreground)] rounded text-xs font-medium"
 >
 {section}
 <button
 onClick={() => toggleSection(section)}
 className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
 >
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 )}
 {/* Search and Dropdown */}
 <div className="relative" onClick={(e) => e.stopPropagation()}>
 <input
 type="text"
 placeholder="Search or select sections..."
 value={sectionSearch}
 onChange={(e) => setSectionSearch(e.target.value)}
 onFocus={() => setActiveDropdown('section')}
 className="w-full bg-transparent text-[var(--foreground)]  text-sm placeholder-zinc-500 dark:placeholder-zinc-500 outline-none"
 />
 {/* Dropdown Options */}
 {activeDropdown === 'section' && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border-[var(--border)]  rounded-lg max-h-48 overflow-y-auto z-10">
 {allSections.filter(section => section.toLowerCase().includes(sectionSearch.toLowerCase())).map((section) => (
 <button
 key={section}
 onClick={() => {
 toggleSection(section);
 setSectionSearch('');
 }}
 className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
 selectedSections.has(section)
 ? 'bg-[var(--primary)]/10 /10 text-[var(--primary)] dark:text-[var(--primary)]'
 : 'text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)]'
 }`}
 >
 <div className={`w-4 h-4 rounded border flex items-center justify-center ${
 selectedSections.has(section)
 ? 'bg-[var(--primary)]  border-[var(--primary)] dark:border-[var(--primary)]'
 : 'border-[var(--border)] dark:border-[var(--border)]'
 }`}>
 {selectedSections.has(section) && <Check size={12} className="text-[var(--foreground)]" />}
 </div>
 {section}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 )}
 
        {/* Quick Health Overview - Prominent KPI Dashboard */}
        <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]/70 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-[var(--primary)] rounded-full"></div>
            Quick Health Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Services Tiles */}
            <div className="bg-[var(--surface-container-low)] border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[var(--secondary-container)] rounded-lg flex items-center justify-center">
                  <Cloud className="text-[var(--on-secondary-container)]" size={18} />
                </div>
                <h3 className="text-base font-bold text-[var(--secondary)] uppercase tracking-wide">Services</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => {
 setServicesStatusFilter(servicesStatusFilter === "healthy" ? null : "healthy");
 if (!expandedSections.has("Services")) {
 toggleSectionExpansion("Services");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 servicesStatusFilter === "healthy"
 ? 'border-2 border-[var(--state-success)] bg-[var(--state-success-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-success)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-success)] dark:bg-[var(--state-success)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)] rounded-lg flex items-center justify-center">
 <CheckCircle2 className="text-[var(--state-on-success-container)] dark:text-[var(--state-on-success-container)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">{servicesHealthy}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Healthy</h4>
 </button>

 <button
 onClick={() => {
 setServicesStatusFilter(servicesStatusFilter === "degraded" ? null : "degraded");
 if (!expandedSections.has("Services")) {
 toggleSectionExpansion("Services");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 servicesStatusFilter === "degraded"
 ? 'border-2 border-[var(--state-warning)] bg-[var(--state-warning-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-warning)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-warning)] dark:bg-[var(--state-warning)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)] rounded-lg flex items-center justify-center">
 <AlertTriangle className="text-[var(--state-on-warning-container)] dark:text-[var(--state-on-warning-container)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">{servicesDegraded}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Degraded</h4>
 </button>

 <button
 onClick={() => {
 setServicesStatusFilter(servicesStatusFilter === "down" ? null : "down");
 if (!expandedSections.has("Services")) {
 toggleSectionExpansion("Services");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 servicesStatusFilter === "down"
 ? 'border-2 border-[var(--state-error)] bg-[var(--state-error-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-error)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-error)] dark:bg-[var(--state-error)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)] rounded-lg flex items-center justify-center">
 <XCircle className="text-[var(--state-on-error-container)] dark:text-[var(--state-on-error-container)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-error)] dark:text-[var(--state-error)]">{servicesDown}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Down</h4>
 </button>

 <button
 onClick={() => {
 setServicesStatusFilter(null);
 if (!expandedSections.has("Services")) {
 toggleSectionExpansion("Services");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 servicesStatusFilter === null
 ? 'border-2 border-[var(--primary)] bg-[var(--primary)]/10'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--primary)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--primary)]  rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--primary-container)] dark:bg-[var(--primary-container)] rounded-lg flex items-center justify-center">
 <Cloud className="text-[var(--on-primary-container)] dark:text-[var(--on-primary-container)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--foreground)] ">{servicesData.length}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Total</h4>
 </button>
 </div>
 </div>

 {/* Servers Tiles */}
 <div className="bg-[var(--surface-container-low)] border border-[var(--border)] rounded-xl p-5">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 bg-[var(--tertiary-container)] dark:bg-[var(--tertiary-container)] rounded-lg flex items-center justify-center">
 <Server className="text-[var(--on-tertiary-container)] dark:text-[var(--on-tertiary-container)]" size={18} />
 </div>
 <h3 className="text-base font-bold text-[var(--tertiary)] dark:text-[var(--tertiary)] uppercase tracking-wide">Servers</h3>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => {
 setServersStatusFilter(serversStatusFilter === "healthy" ? null : "healthy");
 if (!expandedSections.has("Servers")) {
 toggleSectionExpansion("Servers");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 serversStatusFilter === "healthy"
 ? 'border-2 border-[var(--state-success)] bg-[var(--state-success-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-success)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-success)] dark:bg-[var(--state-success)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)] rounded-lg flex items-center justify-center">
 <CheckCircle2 className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">{serversHealthy}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Healthy</h4>
 </button>

 <button
 onClick={() => {
 setServersStatusFilter(serversStatusFilter === "degraded" ? null : "degraded");
 if (!expandedSections.has("Servers")) {
 toggleSectionExpansion("Servers");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 serversStatusFilter === "degraded"
 ? 'border-2 border-[var(--state-warning)] bg-[var(--state-warning-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-warning)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-warning)] dark:bg-[var(--state-warning)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)] rounded-lg flex items-center justify-center">
 <AlertTriangle className="text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">{serversDegraded}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Degraded</h4>
 </button>

 <button
 onClick={() => {
 setServersStatusFilter(serversStatusFilter === "down" ? null : "down");
 if (!expandedSections.has("Servers")) {
 toggleSectionExpansion("Servers");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 serversStatusFilter === "down"
 ? 'border-2 border-[var(--state-error)] bg-[var(--state-error-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-error)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-error)] dark:bg-[var(--state-error)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)] rounded-lg flex items-center justify-center">
 <XCircle className="text-[var(--state-error)] dark:text-[var(--state-error)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-error)] dark:text-[var(--state-error)]">{serversDown}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Down</h4>
 </button>

 <button
 onClick={() => {
 setServersStatusFilter(null);
 if (!expandedSections.has("Servers")) {
 toggleSectionExpansion("Servers");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 serversStatusFilter === null
 ? 'border-2 border-[var(--primary)] bg-[var(--primary)]/10'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--primary)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--primary)]  rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <Server className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--foreground)] ">{serversData.length}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Total</h4>
 </button>
 </div>
 </div>

 {/* Data Tiles */}
 <div className="bg-[var(--surface-container-low)] border border-[var(--border)] rounded-xl p-5">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 bg-[var(--state-success-container)] rounded-lg flex items-center justify-center">
 <Database className="text-[var(--state-on-success-container)]" size={18} />
 </div>
 <h3 className="text-base font-bold text-[var(--state-success)] uppercase tracking-wide">Data</h3>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => {
 setDataStatusFilter(dataStatusFilter === "healthy" ? null : "healthy");
 if (!expandedSections.has("Data")) {
 toggleSectionExpansion("Data");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 dataStatusFilter === "healthy"
 ? 'border-2 border-[var(--state-success)] bg-[var(--state-success-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-success)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-success)] dark:bg-[var(--state-success)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-success-container)] dark:bg-[var(--state-success-container)] rounded-lg flex items-center justify-center">
 <CheckCircle2 className="text-[var(--state-on-success-container)] dark:text-[var(--state-success)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-on-success-container)] dark:text-[var(--state-success)]">{dbHealthy}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Healthy</h4>
 </button>

 <button
 onClick={() => {
 setDataStatusFilter(dataStatusFilter === "degraded" ? null : "degraded");
 if (!expandedSections.has("Data")) {
 toggleSectionExpansion("Data");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 dataStatusFilter === "degraded"
 ? 'border-2 border-[var(--state-warning)] bg-[var(--state-warning-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-warning)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-warning)] dark:bg-[var(--state-warning)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-warning-container)] dark:bg-[var(--state-warning-container)] rounded-lg flex items-center justify-center">
 <AlertTriangle className="text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-on-warning-container)] dark:text-[var(--state-warning)]">{dbDegraded}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Degraded</h4>
 </button>

 <button
 onClick={() => {
 setDataStatusFilter(dataStatusFilter === "down" ? null : "down");
 if (!expandedSections.has("Data")) {
 toggleSectionExpansion("Data");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 dataStatusFilter === "down"
 ? 'border-2 border-[var(--state-error)] bg-[var(--state-error-container)]/20'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--state-error)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--state-error)] dark:bg-[var(--state-error)] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--state-error-container)] dark:bg-[var(--state-error-container)] rounded-lg flex items-center justify-center">
 <XCircle className="text-[var(--state-error)] dark:text-[var(--state-error)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--state-error)] dark:text-[var(--state-error)]">{dbDown}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Down</h4>
 </button>

 <button
 onClick={() => {
 setDataStatusFilter(null);
 if (!expandedSections.has("Data")) {
 toggleSectionExpansion("Data");
 }
 }}
 className={`relative bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] rounded-xl p-4 text-left transition-all duration-200 overflow-hidden ${
 dataStatusFilter === null
 ? 'border-2 border-[var(--primary)] bg-[var(--primary)]/10'
 : `border-[var(--border)] ${isV6 ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent" : "hover:border-[var(--primary)] hover:scale-[1.01]"}`
 }`}
 >
 {/* Left Accent Line */}
 {!isV6 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[var(--primary)]  rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />}
 
 <div className="flex items-center justify-between mb-2">
 <div className="w-9 h-9 bg-[var(--primary)]/10 /10 rounded-lg flex items-center justify-center">
 <Database className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 </div>
 <span className="text-3xl font-bold text-[var(--foreground)] ">{databaseData.length}</span>
 </div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]">Total</h4>
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* SECTION 1: SERVICES */}
 {selectedSections.has("Services") && (
 <div className="mb-8 scroll-mt-[240px]" id="services">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl">
 <div
 className="flex items-center gap-2 p-6 cursor-pointer hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] transition-colors border-b border-[var(--border)] "
 onClick={() => toggleSectionExpansion("Services")}
 >
 <Cloud className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Services</h2>
 {servicesStatusFilter && (
 <span className="text-sm text-[var(--muted-foreground)]">
 (Filtered: {servicesStatusFilter === "degraded" ? "Degraded/Warning" : servicesStatusFilter})
 </span>
 )}
 <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors ml-2">
 {expandedSections.has("Services") ? (
 <ChevronUp size={20} />
 ) : (
 <ChevronDown size={20} />
 )}
 </button>
 </div>
 
 {expandedSections.has("Services") && (
 <div className="p-6">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {filteredServicesData.map((service) => {
 const getServiceIcon = (name: string) => {
 switch (name) {
 case "Conductor": return Cloud;
 case "Gateway": return Zap;
 case "Host Adapter": return Box;
 case "Work": return Boxes;
 case "Scan": return Scan;
 case "Storage": return Archive;
 case "Item": return Package;
 case "Inventory": return ShoppingCart;
 default: return Server;
 }
 };
 const ServiceIcon = getServiceIcon(service.name);
 const getServiceIconName = (name: string) => {
 switch (name) {
 case "Conductor": return "Cloud";
 case "Gateway": return "Zap";
 case "Host Adapter": return "Box";
 case "Work": return "Boxes";
 case "Scan": return "Scan";
 case "Storage": return "Archive";
 case "Item": return "Package";
 case "Inventory": return "ShoppingCart";
 default: return "Server";
 }
 };
 const tileId = `health-service-${service.name.toLowerCase().replace(/\s+/g, '-')}`;

 return (
 <div
 key={service.name}
 className={`border rounded-lg p-4 ${getStatusBgColor(service.status)} hover:scale-105 transition-transform cursor-pointer text-left w-full relative`}
 >
 <div
 onClick={() => {
 setSelectedService(service.name);
 setSelectedDatabase(null); // Close database panel if open
 }}
 className="flex-1"
 >
 <div className="flex items-start justify-between mb-3">
 <div className="flex items-center gap-2">
 <ServiceIcon size={16} className={getStatusColor(service.status)} />
 <h3 className="font-medium text-sm text-[var(--foreground)] ">{service.name}</h3>
 </div>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-[var(--state-success)]' : service.status === 'degraded' || service.status === 'warning' ? 'bg-[var(--state-warning)]' : 'bg-[var(--state-error)]'} animate-pulse`} />
 <button
 onClick={(e) => {
 e.stopPropagation();
 handleBookmarkTile(e, tileId, service.name, "services", service.status, getServiceIconName(service.name), { uptime: service.uptime, responseTime: service.responseTime, version: service.version });
 }}
 className={`p-1 rounded transition-colors ${getStatusColor(service.status)} hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]`}
 title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={12} />
 </button>
 </div>
 </div>
 <div className="space-y-2">
 <div className="flex justify-between text-xs">
 <span className="text-[var(--muted-foreground)]">Status</span>
 <span className={`font-medium capitalize ${getStatusColor(service.status)}`}>{service.status}</span>
 </div>
 <div className="flex justify-between text-xs">
 <span className="text-[var(--muted-foreground)]">Version</span>
 <span className="font-medium text-[var(--foreground)] ">{service.version}</span>
 </div>
 <div className="flex justify-between text-xs">
 <span className="text-[var(--muted-foreground)]">Uptime</span>
 <span className="font-medium text-[var(--foreground)] ">{service.uptime}</span>
 </div>
 <div className="flex justify-between text-xs">
 <span className="text-[var(--muted-foreground)]">Response</span>
 <span className="font-medium text-[var(--foreground)] ">{service.responseTime}</span>
 </div>
 <div className="flex justify-between text-xs">
 <span className="text-[var(--muted-foreground)]">Last Check</span>
 <span className="font-medium text-[var(--foreground)] ">{service.lastCheck}</span>
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 {filteredServicesData.length === 0 && (
 <div className="text-center py-8 text-[var(--muted-foreground)]">
 No services match the current filter
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 )}

 {/* SECTION 2: SERVERS */}
 {selectedSections.has("Servers") && (
 <div className="mb-8 scroll-mt-[240px]" id="servers">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl">
 <div
 className="flex items-center gap-2 p-6 cursor-pointer hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] transition-colors border-b border-[var(--border)] "
 onClick={() => toggleSectionExpansion("Servers")}
 >
 <Server className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Servers</h2>
 {serversStatusFilter && (
 <span className="text-sm text-[var(--muted-foreground)]">
 (Filtered: {serversStatusFilter === "degraded" ? "Degraded/Warning" : serversStatusFilter})
 </span>
 )}
 <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors ml-2">
 {expandedSections.has("Servers") ? (
 <ChevronUp size={20} />
 ) : (
 <ChevronDown size={20} />
 )}
 </button>
 </div>
 
        {expandedSections.has("Servers") && (
          <div className="overflow-hidden">
            <MasterTableContainer type="display">
              <MasterTable type="display">
                <MasterTableHead type="display">
                  <tr>
                    <MasterTableTh type="display">Server</MasterTableTh>
                    <MasterTableTh type="display">Environment</MasterTableTh>
                    <MasterTableTh type="display">Status</MasterTableTh>
                    <MasterTableTh type="display">Uptime</MasterTableTh>
                    <MasterTableTh type="display">CPU</MasterTableTh>
                    <MasterTableTh type="display">Memory</MasterTableTh>
                    <MasterTableTh type="display">Disk</MasterTableTh>
                    <MasterTableTh type="display">Last Reboot</MasterTableTh>
                  </tr>
                </MasterTableHead>
                <MasterTableBody type="display">
                  {filteredServersData.map((server, index) => (
                    <MasterTableRow key={index} type="display">
                      <MasterTableCell type="display" className="font-medium">{server.computerName}</MasterTableCell>
                      <MasterTableCell type="display">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          server.environment === "Production" 
                            ? "bg-[var(--state-info)]/10 text-[var(--state-info)] border border-[var(--state-info)]/40/20" 
                            : "bg-[var(--state-warning)]/10 text-[var(--state-warning)] border border-[var(--state-warning)]/40/20"
                        }`}>
                          {server.environment}
                        </span>
                      </MasterTableCell>
                      <MasterTableCell type="display">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            server.status === 'healthy' ? 'bg-[var(--state-success)]' : 
                            server.status === 'degraded' ? 'bg-[var(--state-warning)]' : 
                            'bg-[var(--state-error)]'
                          } animate-pulse`} />
                          <span className={getStatusColor(server.status) + " font-medium capitalize"}>
                            {server.status}
                          </span>
                        </div>
                      </MasterTableCell>
                      <MasterTableCell type="display" className="text-[var(--muted-foreground)]">{server.uptime}</MasterTableCell>
                      <MasterTableCell type="display">
                        {server.cpu > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[100px]">
                              <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    server.cpu < 60 ? 'bg-[var(--state-success)]' :
                                    server.cpu < 80 ? 'bg-[var(--state-warning)]' :
                                    'bg-[var(--state-error)]'
                                  }`}
                                  style={{ width: `${server.cpu}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-[var(--foreground)]  font-medium w-10">{server.cpu}%</span>
                          </div>
                        ) : (
                          <span className="text-[var(--muted-foreground)] text-xs">-</span>
                        )}
                      </MasterTableCell>
                      <MasterTableCell type="display">
                        {server.memory > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[100px]">
                              <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    server.memory < 70 ? 'bg-[var(--state-success)]' :
                                    server.memory < 85 ? 'bg-[var(--state-warning)]' :
                                    'bg-[var(--state-error)]'
                                  }`}
                                  style={{ width: `${server.memory}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-[var(--foreground)]  font-medium w-10">{server.memory}%</span>
                          </div>
                        ) : (
                          <span className="text-[var(--muted-foreground)] text-xs">-</span>
                        )}
                      </MasterTableCell>
                      <MasterTableCell type="display">
                        {server.disk > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[100px]">
                              <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    server.disk < 60 ? 'bg-[var(--state-success)]' :
                                    server.disk < 80 ? 'bg-[var(--state-warning)]' :
                                    'bg-[var(--state-error)]'
                                  }`}
                                  style={{ width: `${server.disk}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-[var(--foreground)]  font-medium w-10">{server.disk}%</span>
                          </div>
                        ) : (
                          <span className="text-[var(--muted-foreground)] text-xs">-</span>
                        )}
                      </MasterTableCell>
                      <MasterTableCell type="display" className="text-[var(--muted-foreground)]">{server.lastReboot}</MasterTableCell>
                    </MasterTableRow>
                  ))}
                  {filteredServersData.length === 0 && (
                    <MasterTableEmptyRow colSpan={8}>
                      No servers match the current filter
                    </MasterTableEmptyRow>
                  )}
                </MasterTableBody>
              </MasterTable>
            </MasterTableContainer>
          </div>
        )}
      </div>
    </div>
  )}

 {/* SECTION 3: DATA */}
 {selectedSections.has("Data") && (
 <div className="mb-8 scroll-mt-[240px]" id="databases">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl">
 <div
 className="flex items-center gap-2 p-6 cursor-pointer hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] transition-colors border-b border-[var(--border)] "
 onClick={() => toggleSectionExpansion("Data")}
 >
 <Database className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Data</h2>
 {dataStatusFilter && (
 <span className="text-sm text-[var(--muted-foreground)]">
 (Filtered: {dataStatusFilter === "degraded" ? "Degraded/Warning" : dataStatusFilter})
 </span>
 )}
 <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors ml-2">
 {expandedSections.has("Data") ? (
 <ChevronUp size={20} />
 ) : (
 <ChevronDown size={20} />
 )}
 </button>
 </div>
 
 {expandedSections.has("Data") && (
 <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
 {filteredDatabaseData.map((db, index) => {
 const tileId = `health-database-${db.computerName.toLowerCase().replace(/\s+/g, '-')}`;
 return (
 <div
 key={index}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border rounded-lg p-6 cursor-pointer hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-colors ${getStatusBgColor(db.status)}`}
 >
 <div
 onClick={() => {
 setSelectedDatabase({ name: db.name, type: db.type, computerName: db.computerName, dataType: db.dataType });
 setSelectedService(null); // Close service panel if open
 }}
 >
 <div className="flex items-start justify-between mb-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <Database size={20} className={getStatusColor(db.status)} />
 <h3 className="font-bold text-lg text-[var(--foreground)] ">{db.computerName}</h3>
 <span className="text-xs font-medium text-[var(--muted-foreground)]">({db.dataType})</span>
 </div>
 <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
 db.type === "Production"
 ? "bg-[var(--state-info)]/10 text-[var(--state-info)] border border-[var(--state-info)]/40/20"
 : "bg-[var(--state-warning)]/10 text-[var(--state-warning)] border border-[var(--state-warning)]/40/20"
 }`}>
 {db.type}
 </span>
 </div>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${
 db.status === 'healthy' ? 'bg-[var(--state-success)]' :
 db.status === 'warning' ? 'bg-[var(--state-warning)]' :
 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={getStatusColor(db.status) + " text-sm font-medium capitalize"}>
 {db.status}
 </span>
 <button
 onClick={(e) => {
 e.stopPropagation();
 handleBookmarkTile(e, tileId, db.computerName, "databases", db.status, "Database", { name: db.name, type: db.type, dataType: db.dataType, connections: db.connections, maxConnections: db.maxConnections, size: db.size });
 }}
 className={`p-1 rounded transition-colors ${getStatusColor(db.status)} hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]`}
 title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
 >
 <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={16} />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Connections</p>
 <p className="text-sm font-bold text-[var(--foreground)] ">
 {db.connections} / {db.maxConnections}
 </p>
 <div className="w-full h-2 bg-[var(--surface-container)] dark:bg-[var(--surface-container-high)] rounded-full overflow-hidden mt-2">
 <div
 className={`h-full ${
 (db.connections / db.maxConnections) * 100 < 60 ? 'bg-[var(--state-success)]' :
 (db.connections / db.maxConnections) * 100 < 80 ? 'bg-[var(--state-warning)]' :
 'bg-[var(--state-error)]'
 }`}
 style={{ width: `${(db.connections / db.maxConnections) * 100}%` }}
 />
 </div>
 </div>

 <div>
 <p className="text-xs text-[var(--muted-foreground)] mb-1">
 {db.dataType === 'RabbitMQ' ? 'Avg Latency' : 'Avg Query Time'}
 </p>
 <p className="text-sm font-bold text-[var(--foreground)] ">{db.queryTime}</p>
 </div>

 <div>
 <p className="text-xs text-[var(--muted-foreground)] mb-1">
 {db.dataType === 'RabbitMQ' ? 'Messages/min' : 'Transactions'}
 </p>
 <p className="text-sm font-bold text-[var(--foreground)] ">{db.transactions}</p>
 </div>

 <div>
 <p className="text-xs text-[var(--muted-foreground)] mb-1">
 {db.dataType === 'RabbitMQ' ? 'Queued Messages' : 'Database Size'}
 </p>
 <p className="text-sm font-bold text-[var(--foreground)] ">{db.size}</p>
 </div>

 <div className="col-span-2">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">
 {db.dataType === 'RabbitMQ' ? 'Active Channels' : 'Growth Rate'}
 </p>
 <div className="flex items-center gap-2">
 <TrendingUp size={14} className="text-[var(--muted-foreground)]" />
 <p className="text-sm font-bold text-[var(--foreground)] ">{db.growth}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
 })}
 {filteredDatabaseData.length === 0 && (
 <div className="col-span-2 text-center py-8 text-[var(--muted-foreground)]">
 No databases match the current filter
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 )}

 {/* SECTION 4: CAMUNDA */}
 {selectedSections.has("Camunda") && (
 <div className="mb-8">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)]  rounded-xl">
 <div
 className="flex items-center gap-2 p-6 cursor-pointer hover:bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)] transition-colors border-b border-[var(--border)] "
 onClick={() => toggleSectionExpansion("Camunda")}
 >
 <Zap className="text-[var(--primary)] dark:text-[var(--primary)]" size={20} />
 <h2 className="text-2xl font-bold text-[var(--foreground)] ">Camunda</h2>
 <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:hover:text-[var(--foreground)] transition-colors ml-2">
 {expandedSections.has("Camunda") ? (
 <ChevronUp size={20} />
 ) : (
 <ChevronDown size={20} />
 )}
 </button>
 </div>
 
 {expandedSections.has("Camunda") && (
 <div className="p-6 grid grid-cols-1 gap-6">
 {camundaData.map((camunda, index) => (
 <div
 key={index}
 className={`bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] border rounded-lg p-6 ${getStatusBgColor(camunda.status)}`}
 >
 <div className="flex items-start justify-between mb-6">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <Zap size={20} className={getStatusColor(camunda.status)} />
 <h3 className="font-bold text-lg text-[var(--foreground)] ">Camunda</h3>
 </div>
 <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
 camunda.environment === "Production" 
 ? "bg-[var(--state-info)]/10 text-[var(--state-info)] border border-[var(--state-info)]/40/20" 
 : "bg-[var(--state-warning)]/10 text-[var(--state-warning)] border border-[var(--state-warning)]/40/20"
 }`}>
 {camunda.environment}
 </span>
 </div>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${
 camunda.status === 'healthy' ? 'bg-[var(--state-success)]' : 
 'bg-[var(--state-error)]'
 } animate-pulse`} />
 <span className={getStatusColor(camunda.status) + " text-sm font-medium capitalize"}>
 {camunda.status}
 </span>
 </div>
 </div>

 {/* Summary Stats */}
 <div className="grid grid-cols-3 gap-4 mb-6">
 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Open Incidents</p>
 <p className="text-2xl font-bold text-[var(--foreground)] ">
 {camunda.openIncidents}
 </p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Open Human Tasks</p>
 <p className="text-2xl font-bold text-[var(--foreground)] ">{camunda.openHumanTasks}</p>
 </div>

 <div className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <p className="text-xs text-[var(--muted-foreground)] mb-1">Total Process Instances</p>
 <p className="text-2xl font-bold text-[var(--foreground)] ">
 {camunda.runningProcessInstances.reduce((sum, p) => sum + p.count, 0)}
 </p>
 </div>
 </div>

 {/* Running Process Instances */}
 <div>
 <h4 className="text-sm font-semibold text-[var(--foreground)]  mb-3">Running Process Instances</h4>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
 {camunda.runningProcessInstances.map((process, idx) => (
 <div key={idx} className="bg-[var(--surface-container)] text-[var(--foreground)] border-[var(--border)] rounded-lg p-4">
 <div className="flex items-center justify-between mb-2">
 <p className="text-xs text-[var(--muted-foreground)] font-mono">
 {process.processType}
 </p>
 </div>
 <div className="flex items-baseline gap-2">
 <p className="text-xl font-bold text-[var(--foreground)] ">{process.count}</p>
 <p className="text-xs text-[var(--muted-foreground)]">instances</p>
 </div>
 <p className="text-xs text-[var(--muted-foreground)] mt-1">
 Avg: {process.avgDuration}
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )}
 
 {/* Service Detail Panel */}
 {selectedService && (
 <ServiceDetailPanel
 serviceName={selectedService}
 onClose={() => setSelectedService(null)}
 />
 )}

 {/* Database Detail Panel */}
 {selectedDatabase && (
 <DatabaseDetailPanel
 dbName={selectedDatabase.name}
 dbType={selectedDatabase.type}
 computerName={selectedDatabase.computerName}
 dataType={selectedDatabase.dataType}
 onClose={() => setSelectedDatabase(null)}
 />
 )}
 </div>
 </div>
 );
}