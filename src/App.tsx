/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  TrendingUp,
  Lock,
  Unlock,
  CreditCard,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  PlusCircle,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  User,
  LogIn,
  LogOut,
  Fingerprint,
  Activity,
  GitBranch,
  Zap,
  Globe,
  Sliders,
  Check,
  Play,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Users,
  Settings,
  Server,
  Layers,
  Bell,
  Search,
  Filter,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  FileText,
  Sparkles,
  Menu,
  Maximize2,
  Minimize2,
  AlertCircle,
  Trash2,
  Copy
} from 'lucide-react';

// ── Images & Visual Assets ─────────────────────────────────────────────
const LOGIN_CRYSTAL_IMAGE = '/src/assets/images/login_financial_crystal_1791527196459.jpg';
const AVATAR_CLIENT_IMAGE = '/src/assets/images/avatar_client_executive_1791527209455.jpg';
const AVATAR_ADMIN_IMAGE = '/src/assets/images/avatar_admin_officer_1791527220213.jpg';

// ── Types ──────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'safe' | 'flagged' | 'sweep';
  account: string;
}

interface BankAccount {
  id: string;
  name: string;
  number: string;
  balance: number;
  type: 'checking' | 'vault' | 'treasury';
  apy?: string;
  routing: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  title: string;
  company: string;
  avatarText: string;
  avatarImg: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  action?: {
    label: string;
    actionType: 'freeze' | 'transfer' | 'forecast';
  };
}

interface ThreatAlert {
  id: string;
  entity: string;
  amount: string;
  location: string;
  riskScore: number;
  status: 'HELD' | 'CLEARED' | 'FROZEN';
  time: string;
  ip: string;
}

interface ClientAccountKYC {
  id: string;
  company: string;
  contact: string;
  tier: string;
  status: 'VERIFIED' | 'REVIEW' | 'PENDING';
  balance: string;
  wiresAllowed: boolean;
  limit: string;
}

// ── Demo Profiles ──────────────────────────────────────────────────────
const DEMO_CLIENT_USER: UserProfile = {
  id: 'u-101',
  name: 'Alex Rivera',
  email: 'alex@sentinel.bank',
  role: 'user',
  title: 'Managing Director & Treasury Officer',
  company: 'Rivera Capital Partners',
  avatarText: 'AR',
  avatarImg: AVATAR_CLIENT_IMAGE
};

const DEMO_ADMIN_USER: UserProfile = {
  id: 'adm-901',
  name: 'Elena Vance',
  email: 'admin@sentinel.bank',
  role: 'admin',
  title: 'Chief Risk Officer & Network Supervisor',
  company: 'Sentinel Enterprise Risk Division',
  avatarText: 'EV',
  avatarImg: AVATAR_ADMIN_IMAGE
};

export default function App() {
  // ── Navigation & Auth State ──────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'dashboard' | 'admin'>('main');
  
  // Dashboard & Admin active tab
  const [clientActiveTab, setClientActiveTab] = useState<'overview' | 'accounts' | 'forecast' | 'analytics' | 'cards' | 'transactions' | 'automation' | 'assistant' | 'settings'>('overview');
  const [adminActiveTab, setAdminActiveTab] = useState<'overview' | 'fraud' | 'emergency' | 'accounts' | 'diagnostics' | 'audit'>('overview');
  
  // Sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Notifications dropdown
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState<string[]>([
    'Automated 5.20% APY vault sweep completed: +$802.53 credited.',
    'Berlin foreign draft held for security verification.',
    'System risk engine upgraded to model release 4.2.'
  ]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Synchronize route paths
  const navigateTo = (view: 'main' | 'login' | 'dashboard' | 'admin') => {
    if (view === 'dashboard' && currentUser?.role !== 'user') {
      setCurrentView('login');
      window.history.pushState(null, '', '/login');
      return;
    }
    if (view === 'admin' && currentUser?.role !== 'admin') {
      setCurrentView('login');
      window.history.pushState(null, '', '/login');
      return;
    }

    setCurrentView(view);
    const path = view === 'main' ? '/' : `/${view}`;
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/login') setCurrentView('login');
      else if (p === '/dashboard') {
        if (currentUser?.role === 'user') setCurrentView('dashboard');
        else setCurrentView('login');
      } else if (p === '/admin') {
        if (currentUser?.role === 'admin') setCurrentView('admin');
        else setCurrentView('login');
      } else {
        setCurrentView('main');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // ── Login Form State ─────────────────────────────────────────────────
  const [loginRoleTab, setLoginRoleTab] = useState<'user' | 'admin'>('user');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  // ── Banking Accounts & Balances ──────────────────────────────────────
  const [accounts, setAccounts] = useState<BankAccount[]>([
    { id: 'acc-1', name: 'Operating Checking', number: '•••• 4192', balance: 24850.0, type: 'checking', routing: '021000089' },
    { id: 'acc-2', name: 'High-Yield Vault', number: '•••• 8821', balance: 185200.0, type: 'vault', apy: '5.20% APY', routing: '021000089' },
    { id: 'acc-3', name: 'Treasury Reserve', number: '•••• 0114', balance: 450000.0, type: 'treasury', apy: '4.85% APY', routing: '021000089' }
  ]);

  // ── Transactions Ledger ──────────────────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-101', name: 'Cloud Infrastructure AWS', category: 'Cloud & SaaS', date: 'Today, 2:15 PM', amount: 1420.0, type: 'debit', status: 'safe', account: 'Operating Checking' },
    { id: 'tx-102', name: 'Berlin Merchant Draft', category: 'Foreign & Travel', date: 'Today, 11:02 AM', amount: 2850.0, type: 'debit', status: 'flagged', account: 'Operating Checking' },
    { id: 'tx-103', name: 'Monthly 5.20% APY Yield Payout', category: 'Sweeps & Yield', date: 'Yesterday', amount: 802.53, type: 'credit', status: 'sweep', account: 'High-Yield Vault' },
    { id: 'tx-104', name: 'Stripe Merchant Inbound', category: 'Revenue', date: 'Oct 07, 2026', amount: 12450.0, type: 'credit', status: 'safe', account: 'Operating Checking' },
    { id: 'tx-105', name: 'Figma Enterprise Subscription', category: 'Cloud & SaaS', date: 'Oct 05, 2026', amount: 360.0, type: 'debit', status: 'safe', account: 'Operating Checking' },
    { id: 'tx-106', name: 'Automated Checking Surplus Sweep', category: 'Sweeps & Yield', date: 'Oct 03, 2026', amount: 2500.0, type: 'credit', status: 'sweep', account: 'High-Yield Vault' }
  ]);

  const [txSearch, setTxSearch] = useState('');
  const [txCategoryFilter, setTxCategoryFilter] = useState('all');
  const [txSortOrder, setTxSortOrder] = useState<'desc' | 'asc'>('desc');

  // ── Transfer Modal State ─────────────────────────────────────────────
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFrom, setTransferFrom] = useState('acc-1');
  const [transferTo, setTransferTo] = useState('acc-2');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMemo, setTransferMemo] = useState('');
  const [transferError, setTransferError] = useState<string | null>(null);

  // ── Virtual Cards State ──────────────────────────────────────────────
  const [isPlatinumFrozen, setIsPlatinumFrozen] = useState(false);
  const [isBurnerFrozen, setIsBurnerFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [newCardLimit, setNewCardLimit] = useState('1000');
  const [newCardLabel, setNewCardLabel] = useState('SaaS Software Subscriptions');

  // ── Forecasting & APY State ──────────────────────────────────────────
  const [forecastHorizon, setForecastHorizon] = useState<'30' | '60' | '90'>('60');
  const [calcInitial, setCalcInitial] = useState(50000);
  const [calcMonthly, setCalcMonthly] = useState(2500);
  const [calcYears, setCalcYears] = useState(3);
  const [calcApy, setCalcApy] = useState(5.2);

  // ── Automation Rules State ───────────────────────────────────────────
  const [ruleSweepEnabled, setRuleSweepEnabled] = useState(true);
  const [ruleBufferEnabled, setRuleBufferEnabled] = useState(true);
  const [ruleGeoLockEnabled, setRuleGeoLockEnabled] = useState(true);
  const [isEditRuleModalOpen, setIsEditRuleModalOpen] = useState(false);
  const [sweepFloorAmount, setSweepFloorAmount] = useState('15000');

  // ── AI Assistant Chat State ──────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Good day, Alex. I am monitoring your treasury liquidity. All 3 accounts are verified, and $802.53 in yield settled into your High-Yield Vault. How may I assist your balance sheet today?',
      time: '10:00 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // ── Admin Command Center State ───────────────────────────────────────
  const [adminThreats, setAdminThreats] = useState<ThreatAlert[]>([
    {
      id: 'THR-8821',
      entity: 'Account #8821 (Berlin IP Draft)',
      amount: '$2,850.00',
      location: 'Berlin, DE · IP: 185.191.171.42',
      riskScore: 92,
      status: 'HELD',
      time: '11:02 AM',
      ip: '185.191.171.42'
    },
    {
      id: 'THR-1042',
      entity: 'Account #1042 (Rapid Velocity Spike)',
      amount: '$14,200.00',
      location: 'Tokyo, JP · IP: 133.242.18.91',
      riskScore: 84,
      status: 'HELD',
      time: '09:44 AM',
      ip: '133.242.18.91'
    },
    {
      id: 'THR-9104',
      entity: 'Card #9104 (Crypto Exchange Draft)',
      amount: '$6,400.00',
      location: 'Limassol, CY · IP: 91.200.12.5',
      riskScore: 78,
      status: 'HELD',
      time: '08:15 AM',
      ip: '91.200.12.5'
    }
  ]);

  const [activeThreatInvestigating, setActiveThreatInvestigating] = useState<ThreatAlert | null>(null);
  const [threatActionConfirmModal, setThreatActionConfirmModal] = useState<{
    threat: ThreatAlert;
    action: 'freeze' | 'authorize';
  } | null>(null);

  // Emergency killswitch state
  const [isGlobalWireFrozen, setIsGlobalWireFrozen] = useState(false);
  const [isAutomationShutdown, setIsAutomationShutdown] = useState(false);
  const [emergencyConfirmModal, setEmergencyConfirmModal] = useState<{
    type: 'wire' | 'automation';
  } | null>(null);

  // Accounts KYC Table State
  const [kycRoster, setKycRoster] = useState<ClientAccountKYC[]>([
    { id: 'KYC-01', company: 'Rivera Capital Partners', contact: 'Alex Rivera', tier: 'Tier 3 (Institutional)', status: 'VERIFIED', balance: '$660,050.00', wiresAllowed: true, limit: '$500,000 / day' },
    { id: 'KYC-02', company: 'Apex Logistics Global', contact: 'Marcus Thorne', tier: 'Tier 3 (Institutional)', status: 'VERIFIED', balance: '$2,410,000.00', wiresAllowed: true, limit: '$1,000,000 / day' },
    { id: 'KYC-03', company: 'Nova FinTech GmbH', contact: 'Katrin Weber', tier: 'Tier 2 (Corporate)', status: 'REVIEW', balance: '$189,400.00', wiresAllowed: false, limit: '$100,000 / day' },
    { id: 'KYC-04', company: 'Vertex Holdings Ltd', contact: 'Sarah Chen', tier: 'Tier 3 (Institutional)', status: 'VERIFIED', balance: '$8,140,000.00', wiresAllowed: true, limit: '$2,500,000 / day' }
  ]);
  const [kycSearch, setKycSearch] = useState('');

  // ── Public Homepage State ────────────────────────────────────────────
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeFlowNode, setActiveFlowNode] = useState(0);

  // ── Scroll Reveal Observer for Public Home ───────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentView]);

  // Scroll chat to bottom
  useEffect(() => {
    if (clientActiveTab === 'assistant' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAssistantThinking, clientActiveTab]);

  // ── AUTHENTICATION HANDLERS ──────────────────────────────────────────
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);

    setTimeout(() => {
      setIsSubmittingLogin(false);
      if (loginRoleTab === 'user') {
        setCurrentUser(DEMO_CLIENT_USER);
        navigateTo('dashboard');
        showToast('✓ Successfully authenticated as Alex Rivera (Client Portal).');
      } else {
        setCurrentUser(DEMO_ADMIN_USER);
        navigateTo('admin');
        showToast('✓ Enterprise security credentials authorized for Elena Vance (Admin).');
      }
    }, 600);
  };

  const handleQuickDemoLogin = (role: 'user' | 'admin') => {
    setLoginError(null);
    setIsSubmittingLogin(true);
    setTimeout(() => {
      setIsSubmittingLogin(false);
      if (role === 'user') {
        setCurrentUser(DEMO_CLIENT_USER);
        navigateTo('dashboard');
        showToast('✓ Logged in as Demo Client: Alex Rivera.');
      } else {
        setCurrentUser(DEMO_ADMIN_USER);
        navigateTo('admin');
        showToast('✓ Logged in as Demo Admin: Elena Vance.');
      }
    }, 400);
  };

  const handleBiometricLogin = () => {
    setIsBiometricScanning(true);
    setLoginError(null);
    setTimeout(() => {
      setIsBiometricScanning(false);
      if (loginRoleTab === 'admin') {
        setCurrentUser(DEMO_ADMIN_USER);
        navigateTo('admin');
        showToast('✓ Biometric passkey verified for Admin Console.');
      } else {
        setCurrentUser(DEMO_CLIENT_USER);
        navigateTo('dashboard');
        showToast('✓ Biometric passkey verified for Client Portal.');
      }
    }, 1200);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    navigateTo('main');
    showToast('You have securely signed out of Sentinel Banking.');
  };

  // ── TRANSFER EXECUTION ───────────────────────────────────────────────
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      setTransferError('Please enter a valid transfer amount greater than $0.00.');
      return;
    }

    if (transferFrom === transferTo) {
      setTransferError('Source and destination accounts must be different.');
      return;
    }

    const sourceAcc = accounts.find((a) => a.id === transferFrom);
    const destAcc = accounts.find((a) => a.id === transferTo);

    if (!sourceAcc || !destAcc) {
      setTransferError('Invalid account selection.');
      return;
    }

    if (amt > sourceAcc.balance) {
      setTransferError(`Insufficient funds in ${sourceAcc.name}. Available balance: $${sourceAcc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
      return;
    }

    // Execute transfer
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === sourceAcc.id) return { ...acc, balance: acc.balance - amt };
        if (acc.id === destAcc.id) return { ...acc, balance: acc.balance + amt };
        return acc;
      })
    );

    // Record transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      name: `Internal Transfer: ${sourceAcc.name} → ${destAcc.name}`,
      category: 'Sweeps & Yield',
      date: 'Just now',
      amount: amt,
      type: 'debit',
      status: 'sweep',
      account: sourceAcc.name
    };
    setTransactions((prev) => [newTx, ...prev]);

    setIsTransferModalOpen(false);
    setTransferAmount('');
    setTransferMemo('');
    showToast(`✓ $${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })} transferred from ${sourceAcc.name} to ${destAcc.name}.`);
  };

  // ── CSV EXPORT ───────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Merchant / Memo', 'Category', 'Date', 'Amount (USD)', 'Type', 'Status', 'Account'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      `"${tx.name.replace(/"/g, '""')}"`,
      tx.category,
      tx.date,
      tx.amount.toFixed(2),
      tx.type,
      tx.status,
      tx.account
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sentinel_Ledger_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Transaction ledger CSV downloaded successfully.');
  };

  // ── AI ASSISTANT PROMPT HANDLER ──────────────────────────────────────
  const handleSendPrompt = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAssistantThinking(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: {
            checkingBalance: accounts[0].balance,
            vaultBalance: accounts[1].balance,
            treasuryBalance: accounts[2].balance,
            flaggedCount: transactions.filter((t) => t.status === 'flagged').length
          }
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I've analyzed your treasury request and confirmed your balances remain protected.";

      let action: ChatMessage['action'] = undefined;
      const lower = query.toLowerCase();
      if (lower.includes('freeze') || lower.includes('card')) {
        action = { label: 'Confirm Freeze Card 8201', actionType: 'freeze' };
      } else if (lower.includes('transfer') || lower.includes('sweep')) {
        action = { label: 'Open Transfer Console', actionType: 'transfer' };
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // Voice synthesis
      if (isTtsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(replyText.slice(0, 200));
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: 'Treasury telemetry scanned. All accounts remain verified safe and compounding at 5.20% APY.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  // Speech Recognition toggle
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser.');
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsVoiceActive(true);
        showToast('Listening... Speak your command now.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        handleSendPrompt(transcript);
      };

      recognition.onerror = () => {
        setIsVoiceActive(false);
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
      };

      recognition.start();
    } catch {
      setIsVoiceActive(false);
    }
  };

  // ── FILTERED DATA CALCULATIONS ───────────────────────────────────────
  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

  const filteredTransactions = transactions
    .filter((tx) => {
      const matchSearch = tx.name.toLowerCase().includes(txSearch.toLowerCase()) || tx.category.toLowerCase().includes(txSearch.toLowerCase());
      if (txCategoryFilter === 'all') return matchSearch;
      if (txCategoryFilter === 'debit') return matchSearch && tx.type === 'debit';
      if (txCategoryFilter === 'credit') return matchSearch && tx.type === 'credit';
      if (txCategoryFilter === 'sweep') return matchSearch && tx.status === 'sweep';
      if (txCategoryFilter === 'flagged') return matchSearch && tx.status === 'flagged';
      return matchSearch;
    })
    .sort((a, b) => (txSortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount));

  // Compound Yield calculations
  const months = calcYears * 12;
  const rSentinel = calcApy / 100 / 12;
  const rLegacy = 0.0001 / 12;
  const fvSentinel =
    calcInitial * Math.pow(1 + rSentinel, months) + calcMonthly * ((Math.pow(1 + rSentinel, months) - 1) / rSentinel);
  const fvLegacy =
    calcInitial * Math.pow(1 + rLegacy, months) + calcMonthly * ((Math.pow(1 + rLegacy, months) - 1) / rLegacy);
  const extraYieldEarned = Math.round(fvSentinel - fvLegacy);

  // Flowchart steps
  const flowNodes = [
    {
      id: 0,
      title: '01. Inbound Transaction Event',
      sub: 'ACH · Wire · Card · API',
      badge: 'Zero-Latency Listener',
      detail: 'Webhook triggers continuous ledger ingest. Payload validated in < 2ms with cryptographic hash signature.'
    },
    {
      id: 1,
      title: '02. Zero-Day Threat Radar',
      sub: 'ML Heuristics & Geolocation',
      badge: 'Active Quarantine',
      detail: 'Analyzes IP, merchant category, velocity, and device footprint. Discrepancies held pending 1-tap confirmation.'
    },
    {
      id: 2,
      title: '03. Liquidity Horizon Check',
      sub: '30-Day Buffer Forecasting',
      badge: 'Cash Preservation',
      detail: 'Calculates upcoming payroll and recurring bills against operating checking balance to ensure zero overdrafts.'
    },
    {
      id: 3,
      title: '04. Smart 5.20% Sweep Router',
      sub: 'Idle Liquidity Auto-Allocation',
      badge: 'Yield Optimization',
      detail: 'Surplus capital automatically swept into partner depository network yielding 5.20% APY with FDIC coverage.'
    },
    {
      id: 4,
      title: '05. Immutable Ledger Settlement',
      sub: 'Audited & Categorized',
      badge: 'Finalized',
      detail: 'Expense auto-tagged with tax deduction metadata. Live push notifications and real-time dashboard update.'
    }
  ];

  // =====================================================================
  // VIEW 1: REDESIGNED WORLD-CLASS TWO-PANEL LOGIN PAGE (/login)
  // =====================================================================
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#060A13] text-white font-sans antialiased relative overflow-hidden flex flex-col justify-between selection:bg-[#2563EB] selection:text-white">
        {/* Subtle background ambient lighting */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Minimal Navigation Bar */}
        <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => navigateTo('main')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Homepage</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>256-Bit TLS · Quantum Safe Authentication</span>
          </div>
        </header>

        {/* Main Two-Panel Layout */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#0A0F1D]/80 border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl">
            
            {/* ── LEFT PANEL: BRAND EXPERIENCE & VISUALIZATION ── */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8 pr-0 lg:pr-6">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-base font-bold tracking-tight text-white block">Sentinel Private Banking</span>
                    <span className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">Autonomous Financial Intelligence</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.15] text-balance">
                  Your money.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">
                    Your intelligence.
                  </span>
                  <br />
                  Your control.
                </h1>

                <p className="text-sm text-slate-300 mt-4 leading-relaxed max-w-md">
                  Autonomous treasury orchestration, institutional fraud defense, and 5.20% APY automated sweeps engineered for corporate founders and high-net-worth clients.
                </p>
              </div>

              {/* Cinematic 3D Glass Crystal Financial Visualization */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-gradient-to-b from-white/5 to-black/40 group">
                <img
                  src={LOGIN_CRYSTAL_IMAGE}
                  alt="Sentinel 3D Crystal Security Core"
                  className="w-full h-48 sm:h-56 object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-300 text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Heuristic Anomaly Shield · Active
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">Lat: 1.8ms</span>
                </div>
              </div>

              {/* Trust Indicators at bottom */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-[11px] text-slate-400">
                <div className="flex flex-col">
                  <span className="text-white font-semibold">ISO 27001</span>
                  <span>Certified Security</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">FDIC Insured</span>
                  <span>Partner Depository</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold">256-Bit AES</span>
                  <span>HSM Protected</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL: REFINED AUTHENTICATION CONSOLE ── */}
            <div className="lg:col-span-6 bg-[#0E1528]/95 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white tracking-tight">Sign In to Sentinel</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {loginRoleTab === 'user'
                    ? 'Access your corporate balances, yield forecasters, virtual cards, and conversational assistant.'
                    : 'Authorized console for risk officers, global depository sweeps, and clearinghouse telemetry.'}
                </p>
              </div>

              {/* Distinct Mode Selector: Client Portal vs Admin Console */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 border border-white/10 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setLoginRoleTab('user');
                    setLoginError(null);
                  }}
                  className={`py-3 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    loginRoleTab === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Client Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginRoleTab('admin');
                    setLoginError(null);
                  }}
                  className={`py-3 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    loginRoleTab === 'admin'
                      ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-amber-400 border border-amber-400/30 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Admin Console</span>
                </button>
              </div>

              {/* Quick 1-Click Demo Login Button (Clearly labeled demo access) */}
              <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-3">
                <div className="text-left">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    Instant Demo Credentials
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {loginRoleTab === 'user' ? DEMO_CLIENT_USER.name : DEMO_ADMIN_USER.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {loginRoleTab === 'user' ? 'Founder & Account Holder' : 'Chief Risk Officer'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(loginRoleTab)}
                  disabled={isSubmittingLogin}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm disabled:opacity-50"
                >
                  <span>1-Click Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Simulated Passkey / Biometric Option */}
              <button
                type="button"
                onClick={handleBiometricLogin}
                disabled={isBiometricScanning}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition flex items-center justify-center gap-2 mb-4 cursor-pointer"
              >
                <Fingerprint className={`w-4 h-4 text-cyan-400 ${isBiometricScanning ? 'animate-pulse text-blue-400' : ''}`} />
                <span>
                  {isBiometricScanning
                    ? 'Verifying Biometric Passkey...'
                    : `Authenticate with Passkey / Face ID (${loginRoleTab === 'admin' ? 'Admin' : 'Client'})`}
                </span>
              </button>

              <div className="flex items-center my-4 text-slate-500 text-[11px]">
                <div className="flex-1 border-t border-white/10" />
                <span className="px-3 uppercase tracking-wider text-[10px] font-semibold">Or Enter Credentials</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {loginRoleTab === 'user' ? 'Corporate Account Email' : 'Enterprise Admin Identifier'}
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={loginRoleTab === 'user' ? 'alex@sentinel.bank' : 'admin@sentinel.bank'}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      {loginRoleTab === 'user' ? 'Security Password' : 'Admin Security PIN / Token'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordModalOpen(true)}
                      className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-black/40 border-white/20 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Remember this hardware token</span>
                  </label>
                  <span className="text-[11px] text-slate-500">TLS 1.3 Active</span>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wide transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                    loginRoleTab === 'user'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 shadow-slate-900/50'
                  } disabled:opacity-50`}
                >
                  {isSubmittingLogin ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>
                        {loginRoleTab === 'user' ? 'Authorize Client Banking Portal' : 'Authorize Admin Risk Console'}
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer in Login View */}
        <footer className="relative z-10 text-center py-4 text-[11px] text-slate-500">
          Protected by 256-bit AES quantum-resistant encryption. Partner Member FDIC.
        </footer>

        {/* Forgot Password Modal */}
        {isForgotPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#0E1528] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <KeyRound className="w-5 h-5" />
                  <h3 className="font-semibold text-lg text-white">Institutional Account Recovery</h3>
                </div>
                <button
                  onClick={() => setIsForgotPasswordModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                To prevent unauthorized takeovers, institutional treasury credentials require hardware token re-verification or direct cryptographic key signoff from your designated Compliance Officer.
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-2 mb-6">
                <div>• Support Line: <strong>+1 (800) 840-CONSET</strong></div>
                <div>• Emergency Clearance: <strong>security@sentinel.bank</strong></div>
                <div>• For testing, please use the <strong>1-Click Sign In</strong> button.</div>
              </div>

              <button
                type="button"
                onClick={() => setIsForgotPasswordModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
              >
                Close & Return to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =====================================================================
  // VIEW 2: AUTHENTICATED USER DASHBOARD (/dashboard)
  // =====================================================================
  if (currentView === 'dashboard' && currentUser?.role === 'user') {
    return (
      <div className="min-h-screen bg-[#070B14] text-white font-sans antialiased flex selection:bg-[#2563EB] selection:text-white">
        {/* ── COLLAPSIBLE DASHBOARD SIDEBAR ── */}
        <aside
          className={`hidden md:flex flex-col justify-between border-r border-white/10 bg-[#0A0F1D]/90 backdrop-blur-2xl transition-all duration-300 z-30 shrink-0 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div>
            {/* Sidebar Brand Header */}
            <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="truncate">
                    <span className="font-bold text-sm tracking-tight text-white block">Sentinel Bank</span>
                    <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Client Treasury</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="p-3 space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: PieChart },
                { id: 'accounts', label: 'Accounts & Transfers', icon: DollarSign },
                { id: 'forecast', label: 'Compound Forecaster', icon: TrendingUp },
                { id: 'analytics', label: 'Visual Analytics', icon: BarChart3 },
                { id: 'cards', label: 'Virtual Cards', icon: CreditCard },
                { id: 'transactions', label: 'Transactions Ledger', icon: FileText },
                { id: 'automation', label: 'Sweep Automation', icon: Zap },
                { id: 'assistant', label: 'Smart AI Assistant', icon: Sparkles },
                { id: 'settings', label: 'Security Settings', icon: Settings }
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = clientActiveTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setClientActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile Card at bottom of Sidebar */}
          <div className="p-3 border-t border-white/10">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={currentUser.avatarImg}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 border border-white/20"
                />
                {!isSidebarCollapsed && (
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.company}</div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT VIEWPORT ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Dashboard Header */}
          <header className="h-20 border-b border-white/10 bg-[#0A0F1D]/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h2 className="text-base font-semibold text-white">Good evening, Alex</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Rivera Capital Partners</span>
                  <span>·</span>
                  <span className="text-cyan-400 font-medium">Session: Protected · 256-Bit TLS</span>
                </div>
              </div>
            </div>

            {/* Actions in Header */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('main')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition cursor-pointer"
                title="View Public Homepage"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Public Site</span>
              </button>

              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Transfer & Sweep</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>

                {isNotifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0E1528] border border-white/15 p-4 shadow-2xl z-50">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs font-semibold text-white">
                      <span>Notifications ({unreadNotifications.length})</span>
                      <button
                        onClick={() => setUnreadNotifications([])}
                        className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto">
                      {unreadNotifications.length > 0 ? (
                        unreadNotifications.map((notif, i) => (
                          <div key={i} className="text-xs text-slate-300 p-2.5 rounded-xl bg-white/5 border border-white/5 leading-relaxed">
                            {notif}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-500 text-center py-4">No unread notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 text-slate-400 hover:text-red-400 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* ── MOBILE DRAWER NAVIGATION ── */}
          {isMobileNavOpen && (
            <div className="md:hidden bg-[#0A0F1D] border-b border-white/10 p-4 space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: PieChart },
                { id: 'accounts', label: 'Accounts & Transfers', icon: DollarSign },
                { id: 'forecast', label: 'Compound Forecaster', icon: TrendingUp },
                { id: 'analytics', label: 'Visual Analytics', icon: BarChart3 },
                { id: 'cards', label: 'Virtual Cards', icon: CreditCard },
                { id: 'transactions', label: 'Transactions Ledger', icon: FileText },
                { id: 'automation', label: 'Sweep Automation', icon: Zap },
                { id: 'assistant', label: 'Smart AI Assistant', icon: Sparkles },
                { id: 'settings', label: 'Security Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setClientActiveTab(item.id as any);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    clientActiveTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* ── TAB CONTENT ── */}
          <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
            
            {/* TAB: OVERVIEW */}
            {clientActiveTab === 'overview' && (
              <div className="space-y-8">
                {/* 4 Core Financial Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                    <span className="text-xs text-slate-400 font-medium">Unified Total Balance</span>
                    <div className="text-2xl font-bold text-white mt-1.5 tabular-nums">
                      ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+8.4% Net Trajectory (30 Days)</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                    <span className="text-xs text-slate-400 font-medium">Available Cash (Checking)</span>
                    <div className="text-2xl font-bold text-white mt-1.5 tabular-nums">
                      ${accounts[0].balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-medium mt-2">
                      Zero overdraft floor: $15,000.00
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                    <span className="text-xs text-slate-400 font-medium">High-Yield Vault (5.20% APY)</span>
                    <div className="text-2xl font-bold text-blue-400 mt-1.5 tabular-nums">
                      ${accounts[1].balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-2">
                      +$802.53 Yield Credited This Month
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                    <span className="text-xs text-slate-400 font-medium">Treasury Reserves (4.85% APY)</span>
                    <div className="text-2xl font-bold text-white mt-1.5 tabular-nums">
                      ${accounts[2].balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-2">
                      FDIC Insured Depository Network
                    </div>
                  </div>
                </div>

                {/* Net Worth Chart & Quick Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Trajectory Area Chart */}
                  <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-semibold text-white">Projected Balance & Liquidity Curve</h3>
                        <p className="text-xs text-slate-400">Continuous AI forecast factoring upcoming drafts and 5.20% APY sweeps</p>
                      </div>
                      <span className="text-xs font-mono bg-blue-500/10 text-cyan-400 border border-blue-500/20 px-3 py-1 rounded-lg">
                        Horizon: 2026-Q4
                      </span>
                    </div>

                    <div className="relative h-60 w-full pt-4">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="userChartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="40" x2="600" y2="40" stroke="#ffffff" strokeOpacity="0.06" />
                        <line x1="0" y1="90" x2="600" y2="90" stroke="#ffffff" strokeOpacity="0.06" />
                        <line x1="0" y1="140" x2="600" y2="140" stroke="#ffffff" strokeOpacity="0.06" />

                        {/* Area Fill */}
                        <path
                          d="M 0 170 C 80 160, 160 145, 240 120 C 320 100, 400 70, 480 45 C 540 30, 580 20, 600 15 L 600 200 L 0 200 Z"
                          fill="url(#userChartGradient)"
                        />
                        {/* Main Trajectory Line */}
                        <path
                          d="M 0 170 C 80 160, 160 145, 240 120 C 320 100, 400 70, 480 45 C 540 30, 580 20, 600 15"
                          fill="none"
                          stroke="#38BDF8"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Interactive Data Nodes */}
                        {[
                          { cx: 80, cy: 160, val: '$512,000' },
                          { cx: 240, cy: 120, val: '$560,000' },
                          { cx: 400, cy: 70, val: '$620,000' },
                          { cx: 600, cy: 15, val: '$660,050' }
                        ].map((pt, i) => (
                          <circle
                            key={i}
                            cx={pt.cx}
                            cy={pt.cy}
                            r="5"
                            className="fill-cyan-400 stroke-[#0E1528] stroke-2 hover:r-7 transition-all cursor-pointer"
                          />
                        ))}
                      </svg>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                      <span>Jul 2026</span>
                      <span>Aug 2026</span>
                      <span>Sep 2026</span>
                      <span>Oct 2026 (Present)</span>
                      <span>Dec 2026 (Projected $694K)</span>
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white">Instant Treasury Actions</h3>
                      <p className="text-xs text-slate-400">One-tap execution on verified depository accounts</p>
                    </div>

                    <div className="space-y-2.5">
                      <button
                        onClick={() => setIsTransferModalOpen(true)}
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-between transition cursor-pointer shadow-sm"
                      >
                        <span className="flex items-center gap-2">
                          <PlusCircle className="w-4 h-4" />
                          <span>Transfer / Sweep Funds</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setClientActiveTab('cards');
                          setIsNewCardModalOpen(true);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-cyan-400" />
                          <span>Issue Virtual Burner Card</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setClientActiveTab('forecast')}
                        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span>Simulate 5.20% Compound Yield</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-slate-400" />
                          <span>Export Audited Ledger (CSV)</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
                      <span>Next automated sweep scheduled for 11:59 PM EST.</span>
                    </div>
                  </div>
                </div>

                {/* Recent Ledger Summary */}
                <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-semibold text-white">Recent Ledger Transactions</h3>
                      <p className="text-xs text-slate-400">Continuous cryptographic ledger synchronization</p>
                    </div>
                    <button
                      onClick={() => setClientActiveTab('transactions')}
                      className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Full Ledger</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-white/5 overflow-x-auto">
                    {transactions.slice(0, 4).map((tx) => (
                      <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              tx.type === 'credit'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-white/5 text-slate-300 border border-white/10'
                            }`}
                          >
                            {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{tx.name}</div>
                            <div className="text-[11px] text-slate-400">{tx.category} · {tx.date}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`font-semibold tabular-nums text-sm ${
                              tx.type === 'credit' ? 'text-emerald-400' : 'text-white'
                            }`}
                          >
                            {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                              tx.status === 'sweep'
                                ? 'bg-blue-500/10 text-blue-400'
                                : tx.status === 'flagged'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ACCOUNTS & TRANSFERS */}
            {clientActiveTab === 'accounts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Accounts & Multi-Treasury Balances</h2>
                    <p className="text-xs text-slate-400">Unified accounts managed by Sentinel partner depository network</p>
                  </div>
                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Initiate Transfer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {accounts.map((acc) => (
                    <div key={acc.id} className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-mono text-cyan-400">{acc.number}</span>
                          <h3 className="text-base font-bold text-white mt-0.5">{acc.name}</h3>
                        </div>
                        {acc.apy && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                            {acc.apy}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Available Balance</div>
                        <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                          ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                        <span>Routing: {acc.routing}</span>
                        <button
                          onClick={() => {
                            setTransferFrom(acc.id);
                            setIsTransferModalOpen(true);
                          }}
                          className="text-cyan-400 hover:underline font-semibold cursor-pointer"
                        >
                          Transfer From
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FORECAST & COMPOUND YIELD */}
            {clientActiveTab === 'forecast' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Compound Yield & Balance Forecaster</h2>
                  <p className="text-xs text-slate-400">Model long-term wealth growth under Sentinel's 5.20% APY automated vault network</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Controls */}
                  <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-5">
                    <h3 className="text-sm font-semibold text-white">Projection Parameters</h3>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Starting Capital:</span>
                        <strong className="text-white">${calcInitial.toLocaleString()}</strong>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="250000"
                        step="5000"
                        value={calcInitial}
                        onChange={(e) => setCalcInitial(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Monthly Deposit:</span>
                        <strong className="text-white">${calcMonthly.toLocaleString()} / mo</strong>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="20000"
                        step="500"
                        value={calcMonthly}
                        onChange={(e) => setCalcMonthly(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Horizon:</span>
                        <strong className="text-white">{calcYears} Years</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={calcYears}
                        onChange={(e) => setCalcYears(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Sentinel APY:</span>
                        <strong className="text-cyan-400">{calcApy}% APY</strong>
                      </div>
                      <input
                        type="range"
                        min="2.0"
                        max="8.0"
                        step="0.1"
                        value={calcApy}
                        onChange={(e) => setCalcApy(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                      * Projections are simulated models for strategic planning. Past performance does not guarantee future yields.
                    </div>
                  </div>

                  {/* Results Display */}
                  <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-6 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Estimated Future Wealth ({calcYears} Years)</span>
                      <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tabular-nums">
                        ${Math.round(fvSentinel).toLocaleString()}
                      </div>
                      <div className="text-xs text-emerald-400 font-semibold mt-1">
                        +${extraYieldEarned.toLocaleString()} earned over traditional 0.01% checking
                      </div>
                    </div>

                    {/* Comparative Visual Bars */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-cyan-400">Sentinel Vault ({calcApy}% APY)</span>
                          <span className="font-mono text-white">${Math.round(fvSentinel).toLocaleString()}</span>
                        </div>
                        <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full w-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Traditional Bank (0.01% APY)</span>
                          <span className="font-mono text-slate-300">${Math.round(fvLegacy).toLocaleString()}</span>
                        </div>
                        <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-slate-600 rounded-full"
                            style={{ width: `${Math.max(15, Math.round((fvLegacy / fvSentinel) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-xs text-slate-200">
                      <strong>Autonomous Wealth Generation:</strong> By activating Sentinel's automated surplus sweeps, idle working capital is continually pushed to high-yield clearinghouse notes without locking liquidity.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VISUAL ANALYTICS */}
            {clientActiveTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Visual Financial Analytics</h2>
                  <p className="text-xs text-slate-400">Breakdown of operational spend, cloud infrastructure, and yield velocity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Donut SVG */}
                  <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                    <h3 className="text-sm font-semibold text-white">Monthly Expenditure Allocation</h3>
                    <div className="flex items-center justify-center py-6">
                      <svg className="w-48 h-48" viewBox="0 0 100 100">
                        {/* 55% Cloud (dasharray 172.7, dashoffset 0) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#2563EB"
                          strokeWidth="14"
                          strokeDasharray="172.7 141.3"
                          strokeDashoffset="0"
                        />
                        {/* 30% Sweeps (dasharray 94.2, dashoffset -172.7) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#06B6D4"
                          strokeWidth="14"
                          strokeDasharray="94.2 219.8"
                          strokeDashoffset="-172.7"
                        />
                        {/* 15% Discretionary (dasharray 47.1, dashoffset -266.9) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke="#64748B"
                          strokeWidth="14"
                          strokeDasharray="47.1 266.9"
                          strokeDashoffset="-266.9"
                        />
                      </svg>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-md bg-blue-600" />
                          <span>Cloud & SaaS Infrastructure</span>
                        </span>
                        <strong className="text-white">55% ($13,660.00)</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-md bg-cyan-500" />
                          <span>High-Yield Vault Sweeps</span>
                        </span>
                        <strong className="text-white">30% ($7,450.00)</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-md bg-slate-500" />
                          <span>Corporate Discretionary</span>
                        </span>
                        <strong className="text-white">15% ($3,720.00)</strong>
                      </div>
                    </div>
                  </div>

                  {/* APY Velocity Matrix */}
                  <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                    <h3 className="text-sm font-semibold text-white">APY Comparison Matrix</h3>
                    <p className="text-xs text-slate-400">Depository rates benchmarked against national averages</p>

                    <div className="space-y-4 pt-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-cyan-400">Sentinel High-Yield Vault</span>
                          <strong>5.20% APY</strong>
                        </div>
                        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-cyan-400 w-full rounded-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">Sentinel Treasury Notes</span>
                          <strong>4.85% APY</strong>
                        </div>
                        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-blue-600 w-[93%] rounded-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">US National Savings Average</span>
                          <strong>0.46% APY</strong>
                        </div>
                        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-slate-600 w-[12%] rounded-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Traditional Megabank Checking</span>
                          <strong>0.01% APY</strong>
                        </div>
                        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-slate-700 w-[2%] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VIRTUAL CARDS */}
            {clientActiveTab === 'cards' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Corporate Virtual Cards Studio</h2>
                    <p className="text-xs text-slate-400">Multi-token virtual cards with instant freeze killswitches and burner capabilities</p>
                  </div>
                  <button
                    onClick={() => setIsNewCardModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Issue Burner Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1: Platinum Corporate */}
                  <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
                    isPlatinumFrozen
                      ? 'bg-slate-900 border-red-500/40 opacity-75'
                      : 'bg-gradient-to-br from-slate-900 via-blue-950 to-[#0A0F1D] border-blue-500/30'
                  }`}>
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Executive Corporate</span>
                        <h3 className="text-lg font-bold text-white">Alex Rivera</h3>
                      </div>
                      <span className="font-bold text-sm tracking-wider text-white">VISA PLATINUM</span>
                    </div>

                    <div className="my-6">
                      <div className="font-mono text-lg tracking-widest text-white">
                        {showCardNumber ? '4192 8810 5201 8201' : '•••• •••• •••• 8201'}
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-slate-400 font-mono">
                        <span>EXP: 10/29</span>
                        <span>CVV: {showCardNumber ? '491' : '•••'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <button
                        onClick={() => setShowCardNumber(!showCardNumber)}
                        className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showCardNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showCardNumber ? 'Mask Details' : 'Show Details'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsPlatinumFrozen(!isPlatinumFrozen);
                          showToast(isPlatinumFrozen ? '✓ Card ending in 8201 unlocked.' : '⚠️ Card ending in 8201 frozen across all networks.');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                          isPlatinumFrozen
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                        }`}
                      >
                        {isPlatinumFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{isPlatinumFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Disposable Burner */}
                  <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
                    isBurnerFrozen
                      ? 'bg-slate-900 border-red-500/40 opacity-75'
                      : 'bg-gradient-to-br from-slate-900 via-cyan-950 to-[#0A0F1D] border-cyan-500/30'
                  }`}>
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Single-Use Burner</span>
                        <h3 className="text-lg font-bold text-white">SaaS Subscriptions</h3>
                      </div>
                      <span className="font-bold text-sm tracking-wider text-white">MASTERCARD</span>
                    </div>

                    <div className="my-6">
                      <div className="font-mono text-lg tracking-widest text-white">
                        {showCardNumber ? '5412 9012 4419 4419' : '•••• •••• •••• 4419'}
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-slate-400 font-mono">
                        <span>EXP: 11/26</span>
                        <span>LIMIT: $1,000</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-xs text-slate-400">Auto-expires after charge</span>

                      <button
                        onClick={() => {
                          setIsBurnerFrozen(!isBurnerFrozen);
                          showToast(isBurnerFrozen ? '✓ Burner card unlocked.' : '⚠️ Burner card frozen.');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                          isBurnerFrozen
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {isBurnerFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{isBurnerFrozen ? 'Unfreeze' : 'Freeze'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TRANSACTIONS LEDGER */}
            {clientActiveTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Audited Transactions Ledger</h2>
                    <p className="text-xs text-slate-400">Cryptographically verifiable transactions across all corporate ledgers</p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download CSV</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      placeholder="Search transactions by merchant, category, or memo..."
                      className="w-full bg-[#0E1528] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    {['all', 'debit', 'credit', 'sweep', 'flagged'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setTxCategoryFilter(cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                          txCategoryFilter === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-[#0E1528] border border-white/10 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                        <tr>
                          <th className="p-4">Transaction / Memo</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Account</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Amount</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition">
                              <td className="p-4 font-semibold text-white">{tx.name}</td>
                              <td className="p-4 text-slate-400">{tx.category}</td>
                              <td className="p-4 text-slate-400">{tx.account}</td>
                              <td className="p-4 text-slate-400">{tx.date}</td>
                              <td
                                className={`p-4 text-right font-mono font-bold ${
                                  tx.type === 'credit' ? 'text-emerald-400' : 'text-white'
                                }`}
                              >
                                {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="p-4 text-center">
                                <span
                                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                                    tx.status === 'sweep'
                                      ? 'bg-blue-500/10 text-blue-400'
                                      : tx.status === 'flagged'
                                      ? 'bg-red-500/10 text-red-400'
                                      : 'bg-emerald-500/10 text-emerald-400'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-slate-500">
                              No transactions matching criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUTOMATION RULES */}
            {clientActiveTab === 'automation' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Autonomous Liquidity & Sweep Rules</h2>
                  <p className="text-xs text-slate-400">Automated financial execution policies with real-time floor protection</p>
                </div>

                <div className="space-y-4">
                  {/* Rule 1 */}
                  <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400">RULE #01</span>
                        <h3 className="font-semibold text-white text-base">Daily Surplus Sweep to 5.20% APY Vault</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Any checking balance exceeding <strong>${Number(sweepFloorAmount).toLocaleString()}</strong> is automatically transferred into your High-Yield Vault at 11:59 PM EST.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsEditRuleModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
                      >
                        Adjust Threshold
                      </button>
                      <button
                        onClick={() => {
                          setRuleSweepEnabled(!ruleSweepEnabled);
                          showToast(ruleSweepEnabled ? 'Sweep rule paused.' : '✓ Sweep rule activated.');
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                          ruleSweepEnabled ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {ruleSweepEnabled ? 'ACTIVE' : 'PAUSED'}
                      </button>
                    </div>
                  </div>

                  {/* Rule 2 */}
                  <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400">RULE #02</span>
                        <h3 className="font-semibold text-white text-base">Zero-Overdraft Reverse Buffer Protection</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        If upcoming scheduled drafts threaten to lower operating checking below $5,000, funds are instantaneously reverse-swept back from the vault.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setRuleBufferEnabled(!ruleBufferEnabled);
                        showToast(ruleBufferEnabled ? 'Buffer protection paused.' : '✓ Buffer protection activated.');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                        ruleBufferEnabled ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {ruleBufferEnabled ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>

                  {/* Rule 3 */}
                  <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400">RULE #03</span>
                        <h3 className="font-semibold text-white text-base">Foreign Merchant Geo-Fence Lock</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Automatically quarantines credit/debit charges outside of United States & Canada unless verified with 2FA passkey.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setRuleGeoLockEnabled(!ruleGeoLockEnabled);
                        showToast(ruleGeoLockEnabled ? 'Geo-fence paused.' : '✓ Geo-fence activated.');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                        ruleGeoLockEnabled ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {ruleGeoLockEnabled ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SMART AI ASSISTANT */}
            {clientActiveTab === 'assistant' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Sentinel Smart AI Banking Assistant</h2>
                  <p className="text-xs text-slate-400">Conversational treasury intelligence backed by server-side Gemini API & voice synthesis</p>
                </div>

                <div className="rounded-3xl bg-[#0E1528] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[560px]">
                  {/* Messages Area */}
                  <div ref={chatScrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-white/10 border border-white/10 text-slate-100 rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>

                        {msg.action && (
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                if (msg.action?.actionType === 'transfer') setIsTransferModalOpen(true);
                                if (msg.action?.actionType === 'freeze') {
                                  setIsPlatinumFrozen(true);
                                  showToast('⚠️ Card 8201 frozen by assistant directive.');
                                }
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070B14] font-bold text-xs shadow-md transition cursor-pointer"
                            >
                              {msg.action.label}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {isAssistantThinking && (
                      <div className="flex items-center gap-2 text-xs text-cyan-400 pl-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sentinel is analyzing ledger telemetry...</span>
                      </div>
                    )}
                  </div>

                  {/* Preset Prompt Chips */}
                  <div className="p-3 bg-black/30 border-t border-white/10 flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                      'Audit charges in past 48 hours',
                      'Forecast 60-day cash flow',
                      'Sweep $500 to High-Yield Vault',
                      'Freeze platinum card 8201'
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendPrompt(prompt)}
                        className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Input Bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendPrompt(chatInput);
                    }}
                    className="p-4 bg-black/40 border-t border-white/10 flex items-center gap-3"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask Sentinel (e.g. 'Transfer $1,000 to Vault', 'Audit suspicious activity')..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isVoiceActive ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-white/5 text-slate-300 border-white/10'
                      }`}
                      title="Voice Speech Input"
                    >
                      {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isTtsEnabled ? 'bg-white/5 text-cyan-400 border-white/10' : 'bg-white/5 text-slate-500 border-white/10'
                      }`}
                      title={isTtsEnabled ? 'Voice Synthesis Enabled' : 'Voice Synthesis Muted'}
                    >
                      {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition cursor-pointer shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {clientActiveTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-xl font-bold text-white">Security & Profile Settings</h2>
                  <p className="text-xs text-slate-400">Institutional cryptographic key management & session telemetry</p>
                </div>

                <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <div className="text-xs font-semibold text-white">Biometric Passkey Authentication</div>
                      <div className="text-[11px] text-slate-400">Face ID / Touch ID hardware authorization</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">CONFIGURED</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <div className="text-xs font-semibold text-white">HSM 256-Bit Key Storage</div>
                      <div className="text-[11px] text-slate-400">Payment credentials stored in hardware modules</div>
                    </div>
                    <span className="text-xs font-bold text-cyan-400">HARDENED</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div>
                      <div className="text-xs font-semibold text-white">Active Session Expiry</div>
                      <div className="text-[11px] text-slate-400">Automatic timeout after 30 minutes of inactivity</div>
                    </div>
                    <span className="text-xs font-mono text-slate-300">30 MIN</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* ── TRANSFER MODAL ── */}
        {isTransferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#0E1528] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-white">Transfer & Sweep Capital</h3>
                <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleExecuteTransfer} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">From Account</label>
                  <select
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id} className="bg-[#0E1528]">
                        {a.name} (${a.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">To Destination Account</label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id} className="bg-[#0E1528]">
                        {a.name} (${a.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="1000.00"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-sm font-semibold text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Memo / Purpose</label>
                  <input
                    type="text"
                    value={transferMemo}
                    onChange={(e) => setTransferMemo(e.target.value)}
                    placeholder="e.g. Sweep to 5.20% APY Vault"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                {transferError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{transferError}</span>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-medium hover:bg-white/5 cursor-pointer text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── BURNER CARD MODAL ── */}
        {isNewCardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#0E1528] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-white">Generate Instant Burner Card</h3>
                <button
                  onClick={() => setIsNewCardModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Card Description</label>
                  <input
                    type="text"
                    value={newCardLabel}
                    onChange={(e) => setNewCardLabel(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hard Spend Limit ($ USD)</label>
                  <input
                    type="number"
                    value={newCardLimit}
                    onChange={(e) => setNewCardLimit(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 leading-relaxed">
                  Burner cards automatically self-destruct once the spend limit is consumed or after 24 hours.
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewCardModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-medium hover:bg-white/5 cursor-pointer text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewCardModalOpen(false);
                      showToast(`✓ New Burner Card issued ($${newCardLimit} limit).`);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Issue Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT RULE MODAL ── */}
        {isEditRuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#0E1528] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-white">Adjust Sweep Floor Threshold</h3>
                <button
                  onClick={() => setIsEditRuleModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Checking Balance Floor ($ USD)</label>
                  <input
                    type="number"
                    value={sweepFloorAmount}
                    onChange={(e) => setSweepFloorAmount(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-sm font-semibold text-white outline-none focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Any amount above this threshold is swept to your 5.20% APY Vault each evening.
                  </span>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditRuleModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-medium hover:bg-white/5 cursor-pointer text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditRuleModalOpen(false);
                      showToast(`✓ Sweep threshold updated to $${Number(sweepFloorAmount).toLocaleString()}.`);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Save Threshold
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F1B31] text-white px-5 py-3 rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-3 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // =====================================================================
  // VIEW 3: ENTERPRISE ADMIN COMMAND CENTER (/admin)
  // =====================================================================
  if (currentView === 'admin' && currentUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-[#050811] text-white font-sans antialiased flex flex-col selection:bg-amber-500 selection:text-black">
        {/* Enterprise Command Header */}
        <header className="h-20 border-b border-white/10 bg-[#070C1A] px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-600/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">Sentinel Enterprise Risk Center</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  DEFCON 4 · NORMAL
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Supervisor: Elena Vance</span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">99.998% Clearinghouse Uptime</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('✓ Clearinghouse telemetry re-synchronized with FedNow & SWIFT.')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
              title="Resynchronize Telemetry"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => navigateTo('main')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Site</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 text-xs font-semibold text-red-400 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Admin Navigation Strip */}
        <div className="border-b border-white/10 bg-[#080E20]/90 px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Operations Overview', icon: Activity },
            { id: 'fraud', label: 'Fraud & Threats Radar', icon: AlertTriangle },
            { id: 'emergency', label: 'Emergency Controls', icon: Lock },
            { id: 'accounts', label: 'Accounts & KYC Roster', icon: Users },
            { id: 'diagnostics', label: 'System Diagnostics', icon: Server },
            { id: 'audit', label: 'Audit Trail Events', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                adminActiveTab === tab.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Admin Viewport */}
        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {/* TAB: OPERATIONS OVERVIEW */}
          {adminActiveTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Total Depository Liquidity</span>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">$4,852,400,000</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">100% FDIC Sweep Incurred</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Active Client Ledgers</span>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">55,420</div>
                  <div className="text-[11px] text-cyan-400 font-semibold mt-1">+1,240 verified this week</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Flagged Velocity Anomalies</span>
                  <div className="text-2xl font-bold text-red-400 mt-1 tabular-nums">{adminThreats.length} Held</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-1">Zero unauthorized clearings</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
                  <span className="text-xs text-slate-400 font-medium">Global Clearing Nodes</span>
                  <div className="text-2xl font-bold text-white mt-1 tabular-nums">112 Countries</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">Sub-12ms settlement latency</div>
                </div>
              </div>

              {/* Settlement Monitors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-white">Federal Reserve & SWIFT Clearing Status</h3>
                    <span className="text-xs font-mono text-emerald-400">SYNCED</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span>FedNow Real-Time Rails</span>
                      <strong className="text-emerald-400">OPERATIONAL (0.9ms)</strong>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span>SWIFT gpi Cross-Border</span>
                      <strong className="text-emerald-400">OPERATIONAL (14ms)</strong>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span>Automated Depository Sweep Node #04</span>
                      <strong className="text-emerald-400">BALANCED</strong>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-white">Reserve Health & Liquidity Gauge</h3>
                    <span className="text-xs font-mono text-cyan-400">35% BUFFER</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full w-[85%]" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All reserve ratios exceed Basel III requirements by +214%. Automatic secondary liquidity triggers remain armed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FRAUD & ANOMALY RADAR */}
          {adminActiveTab === 'fraud' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span>Autonomous Anomaly & Threat Intervention Radar</span>
                  </h2>
                  <p className="text-xs text-slate-400">Live transactions intercepted by zero-day heuristics</p>
                </div>
                <span className="text-xs font-mono bg-white/5 text-slate-300 px-3 py-1 rounded-md border border-white/10">
                  Active Rule: #092-B
                </span>
              </div>

              <div className="space-y-3">
                {adminThreats.map((thr) => (
                  <div
                    key={thr.id}
                    className="p-5 rounded-2xl bg-[#090F22] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400">{thr.id}</span>
                        <h4 className="text-sm font-bold text-white">{thr.entity}</h4>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Amount: <strong className="text-white">{thr.amount}</strong> · Location: {thr.location} · Risk Score: {thr.riskScore}/100
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveThreatInvestigating(thr)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 cursor-pointer"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => setThreatActionConfirmModal({ threat: thr, action: 'authorize' })}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white cursor-pointer"
                      >
                        Authorize & Release
                      </button>
                      <button
                        onClick={() => setThreatActionConfirmModal({ threat: thr, action: 'freeze' })}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white cursor-pointer"
                      >
                        Permanent Freeze
                      </button>
                    </div>
                  </div>
                ))}

                {adminThreats.length === 0 && (
                  <div className="text-center py-12 text-slate-500 bg-[#090F22] rounded-2xl border border-white/5">
                    No active threats held. All transaction flows nominal.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: EMERGENCY CONTROLS (DANGER ZONE) */}
          {adminActiveTab === 'emergency' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  <span>Institutional Emergency Controls (Danger Zone)</span>
                </h2>
                <p className="text-xs text-slate-400">High-consequence killswitches requiring multi-signature administrator authorization</p>
              </div>

              <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-red-500/20">
                  <div>
                    <h3 className="font-bold text-white text-base">Global Outward Wire Freeze</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-lg">
                      Immediately halts all outward wires and FedNow settlements across the entire network in case of external market contagion.
                    </p>
                  </div>
                  <button
                    onClick={() => setEmergencyConfirmModal({ type: 'wire' })}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg ${
                      isGlobalWireFrozen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                  >
                    {isGlobalWireFrozen ? 'DISARM GLOBAL FREEZE' : 'TRIGGER GLOBAL WIRE FREEZE'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-white text-base">Automated Depository Sweeps Shutdown</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-lg">
                      Locks all client balances in place and pauses nightly 5.20% vault sweep scripts during clearinghouse maintenance windows.
                    </p>
                  </div>
                  <button
                    onClick={() => setEmergencyConfirmModal({ type: 'automation' })}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg ${
                      isAutomationShutdown
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                  >
                    {isAutomationShutdown ? 'RESTORE AUTOMATION' : 'HALT ALL AUTOMATION'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACCOUNTS & KYC */}
          {adminActiveTab === 'accounts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Accounts & KYC Compliance Roster</h2>
                  <p className="text-xs text-slate-400">Institutional client compliance levels and daily wire caps</p>
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={kycSearch}
                  onChange={(e) => setKycSearch(e.target.value)}
                  placeholder="Search institutional clients by company or contact name..."
                  className="w-full bg-[#090F22] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              <div className="rounded-2xl bg-[#090F22] border border-white/10 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                      <tr>
                        <th className="p-4">Entity</th>
                        <th className="p-4">Compliance Tier</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Balance</th>
                        <th className="p-4">Daily Wire Limit</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {kycRoster
                        .filter((k) => k.company.toLowerCase().includes(kycSearch.toLowerCase()) || k.contact.toLowerCase().includes(kycSearch.toLowerCase()))
                        .map((client) => (
                          <tr key={client.id} className="hover:bg-white/5 transition">
                            <td className="p-4">
                              <div className="font-semibold text-white">{client.company}</div>
                              <div className="text-[11px] text-slate-400">{client.contact}</div>
                            </td>
                            <td className="p-4 text-slate-300 font-mono">{client.tier}</td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                                  client.status === 'VERIFIED'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-amber-500/10 text-amber-400'
                                }`}
                              >
                                {client.status}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-white">{client.balance}</td>
                            <td className="p-4 text-slate-300">{client.limit}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  setKycRoster((prev) =>
                                    prev.map((c) => (c.id === client.id ? { ...c, wiresAllowed: !c.wiresAllowed } : c))
                                  );
                                  showToast(`Permission updated for ${client.company}.`);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                                  client.wiresAllowed
                                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                }`}
                              >
                                {client.wiresAllowed ? 'WIRES ENABLED' : 'WIRES LOCKED'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM DIAGNOSTICS */}
          {adminActiveTab === 'diagnostics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">System Diagnostics & AI Latency</h2>
                <p className="text-xs text-slate-400">Subsystem hardware metrics and Gemini API inference logs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 font-medium">Gemini 3.8 Flash Inference Latency</div>
                  <div className="text-2xl font-bold text-cyan-400">2.1ms (Avg)</div>
                  <div className="text-[11px] text-emerald-400">Sub-token streaming online</div>
                </div>

                <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 font-medium">HSM Key Rotation State</div>
                  <div className="text-2xl font-bold text-white">Rotated 4h Ago</div>
                  <div className="text-[11px] text-slate-400">Next scheduled in 20 hours</div>
                </div>

                <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400 font-medium">Consensus Node Sync</div>
                  <div className="text-2xl font-bold text-emerald-400">112 / 112 Nodes</div>
                  <div className="text-[11px] text-slate-400">Zero forks detected</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AUDIT EVENTS */}
          {adminActiveTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Immutable Administrative Audit Log</h2>
                <p className="text-xs text-slate-400">Cryptographically signed compliance record</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 space-y-3 font-mono text-xs">
                {[
                  { time: '11:02:14 AM', event: 'HEURISTIC_INTERCEPT', user: 'SYSTEM_BOT_09', detail: 'Quarantine applied to Berlin draft #TX-102 ($2,850.00)' },
                  { time: '10:00:00 AM', event: 'ADMIN_LOGIN', user: 'admin@sentinel.bank', detail: 'Elena Vance authenticated via Hardware Passkey' },
                  { time: '09:44:12 AM', event: 'VELOCITY_ALERT', user: 'RISK_ENGINE', detail: 'Tokyo draft #TX-901 exceeded standard 60s frequency' },
                  { time: '08:00:00 AM', event: 'DAILY_RECONCILIATION', user: 'SWIFT_DAEMON', detail: 'FedNow and SWIFT daily settlements balanced to $0.00' }
                ].map((log, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between gap-2">
                    <span className="text-slate-400">{log.time}</span>
                    <span className="text-amber-400 font-bold">{log.event}</span>
                    <span className="text-cyan-400">{log.user}</span>
                    <span className="text-slate-300">{log.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* ── CONFIRM THREAT ACTION MODAL ── */}
        {threatActionConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#090F22] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <h3 className="font-bold text-lg text-white mb-2">
                Confirm {threatActionConfirmModal.action === 'freeze' ? 'Permanent Freeze' : 'Authorization'}
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                {threatActionConfirmModal.action === 'freeze'
                  ? `Are you sure you want to permanently freeze ${threatActionConfirmModal.threat.entity}? This card will be immediately terminated across all networks.`
                  : `Are you sure you want to override the security heuristic and release ${threatActionConfirmModal.threat.amount} for settlement?`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setThreatActionConfirmModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/5 cursor-pointer text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const tid = threatActionConfirmModal.threat.id;
                    setAdminThreats((prev) => prev.filter((t) => t.id !== tid));
                    showToast(
                      threatActionConfirmModal.action === 'freeze'
                        ? `⚠️ Threat ${tid} frozen and card destroyed.`
                        : `✓ Threat ${tid} authorized and released.`
                    );
                    setThreatActionConfirmModal(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shadow-md ${
                    threatActionConfirmModal.action === 'freeze' ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── EMERGENCY MODAL ── */}
        {emergencyConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#120606] border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-2 text-red-500 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold text-lg text-white">Emergency Killswitch Confirmation</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {emergencyConfirmModal.type === 'wire'
                  ? 'This action will instantly halt all outward wire settlements across all client accounts. Are you sure you wish to proceed?'
                  : 'This action will pause all nightly automated sweep calculations and yield payouts. Are you sure you wish to proceed?'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setEmergencyConfirmModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/5 cursor-pointer text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (emergencyConfirmModal.type === 'wire') {
                      setIsGlobalWireFrozen(!isGlobalWireFrozen);
                      showToast(!isGlobalWireFrozen ? '⚠️ GLOBAL WIRE FREEZE ACTIVATED.' : '✓ Global wire freeze disarmed.');
                    } else {
                      setIsAutomationShutdown(!isAutomationShutdown);
                      showToast(!isAutomationShutdown ? '⚠️ AUTOMATION SHUTDOWN ENFORCED.' : '✓ Automation restored.');
                    }
                    setEmergencyConfirmModal(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Emergency State
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F1B31] text-white px-5 py-3 rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-3 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // =====================================================================
  // VIEW 4: EXACT PRESERVED PUBLIC HOMEPAGE (currentView === 'main')
  // CRITICAL REQUIREMENT: PRESERVED 100% VISUALLY AND FUNCTIONALLY UNCHANGED
  // =====================================================================
  return (
    <div className="min-h-screen bg-[#E6EDF6] text-[#020C21] font-sans antialiased overflow-x-hidden selection:bg-[#4A78B0] selection:text-white">
      {/* ──────────────────────────────────────────────────────────
          HERO SECTION: PRESERVED FULL-VIEWPORT ARCHITECTURE
          ────────────────────────────────────────────────────────── */}
      <section className="hero-stage" id="hero">
        <div className="hero-card">
          <video
            className="bg-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_105822_bf7c2d53-9957-4521-bbbf-7c1ab7a70130.png"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_105953_21ad8049-9088-4a00-bad3-aee6b5575a2b.mp4"
          />
          <div className="hero-tint" />
          <div className="hero-stack">
            {/* HEADER ROW */}
            <div className="hero-row">
              <a className="brand l t" style={{ ['--x' as any]: 68, ['--y' as any]: 47 }} href="#hero">
                <svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <defs>
                    <clipPath id="gclip">
                      <circle cx="20" cy="20" r="18.2" />
                    </clipPath>
                  </defs>
                  <circle cx="20" cy="20" r="18.4" stroke="#0d1b30" strokeWidth="1.1" />
                  <g clipPath="url(#gclip)" stroke="#0d1b30" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13.2 4.6c3-.9 6.2-1 9.2-.1" strokeWidth="1.7" />
                    <path d="M5.6 9.2c3.8-1.9 8-2.4 11.7-1.2 2.5.8 4.3 2.1 6.6 2.3 2 .2 4.2-.4 6.4-1.5" strokeWidth="2.3" />
                    <path d="M2.6 13.9c4.4-2.4 9.4-3 13.6-1.5 2.4.9 4.1 2.3 6.4 2.4 2.3.1 4.7-1 7.1-2.4 1.6-.9 3.4-1.4 5.3-1.4" strokeWidth="2.7" />
                    <path d="M1.6 18.7c4.8-2.7 10.1-3.2 14.4-1.6 1.8.7 3.2 1.6 4.7 2.1-1.7 1.3-3.4 2.2-5.1 2.6 2.9.5 5.9-.1 8.8-1.5 1.5-.7 2.9-1.6 4.4-2.3 1.9-.9 3.9-1.3 5.9-1.1" strokeWidth="2.9" />
                    <path d="M1.9 24.1c4.5-2.4 9.6-3 13.9-1.6 2.3.7 4 1.9 6.2 2 2.4.1 5-.9 7.5-2.3 1.6-.9 3.3-1.4 5-1.4" strokeWidth="2.8" />
                    <path d="M3.7 28.8c4.1-2 8.7-2.5 12.6-1.3 2.2.7 3.8 1.8 5.9 1.8 2.3.1 4.8-.8 7.1-2.1 1.2-.7 2.5-1.1 3.8-1.2" strokeWidth="2.4" />
                    <path d="M7.6 32.9c3.5-1.5 7.4-1.9 10.6-.9 1.9.6 3.3 1.4 5 1.5 1.6.1 3.3-.3 5-1.1" strokeWidth="1.9" />
                    <path d="M13.6 35.8c2.8-.9 5.8-1 8.6-.2" strokeWidth="1.5" />
                  </g>
                </svg>
                <b className="sx" style={{ ['--sx' as any]: 0.894 }}>
                  ConSentinel
                </b>
              </a>

              <button
                className="burger-btn"
                type="button"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <i />
                <i />
              </button>

              <div className="mobile-menu" data-open={isMenuOpen ? '' : undefined}>
                <nav className="nav-pill" aria-label="Primary Navigation">
                  <a href="#public-overview" onClick={() => setIsMenuOpen(false)}>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </a>
                  <hr className="nav-divider" aria-hidden="true" />
                  <a href="#flowchart" onClick={() => setIsMenuOpen(false)}>
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>Architecture</span>
                  </a>
                  <hr className="nav-divider" aria-hidden="true" />
                  <a href="#security" onClick={() => setIsMenuOpen(false)}>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Security</span>
                  </a>
                  <hr className="nav-divider" aria-hidden="true" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigateTo('login');
                    }}
                    className="text-xs font-bold text-[#0F1B31] cursor-pointer"
                  >
                    Sign In
                  </button>
                </nav>

                {/* USER PROFILE OR LOGIN BUTTON IN HEADER */}
                <div
                  className="hero-cta l t r flex items-center justify-between px-4"
                  style={{ ['--x' as any]: 58, ['--y' as any]: 30 }}
                >
                  {currentUser ? (
                    <div className="w-full flex items-center justify-between">
                      <button
                        onClick={() => navigateTo(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
                        className="flex items-center gap-2 cursor-pointer text-left"
                      >
                        <div
                          className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs ${
                            currentUser.role === 'admin' ? 'bg-amber-600' : 'bg-[#4A78B0]'
                          }`}
                        >
                          {currentUser.avatarText}
                        </div>
                        <div className="leading-tight">
                          <div className="text-white text-xs font-medium truncate max-w-[90px]">{currentUser.name}</div>
                          <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                            {currentUser.role === 'admin' ? 'ADMIN' : 'USER'}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="hero-knob hover:scale-105 transition cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigateTo('login')}
                      className="w-full flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-white text-sm font-medium pl-3">Sign In</span>
                      <span className="hero-knob">
                        <LogIn className="w-4 h-4 text-white" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* HERO BLOCK */}
            <div className="hero-blk">
              <p className="eyebrow l c sx" style={{ ['--x' as any]: 65.7, ['--y' as any]: -209.2, ['--sx' as any]: 0.9293 }}>
                Your digital banking infrastructure
              </p>
              <h1 className="hero-title l c" style={{ ['--x' as any]: 62.6, ['--y' as any]: -167.3 }}>
                <span className="sx" style={{ ['--sx' as any]: 0.9431 }}>
                  Smarter Banking
                </span>
                <br />
                <span className="sx" style={{ ['--sx' as any]: 0.9792 }}>
                  Starts Here
                </span>
              </h1>
              <div className="hero-tagrow">
                <span
                  className="play-btn l c"
                  style={{ ['--x' as any]: 66, ['--y' as any]: 34 }}
                  onClick={() => {
                    if (currentUser) {
                      navigateTo(currentUser.role === 'admin' ? 'admin' : 'dashboard');
                    } else {
                      navigateTo('login');
                    }
                  }}
                  title={currentUser ? 'Access Portal' : 'Sign in to access features'}
                >
                  <svg viewBox="0 0 13 14" fill="none" aria-hidden="true">
                    <path d="M1.4 1.3 11.6 7 1.4 12.7z" fill="#0b1526" />
                  </svg>
                </span>
                <span className="hero-tag l c sx" style={{ ['--x' as any]: 131, ['--y' as any]: 48.7, ['--sx' as any]: 0.8973 }}>
                  Autonomous Wealth. Protect What Matters.
                </span>
              </div>

              {/* GLASS PANEL ON RIGHT */}
              <aside className="hero-panel l c r" style={{ ['--x' as any]: 58, ['--y' as any]: -165 }}>
                <span className="p-title sx" style={{ ['--sx' as any]: 0.8707 }}>
                  AI-Driven
                </span>
                <span className="panel-dot" />
                <span className="panel-shield">
                  <svg viewBox="0 0 30 39" fill="none" aria-hidden="true">
                    <path d="M15 1.2 1.6 6.6v13.1c0 6.6 5.1 12.6 13.4 17.9 8.3-5.3 13.4-11.3 13.4-17.9V6.6z" stroke="#101c33" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M2.1 18.9c4.6-1.1 8.9-1.6 12.9-1.6s8.3.5 12.9 1.6" stroke="#101c33" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <p className="p-sub sx" style={{ ['--sx' as any]: 0.8899 }}>
                  Smart Banking
                  <br />
                  Infrastructure &
                  <br />
                  Fraud Protection
                </p>
                <div className="panel-scale">
                  <span>10K</span>
                  <span>50K</span>
                  <span>250K</span>
                  <span>1M+</span>
                </div>
                <div className="panel-track">
                  <i />
                </div>
              </aside>
            </div>

            {/* STATS & MEET PILL ROW */}
            <div className="hero-row">
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-num l b sx" style={{ ['--x' as any]: 64, ['--y' as any]: 60.4, ['--sx' as any]: 1 }}>
                    112+
                  </span>
                  <span className="stat-lbl l b sx" style={{ ['--x' as any]: 295, ['--y' as any]: 73.2, ['--sx' as any]: 0.9634 }}>
                    Countries
                    <br />
                    Protected
                    <br />
                    Globally
                  </span>
                </div>
                <span className="stat-slash l b" style={{ ['--x' as any]: 418, ['--y' as any]: 76 }} />
                <div className="hero-stat">
                  <span className="stat-num l b sx" style={{ ['--x' as any]: 480, ['--y' as any]: 60.4, ['--sx' as any]: 0.9858 }}>
                    55K+
                  </span>
                  <span className="stat-lbl l b sx" style={{ ['--x' as any]: 716, ['--y' as any]: 96.7, ['--sx' as any]: 0.9209 }}>
                    Accounts
                    <br />
                    Secured
                  </span>
                </div>
              </div>

              <button
                className="meet-pill l b r cursor-pointer text-left"
                style={{ ['--x' as any]: 59, ['--y' as any]: 66 }}
                onClick={() => {
                  if (currentUser) {
                    navigateTo(currentUser.role === 'admin' ? 'admin' : 'dashboard');
                  } else {
                    navigateTo('login');
                  }
                }}
              >
                <span className="meet-thumb">
                  <img
                    alt=""
                    style={{ objectPosition: '60% 50%' }}
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_105822_bf7c2d53-9957-4521-bbbf-7c1ab7a70130.png"
                  />
                </span>
                <b>{currentUser ? (currentUser.role === 'admin' ? 'Admin Console' : 'Open Dashboard') : 'Sign In'}</b>
                <span className="meet-knob">
                  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="m6.6 3.6 6 5.4-6 5.4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Scroll Mouse Cue */}
            <a
              href="#public-overview"
              className="scroll-mouse-hint"
              aria-label="Scroll to explore features"
            >
              <div className="mouse-icon">
                <div className="mouse-wheel" />
              </div>
              <span>Scroll</span>
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          MAIN BODY: LOGGED OUT PUBLIC VIEW
          ────────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-[1240px] mx-auto px-6 py-20 space-y-32">
        {/* Public Login Gate Card */}
        <section id="public-overview" className="scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out space-y-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/95 via-white/85 to-blue-50/70 border border-white/95 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A78B0] mb-2">
                <Lock className="w-3.5 h-3.5" />
                Authentication Required
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#020C21] tracking-tight">
                Sign in to access your autonomous banking dashboard.
              </h2>
              <p className="text-sm text-[#59627E] mt-3 leading-relaxed">
                To protect capital and confidential treasury ledgers, internal features such as Compound Yield, Balance Forecasters, Conversational AI Assistant, and Multi-Account Liquidity are accessible exclusively after logging in.
              </p>
            </div>

            {/* Dual Log In CTA Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  setLoginRoleTab('user');
                  navigateTo('login');
                }}
                className="px-6 py-3.5 rounded-xl bg-[#4A78B0] text-white text-xs font-semibold hover:bg-[#386191] transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <User className="w-4 h-4" />
                Client User Login
              </button>
              <button
                onClick={() => {
                  setLoginRoleTab('admin');
                  navigateTo('login');
                }}
                className="px-6 py-3.5 rounded-xl bg-[#0F1B31] text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                Admin Console Login
              </button>
            </div>
          </div>
        </section>

        {/* ── ARCHITECTURE FLOWCHART ── */}
        <section id="flowchart" className="scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4A78B0] mb-2 inline-block">
              Core Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#020C21]">
              Autonomous Liquidity & Threat Radar Pipeline
            </h2>
            <p className="text-sm text-[#59627E] mt-2">
              Every transaction passes through our five-layer cryptographic protection network in under 2.4 milliseconds.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl p-6 sm:p-10 shadow-sm">
            {/* Interactive Flow Diagram Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {flowNodes.map((node, i) => (
                <div key={node.id} className="relative flex flex-col">
                  <button
                    onClick={() => setActiveFlowNode(i)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer h-full flex flex-col justify-between ${
                      activeFlowNode === i
                        ? 'bg-[#0F1B31] text-white border-[#0F1B31] shadow-lg scale-102'
                        : 'bg-white/90 border-slate-200/80 text-[#020C21] hover:border-[#4A78B0]'
                    }`}
                  >
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-3 ${
                          activeFlowNode === i ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#4A78B0]'
                        }`}
                      >
                        {node.badge}
                      </span>
                      <h4 className="font-semibold text-xs leading-snug">{node.title}</h4>
                      <p className={`text-[11px] mt-1 ${activeFlowNode === i ? 'text-slate-300' : 'text-[#59627E]'}`}>
                        {node.sub}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] pt-3 border-t border-black/5">
                      <span className={activeFlowNode === i ? 'text-white font-medium' : 'text-slate-400'}>
                        Layer 0{i + 1}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Active Node Detail Card */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-[#4A78B0] uppercase tracking-wider">
                  Deep Technical Telemetry
                </span>
                <h4 className="font-semibold text-base text-[#020C21] mt-0.5">
                  {flowNodes[activeFlowNode].title}
                </h4>
                <p className="text-sm text-[#020C21] mt-1 leading-relaxed max-w-2xl">
                  {flowNodes[activeFlowNode].detail}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-semibold">
                  Latency: 2.4ms
                </span>
                <span className="text-xs font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold">
                  Pass Rate: 99.98%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECURITY ARCHITECTURE ── */}
        <section id="security" className="scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4A78B0] mb-2 inline-block">
              Bank-Grade Compliance
            </span>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#020C21]">
              Engineered with quantum-ready protection.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '$5,000,000 FDIC',
                sub: 'Federal Backing',
                desc: 'Eligible funds swept across insured depository network partner banks.'
              },
              {
                title: 'SOC 2 Type II',
                sub: 'Continuous Audit',
                desc: 'Independently certified for confidentiality, privacy, and asset integrity.'
              },
              {
                title: '256-bit AES Cryptography',
                sub: 'HSM Encrypted',
                desc: 'Payment tokens and API keys protected by hardware security modules.'
              },
              {
                title: 'Zero-Knowledge Biometrics',
                sub: 'User Authorization',
                desc: 'Every wire transfer verified with local on-device hardware biometrics.'
              }
            ].map((sec, i) => (
              <div key={i} className="p-6 bg-white/75 backdrop-blur-2xl border border-white/90 rounded-2xl shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4A78B0] block mb-2">
                  {sec.sub}
                </span>
                <h4 className="font-semibold text-base text-[#020C21] mb-2">{sec.title}</h4>
                <p className="text-xs text-[#59627E] leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ACCORDION ── */}
        <section className="scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4A78B0] mb-2 inline-block">
              Direct Answers
            </span>
            <h2 className="text-3xl font-medium tracking-tight text-[#020C21]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does Sentinel move money between checking and 5.20% APY vaults?',
                a: 'Sentinel tracks your liquidity requirements against upcoming scheduled drafts and payroll. Any surplus balance above your custom floor is automatically swept into insured vaults. If a bill arrives, funds are swept back instantaneously in under 2 seconds.'
              },
              {
                q: 'What is the difference between Client User and Admin access?',
                a: 'Client Users access their dedicated company balance sheets, cards, forecasters, and conversational assistant. System Admins monitor the entire network liquidity ($4.8B), zero-day threat quarantines, and global clearing nodes.'
              },
              {
                q: 'Can the assistant execute external wire transfers without my approval?',
                a: 'Never. Sentinel prepares transactions, categorizes invoices, and models cash impact, but external outbound transfers always require your explicit 1-tap confirmation or biometric verification (Face ID / Touch ID).'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white/75 backdrop-blur-2xl border border-white/90 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-5 text-left font-medium text-sm text-[#020C21] flex justify-between items-center cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 text-xs text-[#59627E] leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/5 bg-white/40 mt-32 py-12">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#59627E]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#020C21]">ConSentinel Banking</span>
              <span>· Autonomous Treasury Intelligence</span>
            </div>
            <div className="flex gap-6">
              <a href="#hero" className="hover:text-black transition">Overview</a>
              <a href="#flowchart" className="hover:text-black transition">Architecture</a>
              <a href="#security" className="hover:text-black transition">Security</a>
              {!currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setLoginRoleTab('user');
                      navigateTo('login');
                    }}
                    className="hover:text-black transition font-semibold cursor-pointer"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => {
                      setLoginRoleTab('admin');
                      navigateTo('login');
                    }}
                    className="hover:text-black transition font-semibold cursor-pointer text-amber-600"
                  >
                    Admin Login
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="hover:text-red-600 transition font-semibold cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
            ConSentinel Banking is a financial technology platform. Deposit accounts provided by partner depository institutions, Members FDIC. APY rates are variable and updated dynamically. All investment forecasts are simulated for planning purposes.
          </p>
        </div>
      </footer>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F1B31] text-white px-5 py-3 rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-3 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#4A78B0]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
