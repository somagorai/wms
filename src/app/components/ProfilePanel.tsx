import { X, Moon, Sun, Eye, EyeOff, Check, ChevronsUpDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  
  // Form state
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timezoneSearch, setTimezoneSearch] = useState('');
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  
  // Get all timezones
  const allTimezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf('timeZone');
    } catch {
      // Fallback for browsers that don't support this API
      return [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/Anchorage',
        'Pacific/Honolulu',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Europe/Rome',
        'Europe/Madrid',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Asia/Hong_Kong',
        'Asia/Singapore',
        'Asia/Dubai',
        'Australia/Sydney',
        'Australia/Melbourne',
        'Pacific/Auckland',
      ];
    }
  }, []);
  
  // Filter timezones based on search
  const filteredTimezones = useMemo(() => {
    if (!timezoneSearch) return allTimezones;
    const search = timezoneSearch.toLowerCase();
    return allTimezones.filter(tz => tz.toLowerCase().includes(search));
  }, [allTimezones, timezoneSearch]);
  
  const handleSave = () => {
    // Validate password match
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Validate password length if provided
    if (password && password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    // Save logic here (would connect to backend)
    toast.success('Profile updated successfully');
    
    // Clear password fields after save
    setPassword('');
    setConfirmPassword('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* User Info */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-medium">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-zinc-900 dark:text-white">{firstName} {lastName}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{user?.username || 'user@example.com'}</p>
              </div>
            </div>
          </div>
          
          {/* Editable Profile Fields */}
          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Personal Information</h3>
            
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] transition-all"
                placeholder="Enter first name"
              />
            </div>
            
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] transition-all"
                placeholder="Enter last name"
              />
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] transition-all"
                  placeholder="Leave blank to keep current"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && password.length < 8 && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] transition-all"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            
            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Timezone
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                  className="w-full px-3 py-2 pr-10 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-[#0d9488] dark:focus:ring-[#50e080] transition-all"
                >
                  {timezone}
                </button>
                <ChevronsUpDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                
                {/* Timezone Dropdown */}
                {showTimezoneDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg max-h-60 flex flex-col">
                    {/* Search */}
                    <div className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                      <input
                        type="text"
                        value={timezoneSearch}
                        onChange={(e) => setTimezoneSearch(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0d9488] dark:focus:ring-[#50e080]"
                        placeholder="Search timezone..."
                      />
                    </div>
                    
                    {/* Timezone List */}
                    <div className="overflow-y-auto">
                      {filteredTimezones.length > 0 ? (
                        filteredTimezones.map((tz) => (
                          <button
                            key={tz}
                            onClick={() => {
                              setTimezone(tz);
                              setShowTimezoneDropdown(false);
                              setTimezoneSearch('');
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-between"
                          >
                            <span>{tz}</span>
                            {timezone === tz && <Check size={16} className="text-[#0d9488] dark:text-[#50e080]" />}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                          No timezones found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-[#0d9488] dark:bg-[#50e080] hover:bg-[#0b7a70] dark:hover:bg-[#3bc76a] text-white rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>

          {/* Theme Settings */}
          <div className="mb-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Appearance</h3>
            <div className="space-y-2">
              <button
                onClick={() => setTheme('light')}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  theme === 'light'
                    ? 'bg-[#0d9488] border-[#0d9488] text-white'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:border-[#0d9488]'
                }`}
              >
                <Sun size={20} className={theme === 'light' ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'} />
                <div className="flex-1 text-left">
                  <p className="font-medium">Light Theme</p>
                  <p className={`text-sm ${theme === 'light' ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    Clean and bright interface
                  </p>
                </div>
                {theme === 'light' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  theme === 'dark'
                    ? 'bg-[#50e080] border-[#50e080] text-white'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:border-[#50e080]'
                }`}
              >
                <Moon size={20} className={theme === 'dark' ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'} />
                <div className="flex-1 text-left">
                  <p className="font-medium">Dark Theme</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    Easy on the eyes
                  </p>
                </div>
                {theme === 'dark' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Additional Settings Placeholder */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-zinc-600 dark:text-zinc-400">Email</label>
                <p className="text-zinc-900 dark:text-white mt-1">john@example.com</p>
              </div>
              <div>
                <label className="text-zinc-600 dark:text-zinc-400">Role</label>
                <p className="text-zinc-900 dark:text-white mt-1">Warehouse Manager</p>
              </div>
              <div>
                <label className="text-zinc-600 dark:text-zinc-400">Department</label>
                <p className="text-zinc-900 dark:text-white mt-1">Operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}