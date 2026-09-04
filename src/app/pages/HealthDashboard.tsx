import { Activity, AlertTriangle, CheckCircle2, TrendingUp, Server, Database, Cpu, HardDrive, Zap, Cloud, Box, Boxes, Scan, Archive, Package, ShoppingCart, BarChart3, ChevronUp, ChevronDown, Filter, X, Check, XCircle, ChevronRight, Home, Star } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { ServiceDetailPanel } from "../components/ServiceDetailPanel";
import { DatabaseDetailPanel } from "../components/DatabaseDetailPanel";
import { useBookmarks } from "../contexts/BookmarkContext";

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
        return "text-green-500";
      case "degraded":
      case "warning":
        return "text-yellow-500";
      case "down":
        return "text-red-500";
      default:
        return "text-zinc-400";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/10 border-green-500/20";
      case "degraded":
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "down":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-zinc-500/10 border-zinc-500/20";
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
    <div className={`p-8 transition-all duration-300 ${selectedService ? 'pr-[624px]' : selectedDatabase ? 'pr-[724px]' : ''}`}>
      {/* Sticky Header Section */}
      <div className="sticky top-0 bg-white dark:bg-zinc-900 z-40 pb-4 -mx-8 px-8 -mt-8 pt-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
          <Link to="/app/home" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors flex items-center gap-1">
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/app/navigation" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Navigation
          </Link>
          <ChevronRight size={14} />
          <Link to="/app/navigation?section=dashboards" className="hover:text-[#0d9488] dark:hover:text-[#50e080] transition-colors">
            Business Insights
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-900 dark:text-white font-medium">Monitoring Dashboard</span>
        </div>

        {/* Header */}
        <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Monitoring Dashboard</h1>
            <p className="text-zinc-600 dark:text-zinc-400">System health monitoring and performance metrics</p>
          </div>
          <div className="flex items-center gap-3 relative">
            {/* Filter Button */}
            <button
              onClick={() => {
                setShowFilterPanel(!showFilterPanel);
              }}
              onMouseEnter={() => setShowFilterTooltip(true)}
              onMouseLeave={() => setShowFilterTooltip(false)}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 border ${
                showFilterPanel || hasActiveFilters
                  ? "bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0f766e] dark:hover:bg-[#3bc76a] border-[#0d9488] dark:border-[#50e080]"
                  : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
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
              <div className="absolute top-full right-0 mt-2 z-50 w-72 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Active Filters</h4>
                    <span className="text-xs text-zinc-400">
                      {totalFilterCount} filter{totalFilterCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {selectedSections.size !== allSections.length && (
                    <div>
                      <p className="text-xs font-medium text-zinc-400 mb-1.5">Sections</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(selectedSections).map((section) => (
                          <span
                            key={section}
                            className="inline-flex items-center px-2 py-1 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs"
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

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mb-6 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-zinc-900 dark:text-white font-semibold">Filters</h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2 block">Sections</label>
              <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-h-[42px]">
                {/* Selected Items as Chips */}
                {selectedSections.size !== allSections.length && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {Array.from(selectedSections).map((section) => (
                      <span
                        key={section}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0d9488] dark:bg-[#50e080] text-white rounded text-xs font-medium"
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
                    className="w-full bg-transparent text-zinc-900 dark:text-zinc-300 text-sm placeholder-zinc-500 dark:placeholder-zinc-500 outline-none"
                  />
                  {/* Dropdown Options */}
                  {activeDropdown === 'section' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10">
                      {allSections.filter(section => section.toLowerCase().includes(sectionSearch.toLowerCase())).map((section) => (
                        <button
                          key={section}
                          onClick={() => {
                            toggleSection(section);
                            setSectionSearch('');
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                            selectedSections.has(section)
                              ? 'bg-[#0d9488]/10 dark:bg-[#50e080]/10 text-[#0d9488] dark:text-[#50e080]'
                              : 'text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            selectedSections.has(section)
                              ? 'bg-[#0d9488] dark:bg-[#50e080] border-[#0d9488] dark:border-[#50e080]'
                              : 'border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {selectedSections.has(section) && <Check size={12} className="text-white" />}
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
      </div>
      </div>

      {/* Quick Health Overview - All Tiles at Top */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Quick Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Services Tiles */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                <Cloud className="text-white" size={18} />
              </div>
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide">Services</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setServicesStatusFilter(servicesStatusFilter === "healthy" ? null : "healthy");
                  if (!expandedSections.has("Services")) {
                    toggleSectionExpansion("Services");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  servicesStatusFilter === "healthy"
                    ? 'border-green-500 dark:border-green-400 ring-4 ring-green-500/30 shadow-green-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-green-400 dark:hover:border-green-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-green-500 dark:bg-green-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">{servicesHealthy}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Healthy</h4>
              </button>

              <button
                onClick={() => {
                  setServicesStatusFilter(servicesStatusFilter === "degraded" ? null : "degraded");
                  if (!expandedSections.has("Services")) {
                    toggleSectionExpansion("Services");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  servicesStatusFilter === "degraded"
                    ? 'border-yellow-500 dark:border-yellow-400 ring-4 ring-yellow-500/30 shadow-yellow-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-yellow-400 dark:hover:border-yellow-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-yellow-500 dark:bg-yellow-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{servicesDegraded}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Degraded</h4>
              </button>

              <button
                onClick={() => {
                  setServicesStatusFilter(servicesStatusFilter === "down" ? null : "down");
                  if (!expandedSections.has("Services")) {
                    toggleSectionExpansion("Services");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  servicesStatusFilter === "down"
                    ? 'border-red-500 dark:border-red-400 ring-4 ring-red-500/30 shadow-red-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-red-400 dark:hover:border-red-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-red-500 dark:bg-red-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <XCircle className="text-red-600 dark:text-red-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">{servicesDown}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Down</h4>
              </button>

              <button
                onClick={() => {
                  setServicesStatusFilter(null);
                  if (!expandedSections.has("Services")) {
                    toggleSectionExpansion("Services");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  servicesStatusFilter === null
                    ? 'border-[#0d9488] dark:border-[#50e080] ring-4 ring-[#0d9488]/30 dark:ring-[#50e080]/30 shadow-[#0d9488]/20 dark:shadow-[#50e080]/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080]'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[#0d9488] dark:bg-[#50e080] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                    <Cloud className="text-[#0d9488] dark:text-[#50e080]" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">{servicesData.length}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Total</h4>
              </button>
            </div>
          </div>

          {/* Servers Tiles */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center">
                <Server className="text-white" size={18} />
              </div>
              <h3 className="text-base font-bold text-purple-900 dark:text-purple-100 uppercase tracking-wide">Servers</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setServersStatusFilter(serversStatusFilter === "healthy" ? null : "healthy");
                  if (!expandedSections.has("Servers")) {
                    toggleSectionExpansion("Servers");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  serversStatusFilter === "healthy"
                    ? 'border-green-500 dark:border-green-400 ring-4 ring-green-500/30 shadow-green-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-green-400 dark:hover:border-green-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-green-500 dark:bg-green-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">{serversHealthy}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Healthy</h4>
              </button>

              <button
                onClick={() => {
                  setServersStatusFilter(serversStatusFilter === "degraded" ? null : "degraded");
                  if (!expandedSections.has("Servers")) {
                    toggleSectionExpansion("Servers");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  serversStatusFilter === "degraded"
                    ? 'border-yellow-500 dark:border-yellow-400 ring-4 ring-yellow-500/30 shadow-yellow-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-yellow-400 dark:hover:border-yellow-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-yellow-500 dark:bg-yellow-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{serversDegraded}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Degraded</h4>
              </button>

              <button
                onClick={() => {
                  setServersStatusFilter(serversStatusFilter === "down" ? null : "down");
                  if (!expandedSections.has("Servers")) {
                    toggleSectionExpansion("Servers");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  serversStatusFilter === "down"
                    ? 'border-red-500 dark:border-red-400 ring-4 ring-red-500/30 shadow-red-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-red-400 dark:hover:border-red-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-red-500 dark:bg-red-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <XCircle className="text-red-600 dark:text-red-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">{serversDown}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Down</h4>
              </button>

              <button
                onClick={() => {
                  setServersStatusFilter(null);
                  if (!expandedSections.has("Servers")) {
                    toggleSectionExpansion("Servers");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  serversStatusFilter === null
                    ? 'border-[#0d9488] dark:border-[#50e080] ring-4 ring-[#0d9488]/30 dark:ring-[#50e080]/30 shadow-[#0d9488]/20 dark:shadow-[#50e080]/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080]'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[#0d9488] dark:bg-[#50e080] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                    <Server className="text-[#0d9488] dark:text-[#50e080]" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">{serversData.length}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Total</h4>
              </button>
            </div>
          </div>

          {/* Data Tiles */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-lg flex items-center justify-center">
                <Database className="text-white" size={18} />
              </div>
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-wide">Data</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setDataStatusFilter(dataStatusFilter === "healthy" ? null : "healthy");
                  if (!expandedSections.has("Data")) {
                    toggleSectionExpansion("Data");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  dataStatusFilter === "healthy"
                    ? 'border-green-500 dark:border-green-400 ring-4 ring-green-500/30 shadow-green-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-green-400 dark:hover:border-green-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-green-500 dark:bg-green-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">{dbHealthy}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Healthy</h4>
              </button>

              <button
                onClick={() => {
                  setDataStatusFilter(dataStatusFilter === "degraded" ? null : "degraded");
                  if (!expandedSections.has("Data")) {
                    toggleSectionExpansion("Data");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  dataStatusFilter === "degraded"
                    ? 'border-yellow-500 dark:border-yellow-400 ring-4 ring-yellow-500/30 shadow-yellow-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-yellow-400 dark:hover:border-yellow-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-yellow-500 dark:bg-yellow-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{dbDegraded}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Degraded</h4>
              </button>

              <button
                onClick={() => {
                  setDataStatusFilter(dataStatusFilter === "down" ? null : "down");
                  if (!expandedSections.has("Data")) {
                    toggleSectionExpansion("Data");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  dataStatusFilter === "down"
                    ? 'border-red-500 dark:border-red-400 ring-4 ring-red-500/30 shadow-red-500/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-red-400 dark:hover:border-red-500'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-red-500 dark:bg-red-400 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <XCircle className="text-red-600 dark:text-red-400" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">{dbDown}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Down</h4>
              </button>

              <button
                onClick={() => {
                  setDataStatusFilter(null);
                  if (!expandedSections.has("Data")) {
                    toggleSectionExpansion("Data");
                  }
                }}
                className={`relative bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg overflow-hidden group ${
                  dataStatusFilter === null
                    ? 'border-[#0d9488] dark:border-[#50e080] ring-4 ring-[#0d9488]/30 dark:ring-[#50e080]/30 shadow-[#0d9488]/20 dark:shadow-[#50e080]/20 shadow-lg'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-[#0d9488] dark:hover:border-[#50e080]'
                }`}
              >
                {/* Left Accent Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-[#0d9488] dark:bg-[#50e080] rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:translate-y-0 group-hover:rounded-r-none" />
                
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-[#0d9488]/10 dark:bg-[#50e080]/10 rounded-lg flex items-center justify-center">
                    <Database className="text-[#0d9488] dark:text-[#50e080]" size={20} />
                  </div>
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">{databaseData.length}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Total</h4>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: SERVICES */}
      {selectedSections.has("Services") && (
        <div className="mb-8 scroll-mt-[240px]" id="services">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
            <div
              className="flex items-center gap-2 p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-300 dark:border-zinc-700"
              onClick={() => toggleSectionExpansion("Services")}
            >
              <Cloud className="text-[#0d9488] dark:text-[#50e080]" size={20} />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Services</h2>
              {servicesStatusFilter && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  (Filtered: {servicesStatusFilter === "degraded" ? "Degraded/Warning" : servicesStatusFilter})
                </span>
              )}
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
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
                          <h3 className="font-medium text-sm text-zinc-900 dark:text-white">{service.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-green-500' : service.status === 'degraded' || service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmarkTile(e, tileId, service.name, "services", service.status, getServiceIconName(service.name), { uptime: service.uptime, responseTime: service.responseTime, version: service.version });
                            }}
                            className={`p-1 rounded transition-colors ${getStatusColor(service.status)} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                            title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
                          >
                            <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">Status</span>
                          <span className={`font-medium capitalize ${getStatusColor(service.status)}`}>{service.status}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">Version</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{service.version}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">Uptime</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{service.uptime}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">Response</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{service.responseTime}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">Last Check</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{service.lastCheck}</span>
                        </div>
                      </div>
                      </div>
                    </div>
                  );
                })}
              </div>
                {filteredServicesData.length === 0 && (
                  <div className="text-center py-8 text-zinc-500">
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
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
            <div
              className="flex items-center gap-2 p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-300 dark:border-zinc-700"
              onClick={() => toggleSectionExpansion("Servers")}
            >
              <Server className="text-[#0d9488] dark:text-[#50e080]" size={20} />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Servers</h2>
              {serversStatusFilter && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  (Filtered: {serversStatusFilter === "degraded" ? "Degraded/Warning" : serversStatusFilter})
                </span>
              )}
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
                {expandedSections.has("Servers") ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>
            
            {expandedSections.has("Servers") && (
              <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">Server</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">Environment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">Uptime</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">CPU</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">Memory</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">Disk</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">Last Reboot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {filteredServersData.map((server, index) => (
                      <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{server.computerName}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            server.environment === "Production" 
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
                              : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                          }`}>
                            {server.environment}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              server.status === 'healthy' ? 'bg-green-500' : 
                              server.status === 'degraded' ? 'bg-yellow-500' : 
                              'bg-red-500'
                            } animate-pulse`} />
                            <span className={getStatusColor(server.status) + " font-medium capitalize"}>
                              {server.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">{server.uptime}</td>
                        <td className="px-6 py-4 text-sm">
                          {server.cpu > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 max-w-[100px]">
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      server.cpu < 60 ? 'bg-green-500' :
                                      server.cpu < 80 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${server.cpu}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-zinc-900 dark:text-white font-medium w-10">{server.cpu}%</span>
                            </div>
                          ) : (
                            <span className="text-zinc-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {server.memory > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 max-w-[100px]">
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      server.memory < 70 ? 'bg-green-500' :
                                      server.memory < 85 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${server.memory}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-zinc-900 dark:text-white font-medium w-10">{server.memory}%</span>
                            </div>
                          ) : (
                            <span className="text-zinc-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {server.disk > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 max-w-[100px]">
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      server.disk < 60 ? 'bg-green-500' :
                                      server.disk < 80 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${server.disk}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-zinc-900 dark:text-white font-medium w-10">{server.disk}%</span>
                            </div>
                          ) : (
                            <span className="text-zinc-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">{server.lastReboot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                {filteredServersData.length === 0 && (
                  <div className="text-center py-8 text-zinc-500">
                    No servers match the current filter
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: DATA */}
      {selectedSections.has("Data") && (
        <div className="mb-8 scroll-mt-[240px]" id="databases">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
            <div
              className="flex items-center gap-2 p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-300 dark:border-zinc-700"
              onClick={() => toggleSectionExpansion("Data")}
            >
              <Database className="text-[#0d9488] dark:text-[#50e080]" size={20} />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Data</h2>
              {dataStatusFilter && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  (Filtered: {dataStatusFilter === "degraded" ? "Degraded/Warning" : dataStatusFilter})
                </span>
              )}
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
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
                  className={`bg-white dark:bg-zinc-900 border rounded-lg p-6 cursor-pointer hover:border-[#0d9488] dark:hover:border-[#50e080] transition-colors ${getStatusBgColor(db.status)}`}
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
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{db.computerName}</h3>
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">({db.dataType})</span>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        db.type === "Production"
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                      }`}>
                        {db.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        db.status === 'healthy' ? 'bg-green-500' :
                        db.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      } animate-pulse`} />
                      <span className={getStatusColor(db.status) + " text-sm font-medium capitalize"}>
                        {db.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmarkTile(e, tileId, db.computerName, "databases", db.status, "Database", { name: db.name, type: db.type, dataType: db.dataType, connections: db.connections, maxConnections: db.maxConnections, size: db.size });
                        }}
                        className={`p-1 rounded transition-colors ${getStatusColor(db.status)} hover:bg-zinc-100 dark:hover:bg-zinc-800`}
                        title={isBookmarked(tileId) ? "Remove bookmark" : "Add bookmark"}
                      >
                        <Star className={`${isBookmarked(tileId) ? "fill-current" : ""}`} size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Connections</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {db.connections} / {db.maxConnections}
                      </p>
                      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full ${
                            (db.connections / db.maxConnections) * 100 < 60 ? 'bg-green-500' :
                            (db.connections / db.maxConnections) * 100 < 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(db.connections / db.maxConnections) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                        {db.dataType === 'RabbitMQ' ? 'Avg Latency' : 'Avg Query Time'}
                      </p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{db.queryTime}</p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                        {db.dataType === 'RabbitMQ' ? 'Messages/min' : 'Transactions'}
                      </p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{db.transactions}</p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                        {db.dataType === 'RabbitMQ' ? 'Queued Messages' : 'Database Size'}
                      </p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{db.size}</p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                        {db.dataType === 'RabbitMQ' ? 'Active Channels' : 'Growth Rate'}
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-zinc-500" />
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{db.growth}</p>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              );
            })}
                {filteredDatabaseData.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-zinc-500">
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
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
            <div
              className="flex items-center gap-2 p-6 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-300 dark:border-zinc-700"
              onClick={() => toggleSectionExpansion("Camunda")}
            >
              <Zap className="text-[#0d9488] dark:text-[#50e080]" size={20} />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Camunda</h2>
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2">
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
                  className={`bg-white dark:bg-zinc-900 border rounded-lg p-6 ${getStatusBgColor(camunda.status)}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={20} className={getStatusColor(camunda.status)} />
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Camunda</h3>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        camunda.environment === "Production" 
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
                          : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                      }`}>
                        {camunda.environment}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        camunda.status === 'healthy' ? 'bg-green-500' : 
                        'bg-red-500'
                      } animate-pulse`} />
                      <span className={getStatusColor(camunda.status) + " text-sm font-medium capitalize"}>
                        {camunda.status}
                      </span>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Open Incidents</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {camunda.openIncidents}
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Open Human Tasks</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">{camunda.openHumanTasks}</p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Total Process Instances</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {camunda.runningProcessInstances.reduce((sum, p) => sum + p.count, 0)}
                      </p>
                    </div>
                  </div>

                  {/* Running Process Instances */}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Running Process Instances</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {camunda.runningProcessInstances.map((process, idx) => (
                        <div key={idx} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                              {process.processType}
                            </p>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <p className="text-xl font-bold text-zinc-900 dark:text-white">{process.count}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">instances</p>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
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
  );
}