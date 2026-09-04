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
 <div className="fixed right-0 top-0 h-full w-96 bg-[var(--surface-container-high)] text-[var(--foreground)] border-l border-[var(--border)]  z-50 flex flex-col">
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-[var(--border)] ">
 <h2 className="text-xl font-semibold text-[var(--foreground)] ">Profile Settings</h2>
 <button
 onClick={onClose}
 className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]  dark:hover:text-[var(--foreground)] transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-6">
 {/* User Info */}
 <div className="mb-8">
 <div className="flex items-center gap-4 mb-4">
 <div className="w-16 h-16 rounded-full flex items-center justify-center">
 <span className="text-[var(--foreground)] text-xl font-medium">
 {firstName.charAt(0)}{lastName.charAt(0)}
 </span>
 </div>
 <div>
 <p className="text-lg font-medium text-[var(--foreground)] ">{firstName} {lastName}</p>
 <p className="text-sm text-[var(--muted-foreground)]">{user?.username || 'user@example.com'}</p>
 </div>
 </div>
 </div>
 
 {/* Editable Profile Fields */}
 <div className="mb-6 space-y-4">
 <h3 className="text-sm font-medium text-[var(--foreground)]  mb-3">Personal Information</h3>
 
 {/* First Name */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
 First Name
 </label>
 <input
 type="text"
 value={firstName}
 onChange={(e) => setFirstName(e.target.value)}
 className="w-full px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)] transition-all"
 placeholder="Enter first name"
 />
 </div>
 
 {/* Last Name */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
 Last Name
 </label>
 <input
 type="text"
 value={lastName}
 onChange={(e) => setLastName(e.target.value)}
 className="w-full px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)] transition-all"
 placeholder="Enter last name"
 />
 </div>
 
 {/* Password */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
 New Password
 </label>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full px-3 py-2 pr-10 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)] transition-all"
 placeholder="Leave blank to keep current"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]  dark:hover:text-[var(--foreground)]"
 >
 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
 </button>
 </div>
 {password && password.length < 8 && (
 <p className="text-xs text-[var(--state-error)] mt-1">Password must be at least 8 characters</p>
 )}
 </div>
 
 {/* Confirm Password */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
 Confirm Password
 </label>
 <div className="relative">
 <input
 type={showConfirmPassword ? "text" : "password"}
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 className="w-full px-3 py-2 pr-10 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)] transition-all"
 placeholder="Confirm new password"
 />
 <button
 type="button"
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]  dark:hover:text-[var(--foreground)]"
 >
 {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
 </button>
 </div>
 {password && confirmPassword && password !== confirmPassword && (
 <p className="text-xs text-[var(--state-error)] mt-1">Passwords do not match</p>
 )}
 </div>
 
 {/* Timezone */}
 <div>
 <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
 Timezone
 </label>
 <div className="relative">
 <button
 type="button"
 onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
 className="w-full px-3 py-2 pr-10 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg text-[var(--foreground)]  text-left focus:outline-none focus: focus:)] dark:focus:)] transition-all"
 >
 {timezone}
 </button>
 <ChevronsUpDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
 
 {/* Timezone Dropdown */}
 {showTimezoneDropdown && (
 <div className="absolute z-10 w-full mt-1 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded-lg max-h-60 flex flex-col">
 {/* Search */}
 <div className="p-2 border-b border-[var(--border)] ">
 <input
 type="text"
 value={timezoneSearch}
 onChange={(e) => setTimezoneSearch(e.target.value)}
 className="w-full px-3 py-2 bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border border-[var(--border)]  rounded text-sm text-[var(--foreground)]  focus:outline-none focus: focus:)] dark:focus:)]"
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
 className="w-full px-3 py-2 text-left text-sm text-[var(--foreground)]  hover:bg-[var(--surface-container-low)] dark:hover:bg-[var(--surface-container-high)] transition-colors flex items-center justify-between"
 >
 <span>{tz}</span>
 {timezone === tz && <Check size={16} className="text-[var(--primary)] dark:text-[var(--primary)]" />}
 </button>
 ))
 ) : (
 <div className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
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
 className="w-full px-4 py-2 bg-[var(--primary)]  hover:opacity-90 active:scale-[0.98] text-[var(--primary-foreground)] rounded-lg font-medium transition-colors"
 >
 Save Changes
 </button>
 </div>

 {/* Theme Settings */}
 <div className="mb-6 pt-4 border-t border-[var(--border)] ">
 <h3 className="text-sm font-medium text-[var(--foreground)]  mb-3">Appearance</h3>
 <div className="space-y-2">
 <button
 onClick={() => setTheme('light')}
 className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
 theme === 'light'
 ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]'
 : 'bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] hover:border-[var(--primary)]'
 }`}
 >
 <Sun size={20} className={theme === 'light' ? 'text-white' : 'text-[var(--muted-foreground)]'} />
 <div className="flex-1 text-left">
 <p className="font-medium">Light Theme</p>
 <p className={`text-sm ${theme === 'light' ? 'text-[var(--muted-foreground)]' : 'text-[var(--muted-foreground)]'}`}>
 Clean and bright interface
 </p>
 </div>
 {theme === 'light' && (
 <div className="w-2 h-2 bg-[var(--surface-container-lowest)] rounded-full" />
 )}
 </button>

 <button
 onClick={() => setTheme('dark')}
 className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
 theme === 'dark'
 ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]'
 : 'bg-[var(--surface-container)] text-[var(--foreground)] border border-[var(--border)] border-[var(--border)]  text-[var(--foreground)] hover:border-[var(--primary)]'
 }`}
 >
 <Moon size={20} className={theme === 'dark' ? 'text-white' : 'text-[var(--muted-foreground)]'} />
 <div className="flex-1 text-left">
 <p className="font-medium">Dark Theme</p>
 <p className={`text-sm ${theme === 'dark' ? 'text-[var(--muted-foreground)]' : 'text-[var(--muted-foreground)]'}`}>
 Easy on the eyes
 </p>
 </div>
 {theme === 'dark' && (
 <div className="w-2 h-2 bg-[var(--surface-container-lowest)] rounded-full" />
 )}
 </button>
 </div>
 </div>

 {/* Additional Settings Placeholder */}
 <div className="pt-4 border-t border-[var(--border)] ">
 <h3 className="text-sm font-medium text-[var(--foreground)]  mb-3">Account Information</h3>
 <div className="space-y-3 text-sm">
 <div>
 <label className="text-[var(--muted-foreground)]">Email</label>
 <p className="text-[var(--foreground)]  mt-1">john@example.com</p>
 </div>
 <div>
 <label className="text-[var(--muted-foreground)]">Role</label>
 <p className="text-[var(--foreground)]  mt-1">Warehouse Manager</p>
 </div>
 <div>
 <label className="text-[var(--muted-foreground)]">Department</label>
 <p className="text-[var(--foreground)]  mt-1">Operations</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </>
 );
}