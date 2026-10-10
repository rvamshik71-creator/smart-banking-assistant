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
  Target,
  Calculator,
  UserPlus,
  Mail,
  Phone,
  Info,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// ── Visual Assets ──────────────────────────────────────────────────────
const LOGIN_CRYSTAL_IMAGE = '/src/assets/images/login_financial_crystal_1791527196459.jpg';
const AVATAR_CLIENT_IMAGE = '/src/assets/images/avatar_client_executive_1791527209455.jpg';
const AVATAR_ADMIN_IMAGE = '/src/assets/images/avatar_admin_officer_1791527220213.jpg';

// ── Types ──────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  name: string;
  category: 'Salary' | 'Food' | 'Shopping' | 'Bills' | 'Transport' | 'Other';
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  account: string;
}

interface BankAccount {
  id: string;
  name: string;
  number: string;
  fullNumber: string;
  balance: number;
  type: 'Savings Account' | 'Current Account';
  status: 'ACTIVE' | 'DORMANT';
  createdDate: string;
}

interface BudgetCategory {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  avatarText: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

// ── Sample Demo Users (Academic Project Data) ──────────────────────────
const DEMO_USER: UserProfile = {
  id: 'u-1',
  name: 'Vamshi Krishna',
  email: '25r21a67b5@mlrit.ac.in',
  phone: '+91 9876543210',
  role: 'USER',
  avatarText: 'VK'
};

const DEMO_ADMIN: UserProfile = {
  id: 'adm-1',
  name: 'Abhiram (Admin)',
  email: '25r21a67A0@mlrit.ac.in',
  phone: '+91 9876543211',
  role: 'ADMIN',
  avatarText: 'AB'
};

export default function App() {
  // ── Navigation & Auth State ──────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'admin'>('main');

  // Dashboard & Admin active tab
  const [userActiveTab, setUserActiveTab] = useState<
    'overview' | 'accounts' | 'transfer' | 'history' | 'spending' | 'budget' | 'savings' | 'emi' | 'banko' | 'settings'
  >('overview');

  const [adminActiveTab, setAdminActiveTab] = useState<
    'overview' | 'users' | 'accounts' | 'transactions' | 'transfers' | 'reports' | 'settings'
  >('overview');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // URL / View Synchronization
  const navigateTo = (view: 'main' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'admin') => {
    if (view === 'dashboard' && currentUser?.role !== 'USER') {
      setCurrentView('login');
      window.history.pushState(null, '', '/login');
      return;
    }
    if (view === 'admin' && currentUser?.role !== 'ADMIN') {
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
      else if (p === '/register') setCurrentView('register');
      else if (p === '/forgot-password') setCurrentView('forgot-password');
      else if (p === '/dashboard') {
        if (currentUser?.role === 'USER') setCurrentView('dashboard');
        else setCurrentView('login');
      } else if (p === '/admin') {
        if (currentUser?.role === 'ADMIN') setCurrentView('admin');
        else setCurrentView('login');
      } else {
        setCurrentView('main');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // ── Banking State ────────────────────────────────────────────────────
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: 'acc-1',
      name: 'Savings Account',
      number: '•••• 4192',
      fullNumber: 'SB-4192881052',
      balance: 45250.0,
      type: 'Savings Account',
      status: 'ACTIVE',
      createdDate: '12 Jan 2026'
    },
    {
      id: 'acc-2',
      name: 'Current Account',
      number: '•••• 8821',
      fullNumber: 'CA-8821903411',
      balance: 120000.0,
      type: 'Current Account',
      status: 'ACTIVE',
      createdDate: '04 Mar 2026'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-101', name: 'Monthly Salary Credited', category: 'Salary', date: 'Today, 10:00 AM', amount: 45000.0, type: 'credit', status: 'SUCCESS', account: 'Savings Account' },
    { id: 'TX-102', name: 'Grocery Supermarket & Meals', category: 'Food', date: 'Today, 12:30 PM', amount: 2500.0, type: 'debit', status: 'SUCCESS', account: 'Savings Account' },
    { id: 'TX-103', name: 'Clothing & Retail Store', category: 'Shopping', date: 'Yesterday, 4:15 PM', amount: 3200.0, type: 'debit', status: 'SUCCESS', account: 'Savings Account' },
    { id: 'TX-104', name: 'Electricity & Utility Bill', category: 'Bills', date: 'Oct 06, 2026', amount: 1500.0, type: 'debit', status: 'SUCCESS', account: 'Savings Account' },
    { id: 'TX-105', name: 'Fuel & Metro Travel', category: 'Transport', date: 'Oct 05, 2026', amount: 1200.0, type: 'debit', status: 'SUCCESS', account: 'Savings Account' },
    { id: 'TX-106', name: 'Weekend Dining & Snacks', category: 'Food', date: 'Oct 03, 2026', amount: 1800.0, type: 'debit', status: 'SUCCESS', account: 'Savings Account' },
    { id: 'TX-107', name: 'Freelance Project Settlement', category: 'Other', date: 'Oct 01, 2026', amount: 25000.0, type: 'credit', status: 'SUCCESS', account: 'Current Account' }
  ]);

  // ── Budgets State ────────────────────────────────────────────────────
  const [budgets, setBudgets] = useState<BudgetCategory[]>([
    { id: 'b-1', category: 'Food', limit: 6000, spent: 4300 },
    { id: 'b-2', category: 'Shopping', limit: 5000, spent: 3200 },
    { id: 'b-3', category: 'Bills', limit: 3000, spent: 1500 },
    { id: 'b-4', category: 'Transport', limit: 2000, spent: 1200 }
  ]);

  // ── Savings Goals State ──────────────────────────────────────────────
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { id: 'sg-1', name: 'Emergency Fund', targetAmount: 50000, currentAmount: 32500, targetDate: '31 Dec 2026', status: 'IN_PROGRESS' },
    { id: 'sg-2', name: 'New Laptop', targetAmount: 65000, currentAmount: 24000, targetDate: '31 Mar 2027', status: 'IN_PROGRESS' },
    { id: 'sg-3', name: 'Certifications & Education', targetAmount: 15000, currentAmount: 15000, targetDate: '30 Sep 2026', status: 'COMPLETED' }
  ]);

  // ── Money Transfer Form State ────────────────────────────────────────
  const [transferSenderAccId, setTransferSenderAccId] = useState('acc-1');
  const [transferReceiverAcc, setTransferReceiverAcc] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [transferStatusMsg, setTransferStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── EMI Calculator State ─────────────────────────────────────────────
  const [emiLoanAmount, setEmiLoanAmount] = useState(100000);
  const [emiInterestRate, setEmiInterestRate] = useState(10.5);
  const [emiTenureMonths, setEmiTenureMonths] = useState(24);

  // EMI Math Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calcMonthlyRate = emiInterestRate / 12 / 100;
  const calculatedEmi = Math.round(
    (emiLoanAmount * calcMonthlyRate * Math.pow(1 + calcMonthlyRate, emiTenureMonths)) /
      (Math.pow(1 + calcMonthlyRate, emiTenureMonths) - 1)
  );
  const totalRepayment = calculatedEmi * emiTenureMonths;
  const totalInterest = Math.max(0, totalRepayment - emiLoanAmount);

  // ── BANKO AI Assistant Chat State ────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: "Hi! I'm BANKO. How can I help you with your banking today?",
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // ── Authentication Form State ────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'USER' | 'ADMIN'>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  // Public Homepage State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // ── Calculation Helpers ──────────────────────────────────────────────
  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  // Spending categories aggregate
  const spendingByCategory = transactions
    .filter((t) => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const highestSpendingCategory = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0] || [
    'Food',
    4300
  ];

  // ── Transfer Execution Handler ───────────────────────────────────────
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferStatusMsg(null);

    const amt = parseFloat(transferAmount);
    if (!transferReceiverAcc.trim()) {
      setTransferStatusMsg({ type: 'error', text: 'Please enter a valid receiver account number.' });
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setTransferStatusMsg({ type: 'error', text: 'Please enter a valid transfer amount greater than ₹0.00.' });
      return;
    }

    const sender = accounts.find((a) => a.id === transferSenderAccId);
    if (!sender) {
      setTransferStatusMsg({ type: 'error', text: 'Selected sender account not found.' });
      return;
    }

    if (amt > sender.balance) {
      setTransferStatusMsg({
        type: 'error',
        text: `Insufficient balance! Available in ${sender.name}: ₹${sender.balance.toLocaleString('en-IN')}`
      });
      return;
    }

    // Execute transfer: deduct sender
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === sender.id ? { ...acc, balance: acc.balance - amt } : acc))
    );

    // Create transaction record
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      name: `Transfer to ${transferReceiverAcc}`,
      category: 'Other',
      date: 'Just now',
      amount: amt,
      type: 'debit',
      status: 'SUCCESS',
      account: sender.name
    };

    setTransactions((prev) => [newTx, ...prev]);
    setTransferAmount('');
    setTransferReceiverAcc('');
    setTransferDescription('');
    setTransferStatusMsg({
      type: 'success',
      text: `Transfer of ₹${amt.toLocaleString('en-IN')} completed successfully! Transaction ID: ${newTx.id}`
    });
    showToast(`✓ ₹${amt.toLocaleString('en-IN')} transferred successfully.`);
  };

  // ── BANKO AI Prompt Handler ──────────────────────────────────────────
  const handleSendBankoPrompt = async (promptText: string) => {
    const query = promptText.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
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
            userName: currentUser?.name || 'Vamshi Krishna',
            totalBalance,
            accounts: accounts.map((a) => ({ name: a.name, balance: a.balance })),
            monthlyExpenses: totalExpenses,
            highestCategory: highestSpendingCategory[0],
            savingsGoals: savingsGoals.map((g) => ({ name: g.name, current: g.currentAmount, target: g.targetAmount }))
          }
        })
      });

      const data = await res.json();
      const reply = data.reply || "I'm BANKO, your smart banking assistant. Your accounts are secure and updated.";

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // TTS voice feedback
      if (isTtsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply.slice(0, 200));
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: `Hi! I'm BANKO. Your total balance across accounts is ₹${totalBalance.toLocaleString('en-IN')}. This month you've spent ₹${totalExpenses.toLocaleString('en-IN')}, with ${highestSpendingCategory[0]} being your highest expense.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAssistantThinking]);

  // Voice recognition toggle
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser.');
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsVoiceActive(true);
        showToast('BANKO is listening... speak your question now.');
      };

      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setChatInput(text);
        handleSendBankoPrompt(text);
      };

      recognition.onerror = () => setIsVoiceActive(false);
      recognition.onend = () => setIsVoiceActive(false);
      recognition.start();
    } catch {
      setIsVoiceActive(false);
    }
  };

  // ── Auth Handlers ────────────────────────────────────────────────────
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingAuth(true);

    setTimeout(() => {
      setIsSubmittingAuth(false);
      if (loginRole === 'ADMIN') {
        setCurrentUser(DEMO_ADMIN);
        navigateTo('admin');
        showToast('✓ Welcome, Abhiram. Admin access granted.');
      } else {
        setCurrentUser(DEMO_USER);
        navigateTo('dashboard');
        showToast('✓ Welcome back, Vamshi Krishna.');
      }
    }, 450);
  };

  const handleDemoLogin = (role: 'USER' | 'ADMIN') => {
    setIsSubmittingAuth(true);
    setTimeout(() => {
      setIsSubmittingAuth(false);
      if (role === 'ADMIN') {
        setCurrentUser(DEMO_ADMIN);
        navigateTo('admin');
        showToast('✓ Logged in as Admin: Abhiram.');
      } else {
        setCurrentUser(DEMO_USER);
        navigateTo('dashboard');
        showToast('✓ Logged in as User: Vamshi Krishna.');
      }
    }, 350);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmittingAuth(true);
    setTimeout(() => {
      setIsSubmittingAuth(false);
      const newUser: UserProfile = {
        id: `u-${Date.now()}`,
        name: regName,
        email: regEmail,
        phone: regPhone || '+91 9876543210',
        role: 'USER',
        avatarText: regName.slice(0, 2).toUpperCase()
      };
      setCurrentUser(newUser);
      navigateTo('dashboard');
      showToast('✓ Account registered successfully! Welcome to Smart Banking Assistant.');
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotMsg(`Password reset instructions have been dispatched to ${forgotEmail}.`);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    navigateTo('main');
    showToast('You have signed out successfully.');
  };

  // ── CSV Export ───────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Description', 'Category', 'Date', 'Amount (INR)', 'Type', 'Status', 'Account'];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.name.replace(/"/g, '""')}"`,
      t.category,
      t.date,
      t.amount.toFixed(2),
      t.type,
      t.status,
      t.account
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Smart_Banking_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Transaction ledger CSV downloaded.');
  };

  // =====================================================================
  // VIEW: LOGIN PAGE (/login)
  // =====================================================================
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#060A13] text-white font-sans antialiased flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600">
        <header className="max-w-6xl mx-auto w-full py-3 flex justify-between items-center">
          <button
            onClick={() => navigateTo('main')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Smart Banking Assistant · Academic Project</span>
          </div>
        </header>

        <div className="max-w-md w-full mx-auto my-auto bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Login to Your Account</h2>
            <p className="text-xs text-slate-400 mt-1">Smart Banking Assistant — Powered by BANKO</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 border border-white/10 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => {
                setLoginRole('USER');
                setLoginError(null);
              }}
              className={`py-2.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                loginRole === 'USER' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginRole('ADMIN');
                setLoginError(null);
              }}
              className={`py-2.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                loginRole === 'ADMIN' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Portal
            </button>
          </div>

          {/* 1-Click Demo Login Box */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-5 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                College Project Demo Access
              </span>
              <span className="text-xs font-semibold text-white block">
                {loginRole === 'USER' ? 'Vamshi Krishna (Student User)' : 'Abhiram (Project Admin)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleDemoLogin(loginRole)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
            >
              1-Click Login
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={loginRole === 'USER' ? '25r21a67b5@mlrit.ac.in' : '25r21a67A0@mlrit.ac.in'}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => navigateTo('forgot-password')}
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
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmittingAuth ? 'Verifying Credentials...' : `Sign In as ${loginRole === 'ADMIN' ? 'Admin' : 'User'}`}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
            Don't have an account?{' '}
            <button
              onClick={() => navigateTo('register')}
              className="text-cyan-400 font-semibold hover:underline cursor-pointer"
            >
              Register here
            </button>
          </div>
        </div>

        <footer className="text-center py-4 text-[11px] text-slate-500">
          Smart Banking Assistant — Powered by BANKO · Developed by MLRIT Students
        </footer>
      </div>
    );
  }

  // =====================================================================
  // VIEW: REGISTRATION PAGE (/register)
  // =====================================================================
  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-[#060A13] text-white font-sans antialiased flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600">
        <header className="max-w-6xl mx-auto w-full py-3 flex justify-between items-center">
          <button
            onClick={() => navigateTo('main')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <div className="text-xs text-slate-400">Account Registration</div>
        </header>

        <div className="max-w-md w-full mx-auto my-auto bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Create an Account</h2>
            <p className="text-xs text-slate-400 mt-1">Join Smart Banking Assistant (BANKO)</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Vamshi Krishna"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="25r21a67b5@mlrit.ac.in"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Create password"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            {regError && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {regError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md mt-2 disabled:opacity-50"
            >
              {isSubmittingAuth ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
            Already registered?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="text-cyan-400 font-semibold hover:underline cursor-pointer"
            >
              Log in here
            </button>
          </div>
        </div>

        <footer className="text-center py-4 text-[11px] text-slate-500">
          Developed by MLRIT Students: Vamshi Krishna, Abhiram, Priyanshu
        </footer>
      </div>
    );
  }

  // =====================================================================
  // VIEW: FORGOT PASSWORD PAGE (/forgot-password)
  // =====================================================================
  if (currentView === 'forgot-password') {
    return (
      <div className="min-h-screen bg-[#060A13] text-white font-sans antialiased flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600">
        <header className="max-w-6xl mx-auto w-full py-3 flex justify-between items-center">
          <button
            onClick={() => navigateTo('login')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
          <div className="text-xs text-slate-400">Password Recovery</div>
        </header>

        <div className="max-w-md w-full mx-auto my-auto bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <KeyRound className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your registered email to receive reset instructions.
            </p>
          </div>

          {forgotMsg ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center leading-relaxed">
              {forgotMsg}
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="25r21a67b5@mlrit.ac.in"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
            Remembered your password?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="text-cyan-400 font-semibold hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>

        <footer className="text-center py-4 text-[11px] text-slate-500">
          Smart Banking Assistant — Powered by BANKO
        </footer>
      </div>
    );
  }

  // =====================================================================
  // VIEW: USER DASHBOARD (/dashboard)
  // =====================================================================
  if (currentView === 'dashboard' && currentUser?.role === 'USER') {
    return (
      <div className="min-h-screen bg-[#070B14] text-white font-sans antialiased flex selection:bg-blue-600">
        {/* ── SIDEBAR NAVIGATION ── */}
        <aside
          className={`hidden md:flex flex-col justify-between border-r border-white/10 bg-[#0A0F1D]/95 backdrop-blur-2xl transition-all duration-300 z-30 shrink-0 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div>
            <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="truncate">
                    <span className="font-bold text-sm text-white block">Smart Banking</span>
                    <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                      Powered by BANKO
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <nav className="p-3 space-y-1">
              {[
                { id: 'overview', label: 'Dashboard', icon: PieChart },
                { id: 'accounts', label: 'My Accounts', icon: DollarSign },
                { id: 'transfer', label: 'Money Transfer', icon: ArrowUpRight },
                { id: 'history', label: 'Transaction History', icon: FileText },
                { id: 'spending', label: 'Spending Analysis', icon: BarChart3 },
                { id: 'budget', label: 'Budget Planner', icon: Target },
                { id: 'savings', label: 'Savings Goals', icon: TrendingUp },
                { id: 'emi', label: 'EMI Calculator', icon: Calculator },
                { id: 'banko', label: 'BANKO AI', icon: Sparkles },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = userActiveTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setUserActiveTab(item.id as any)}
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

          <div className="p-3 border-t border-white/10">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.avatarText}
                </div>
                {!isSidebarCollapsed && (
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN DASHBOARD VIEWPORT ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <header className="h-20 border-b border-white/10 bg-[#0A0F1D]/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h2 className="text-base font-semibold text-white">Welcome, {currentUser.name}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Smart Banking Assistant</span>
                  <span>·</span>
                  <span className="text-cyan-400 font-medium">BANKO AI Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setUserActiveTab('banko')}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ask BANKO</span>
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
                className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 text-slate-400 hover:text-red-400 transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mobile Drawer */}
          {isMobileNavOpen && (
            <div className="md:hidden bg-[#0A0F1D] border-b border-white/10 p-4 space-y-1">
              {[
                { id: 'overview', label: 'Dashboard', icon: PieChart },
                { id: 'accounts', label: 'My Accounts', icon: DollarSign },
                { id: 'transfer', label: 'Money Transfer', icon: ArrowUpRight },
                { id: 'history', label: 'Transaction History', icon: FileText },
                { id: 'spending', label: 'Spending Analysis', icon: BarChart3 },
                { id: 'budget', label: 'Budget Planner', icon: Target },
                { id: 'savings', label: 'Savings Goals', icon: TrendingUp },
                { id: 'emi', label: 'EMI Calculator', icon: Calculator },
                { id: 'banko', label: 'BANKO AI', icon: Sparkles },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setUserActiveTab(item.id as any);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    userActiveTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'
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
            {/* TAB: DASHBOARD (OVERVIEW) */}
            {userActiveTab === 'overview' && (
              <div className="space-y-8">
                {/* 4 Overview Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                    <span className="text-xs text-slate-400 font-medium">Total Available Balance</span>
                    <div className="text-2xl font-bold text-white mt-1.5 tabular-nums">
                      ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-semibold mt-2">Across Savings & Current</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                    <span className="text-xs text-slate-400 font-medium">Current Month Income</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1.5 tabular-nums">
                      ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-2">Salary & Inflows</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                    <span className="text-xs text-slate-400 font-medium">Current Month Expenses</span>
                    <div className="text-2xl font-bold text-white mt-1.5 tabular-nums">
                      ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-amber-400 font-semibold mt-2">
                      Highest: {highestSpendingCategory[0]} (₹{highestSpendingCategory[1].toLocaleString('en-IN')})
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0E1528] border border-white/10 shadow-lg">
                    <span className="text-xs text-slate-400 font-medium">Total Saved in Goals</span>
                    <div className="text-2xl font-bold text-blue-400 mt-1.5 tabular-nums">
                      ₹{totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-blue-400 font-semibold mt-2">3 Active Savings Goals</div>
                  </div>
                </div>

                {/* Quick Action & BANKO Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* BANKO AI Spotlight */}
                  <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900/40 via-[#0E1528] to-[#0A0F1D] border border-blue-500/30 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span>BANKO — Your Smart Banking Assistant</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        "Hi! I'm BANKO. How can I help you with your banking today?"
                      </h3>
                      <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                        I can analyze your ₹{totalExpenses.toLocaleString('en-IN')} expenses, calculate loan EMIs, review your {savingsGoals[0].name} progress, or assist with money transfers.
                      </p>
                    </div>

                    <div className="pt-6 flex flex-wrap gap-2.5">
                      <button
                        onClick={() => {
                          setUserActiveTab('banko');
                          handleSendBankoPrompt('How much did I spend this month?');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition cursor-pointer"
                      >
                        "How much did I spend this month?"
                      </button>
                      <button
                        onClick={() => {
                          setUserActiveTab('banko');
                          handleSendBankoPrompt('What category do I spend the most on?');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition cursor-pointer"
                      >
                        "What is my highest expense?"
                      </button>
                      <button
                        onClick={() => setUserActiveTab('banko')}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer shadow-md"
                      >
                        Open BANKO Chat
                      </button>
                    </div>
                  </div>

                  {/* Savings Goal Quick Glance */}
                  <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-white">Savings Goal Progress</h4>
                      <button
                        onClick={() => setUserActiveTab('savings')}
                        className="text-xs text-cyan-400 hover:underline cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-white">{savingsGoals[0].name}</span>
                        <span className="text-cyan-400">
                          {Math.round((savingsGoals[0].currentAmount / savingsGoals[0].targetAmount) * 100)}%
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                          style={{
                            width: `${(savingsGoals[0].currentAmount / savingsGoals[0].targetAmount) * 100}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Saved: ₹{savingsGoals[0].currentAmount.toLocaleString('en-IN')}</span>
                        <span>Target: ₹{savingsGoals[0].targetAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => setUserActiveTab('transfer')}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                      >
                        Money Transfer
                      </button>
                      <button
                        onClick={() => setUserActiveTab('emi')}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition cursor-pointer"
                      >
                        Calculate EMI
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-semibold text-white">Recent Account Transactions</h3>
                      <p className="text-xs text-slate-400">Latest debits and credits recorded across accounts</p>
                    </div>
                    <button
                      onClick={() => setUserActiveTab('history')}
                      className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full History</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-white/5 overflow-x-auto">
                    {transactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
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
                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{tx.account}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MY ACCOUNTS */}
            {userActiveTab === 'accounts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">My Accounts</h2>
                    <p className="text-xs text-slate-400">View savings and current accounts</p>
                  </div>
                  <button
                    onClick={() => setUserActiveTab('transfer')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Transfer Money
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accounts.map((acc) => (
                    <div key={acc.id} className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-mono text-cyan-400">{acc.fullNumber}</span>
                          <h3 className="text-lg font-bold text-white mt-0.5">{acc.name}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                          {acc.status}
                        </span>
                      </div>

                      <div className="py-2">
                        <div className="text-xs text-slate-400">Available Balance</div>
                        <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                          ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                        <span>Created: {acc.createdDate}</span>
                        <button
                          onClick={() => {
                            setTransferSenderAccId(acc.id);
                            setUserActiveTab('transfer');
                          }}
                          className="text-cyan-400 hover:underline font-semibold cursor-pointer"
                        >
                          Transfer from this account
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MONEY TRANSFER */}
            {userActiveTab === 'transfer' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div>
                  <h2 className="text-xl font-bold text-white">Money Transfer</h2>
                  <p className="text-xs text-slate-400">Transfer funds between accounts or send to a recipient</p>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1528] border border-white/10 shadow-xl">
                  <form onSubmit={handleTransferSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Select Sender Account</label>
                      <select
                        value={transferSenderAccId}
                        onChange={(e) => setTransferSenderAccId(e.target.value)}
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                      >
                        {accounts.map((a) => (
                          <option key={a.id} value={a.id} className="bg-[#0E1528]">
                            {a.name} ({a.number}) — Available: ₹{a.balance.toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Receiver Account Number</label>
                      <input
                        type="text"
                        required
                        value={transferReceiverAcc}
                        onChange={(e) => setTransferReceiverAcc(e.target.value)}
                        placeholder="e.g. SB-8821903411 or recipient account"
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Amount (₹ INR)</label>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        required
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Payment Description / Note</label>
                      <input
                        type="text"
                        value={transferDescription}
                        onChange={(e) => setTransferDescription(e.target.value)}
                        placeholder="e.g. Rent, Course Fee, Books"
                        className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    {transferStatusMsg && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                          transferStatusMsg.type === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}
                      >
                        {transferStatusMsg.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{transferStatusMsg.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md mt-2"
                    >
                      Confirm & Send Transfer
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: TRANSACTION HISTORY */}
            {userActiveTab === 'history' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Transaction History</h2>
                    <p className="text-xs text-slate-400">Complete record of credits and debits</p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download CSV</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-[#0E1528] border border-white/10 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                        <tr>
                          <th className="p-4">Transaction</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Account</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Amount</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-white/5 transition">
                            <td className="p-4 font-semibold text-white">{tx.name}</td>
                            <td className="p-4 text-slate-300">{tx.category}</td>
                            <td className="p-4 text-slate-400">{tx.account}</td>
                            <td className="p-4 text-slate-400">{tx.date}</td>
                            <td
                              className={`p-4 text-right font-mono font-bold ${
                                tx.type === 'credit' ? 'text-emerald-400' : 'text-white'
                              }`}
                            >
                              {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-4 text-center">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SPENDING ANALYSIS */}
            {userActiveTab === 'spending' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Spending Analysis</h2>
                  <p className="text-xs text-slate-400">Understand where your money is spent</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Breakdown Card */}
                  <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                    <h3 className="text-sm font-semibold text-white">Monthly Expenditure by Category</h3>
                    <div className="space-y-3 pt-2">
                      {Object.entries(spendingByCategory).map(([cat, amt]) => {
                        const pct = Math.round((amt / totalExpenses) * 100);
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-300">{cat}</span>
                              <span className="font-mono text-white">
                                ₹{amt.toLocaleString('en-IN')} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Highlights */}
                  <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Monthly Summary</h3>
                      <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Monthly Spend:</span>
                          <strong className="text-white">₹{totalExpenses.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Highest Category:</span>
                          <strong className="text-amber-400">{highestSpendingCategory[0]} (₹{highestSpendingCategory[1].toLocaleString('en-IN')})</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Monthly Net Savings:</span>
                          <strong className="text-emerald-400">₹{(totalIncome - totalExpenses).toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
                      💡 <strong>BANKO Insight:</strong> Food and dining represent 40% of your expenses. Setting a ₹5,000 budget cap can help you save an additional ₹1,300 each month toward your Emergency Fund.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BUDGET PLANNER */}
            {userActiveTab === 'budget' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Budget Planner</h2>
                  <p className="text-xs text-slate-400">Set monthly limits and track remaining balances</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {budgets.map((b) => {
                    const remaining = Math.max(0, b.limit - b.spent);
                    const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
                    const isNearLimit = pct >= 80;

                    return (
                      <div key={b.id} className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-white text-base">{b.category}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isNearLimit ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {pct}% Used
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isNearLimit ? 'bg-amber-400' : 'bg-blue-600'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Budget</span>
                            <strong className="text-white">₹{b.limit.toLocaleString('en-IN')}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Spent</span>
                            <strong className="text-slate-200">₹{b.spent.toLocaleString('en-IN')}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Remaining</span>
                            <strong className="text-emerald-400">₹{remaining.toLocaleString('en-IN')}</strong>
                          </div>
                        </div>

                        {isNearLimit && (
                          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-300 text-[11px] flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Warning: Spending is approaching the allocated limit.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: SAVINGS GOALS */}
            {userActiveTab === 'savings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Savings Goals</h2>
                  <p className="text-xs text-slate-400">Track progress toward your personal targets</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {savingsGoals.map((goal) => {
                    const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                    return (
                      <div key={goal.id} className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 shadow-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white text-base">{goal.name}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              goal.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-blue-500/20 text-cyan-300'
                            }`}
                          >
                            {goal.status === 'COMPLETED' ? 'COMPLETED' : `${pct}% Done`}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs pt-1">
                            <span className="text-slate-400">Saved: ₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                            <span className="text-slate-400">Target: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="pt-2 text-[11px] text-slate-400 border-t border-white/5 flex justify-between">
                          <span>Target Date:</span>
                          <strong className="text-slate-200">{goal.targetDate}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: EMI & INTEREST CALCULATOR */}
            {userActiveTab === 'emi' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <h2 className="text-xl font-bold text-white">EMI & Interest Calculator</h2>
                  <p className="text-xs text-slate-400">Calculate monthly loan repayments, interest, and totals</p>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1528] border border-white/10 shadow-xl space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Loan Amount (Principal):</span>
                        <strong className="text-white font-mono">₹{emiLoanAmount.toLocaleString('en-IN')}</strong>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="1000000"
                        step="10000"
                        value={emiLoanAmount}
                        onChange={(e) => setEmiLoanAmount(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Interest Rate (% per annum):</span>
                        <strong className="text-cyan-400 font-mono">{emiInterestRate}%</strong>
                      </div>
                      <input
                        type="range"
                        min="5.0"
                        max="24.0"
                        step="0.25"
                        value={emiInterestRate}
                        onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Loan Tenure (Months):</span>
                        <strong className="text-white font-mono">
                          {emiTenureMonths} Months ({Math.round(emiTenureMonths / 12)} Yrs)
                        </strong>
                      </div>
                      <input
                        type="range"
                        min="6"
                        max="84"
                        step="6"
                        value={emiTenureMonths}
                        onChange={(e) => setEmiTenureMonths(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Monthly EMI</span>
                      <strong className="text-xl font-bold text-cyan-400 font-mono">
                        ₹{calculatedEmi.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Interest</span>
                      <strong className="text-xl font-bold text-amber-400 font-mono">
                        ₹{totalInterest.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Repayment</span>
                      <strong className="text-xl font-bold text-white font-mono">
                        ₹{totalRepayment.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BANKO AI CHAT */}
            {userActiveTab === 'banko' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>BANKO AI — Your Smart Banking Assistant</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ask banking-related questions and receive useful insights based on your account and transaction data.
                  </p>
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
                      </div>
                    ))}

                    {isAssistantThinking && (
                      <div className="flex items-center gap-2 text-xs text-cyan-400 pl-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>BANKO is processing your banking query...</span>
                      </div>
                    )}
                  </div>

                  {/* Preset Questions */}
                  <div className="p-3 bg-black/30 border-t border-white/10 flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                      'How much did I spend this month?',
                      'What is my current balance?',
                      'What did I spend the most on?',
                      'What is my savings goal progress?',
                      'Calculate my EMI for 1 Lakh'
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendBankoPrompt(prompt)}
                        className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Composer */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendBankoPrompt(chatInput);
                    }}
                    className="p-4 bg-black/40 border-t border-white/10 flex items-center gap-3"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask BANKO (e.g. 'How much did I spend this month?')..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isVoiceActive
                          ? 'bg-red-500 text-white border-red-500 animate-pulse'
                          : 'bg-white/5 text-slate-300 border-white/10'
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
                      title={isTtsEnabled ? 'Voice Feedback Enabled' : 'Voice Feedback Muted'}
                    >
                      {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {userActiveTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h2 className="text-xl font-bold text-white">Account & Security Settings</h2>
                  <p className="text-xs text-slate-400">User profile and session security controls</p>
                </div>

                <div className="p-6 rounded-3xl bg-[#0E1528] border border-white/10 space-y-4 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">User Name:</span>
                    <strong className="text-white">{currentUser.name}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">Registered Email:</span>
                    <strong className="text-white">{currentUser.email}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400">Phone Number:</span>
                    <strong className="text-white">{currentUser.phone}</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Role:</span>
                    <span className="font-bold text-cyan-400">STUDENT / USER</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

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
  // VIEW: ADMIN DASHBOARD (/admin)
  // =====================================================================
  if (currentView === 'admin' && currentUser?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#050811] text-white font-sans antialiased flex flex-col selection:bg-amber-500">
        <header className="h-20 border-b border-white/10 bg-[#070C1A] px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-600/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Smart Banking Assistant — Admin Portal</h1>
              <span className="text-xs text-amber-400 font-semibold">Administrator: Abhiram (MLRIT)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('main')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300"
            >
              Public Home
            </button>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
              <div className="text-2xl font-bold text-white mt-1 tabular-nums">1,248</div>
              <div className="text-[11px] text-cyan-400 font-semibold mt-1">Active Accounts</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Active Bank Accounts</span>
              <div className="text-2xl font-bold text-white mt-1 tabular-nums">1,492</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">Savings & Current</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Total Transactions</span>
              <div className="text-2xl font-bold text-white mt-1 tabular-nums">18,420</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">System-wide Total</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#090F22] border border-white/10 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Transfer Success Rate</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">99.4%</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">0.6% Failed / Flagged</div>
            </div>
          </div>

          {/* User Roster Table */}
          <div className="p-6 rounded-3xl bg-[#090F22] border border-white/10 shadow-lg space-y-4">
            <h3 className="text-base font-semibold text-white">Registered Users & Account Oversight</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/30 text-slate-400 uppercase text-[10px] font-bold border-b border-white/5">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5">
                    <td className="p-4 font-bold text-white">Vamshi Krishna</td>
                    <td className="p-4 text-slate-300">25r21a67b5@mlrit.ac.in</td>
                    <td className="p-4 text-slate-400">+91 9876543210</td>
                    <td className="p-4 font-bold text-cyan-400">USER</td>
                    <td className="p-4 text-emerald-400 font-bold">ACTIVE</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-4 font-bold text-white">Abhiram</td>
                    <td className="p-4 text-slate-300">25r21a67A0@mlrit.ac.in</td>
                    <td className="p-4 text-slate-400">+91 9876543211</td>
                    <td className="p-4 font-bold text-amber-400">ADMIN</td>
                    <td className="p-4 text-emerald-400 font-bold">ACTIVE</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-4 font-bold text-white">Priyanshu</td>
                    <td className="p-4 text-slate-300">25r21a6779@mlrit.ac.in</td>
                    <td className="p-4 text-slate-400">+91 9876543212</td>
                    <td className="p-4 font-bold text-cyan-400">USER</td>
                    <td className="p-4 text-emerald-400 font-bold">ACTIVE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================================
  // VIEW: MAIN HOMEPAGE (currentView === 'main')
  // CRITICAL REQUIREMENT: PRESERVE THE EXISTING HOMEPAGE GUI & LAYOUT
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
                  Smart Banking
                </b>
              </a>

              <button
                className="burger-btn"
                type="button"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i />
                <i />
              </button>

              <div className="mobile-menu" data-open={isMobileMenuOpen ? '' : undefined}>
                <nav className="nav-pill" aria-label="Primary Navigation">
                  <a href="#hero" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Home</span>
                  </a>
                  <hr className="nav-divider" aria-hidden="true" />
                  <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Features</span>
                  </a>
                  <hr className="nav-divider" aria-hidden="true" />
                  <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>How It Works</span>
                  </a>
                  <hr className="nav-divider" aria-hidden="true" />
                  <a href="#security" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Security</span>
                  </a>
                  <hr className="nav-divider" aria-hidden="true" />
                  <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>About</span>
                  </a>
                  <hr className="nav-divider" aria-hidden="true" />
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('login');
                    }}
                    className="text-xs font-bold text-[#0F1B31] cursor-pointer"
                  >
                    Login
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
                        onClick={() => navigateTo(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard')}
                        className="flex items-center gap-2 cursor-pointer text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {currentUser.avatarText}
                        </div>
                        <div className="leading-tight">
                          <div className="text-white text-xs font-medium truncate max-w-[90px]">{currentUser.name}</div>
                          <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                            {currentUser.role}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="hero-knob hover:scale-105 transition cursor-pointer"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigateTo('login')}
                      className="w-full flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-white text-sm font-medium pl-3">Login</span>
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
                Intelligent Banking Management System
              </p>
              <h1 className="hero-title l c" style={{ ['--x' as any]: 62.6, ['--y' as any]: -167.3 }}>
                <span className="sx" style={{ ['--sx' as any]: 0.9431 }}>
                  Smart Banking
                </span>
                <br />
                <span className="sx" style={{ ['--sx' as any]: 0.9792 }}>
                  Assistant
                </span>
              </h1>
              <div className="hero-tagrow">
                <span
                  className="play-btn l c"
                  style={{ ['--x' as any]: 66, ['--y' as any]: 34 }}
                  onClick={() => navigateTo('login')}
                  title="Get Started"
                >
                  <svg viewBox="0 0 13 14" fill="none" aria-hidden="true">
                    <path d="M1.4 1.3 11.6 7 1.4 12.7z" fill="#0b1526" />
                  </svg>
                </span>
                <span className="hero-tag l c sx" style={{ ['--x' as any]: 131, ['--y' as any]: 48.7, ['--sx' as any]: 0.8973 }}>
                  BANKO — Your Smart Banking Assistant
                </span>
              </div>

              {/* GLASS PANEL ON RIGHT */}
              <aside className="hero-panel l c r" style={{ ['--x' as any]: 58, ['--y' as any]: -165 }}>
                <span className="p-title sx" style={{ ['--sx' as any]: 0.8707 }}>
                  BANKO AI
                </span>
                <span className="panel-dot" />
                <span className="panel-shield">
                  <svg viewBox="0 0 30 39" fill="none" aria-hidden="true">
                    <path d="M15 1.2 1.6 6.6v13.1c0 6.6 5.1 12.6 13.4 17.9 8.3-5.3 13.4-11.3 13.4-17.9V6.6z" stroke="#101c33" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M2.1 18.9c4.6-1.1 8.9-1.6 12.9-1.6s8.3.5 12.9 1.6" stroke="#101c33" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <p className="p-sub sx" style={{ ['--sx' as any]: 0.8899 }}>
                  Smart Accounts
                  <br />
                  Transfers &
                  <br />
                  Budget Insights
                </p>
                <div className="panel-scale">
                  <span>Accounts</span>
                  <span>Transfers</span>
                  <span>Budgets</span>
                  <span>BANKO</span>
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
                    100%
                  </span>
                  <span className="stat-lbl l b sx" style={{ ['--x' as any]: 295, ['--y' as any]: 73.2, ['--sx' as any]: 0.9634 }}>
                    Java &
                    <br />
                    Spring Boot
                    <br />
                    Architecture
                  </span>
                </div>
                <span className="stat-slash l b" style={{ ['--x' as any]: 418, ['--y' as any]: 76 }} />
                <div className="hero-stat">
                  <span className="stat-num l b sx" style={{ ['--x' as any]: 480, ['--y' as any]: 60.4, ['--sx' as any]: 0.9858 }}>
                    MLRIT
                  </span>
                  <span className="stat-lbl l b sx" style={{ ['--x' as any]: 716, ['--y' as any]: 96.7, ['--sx' as any]: 0.9209 }}>
                    Student
                    <br />
                    College Project
                  </span>
                </div>
              </div>

              <button
                className="meet-pill l b r cursor-pointer text-left"
                style={{ ['--x' as any]: 59, ['--y' as any]: 66 }}
                onClick={() => navigateTo('login')}
              >
                <span className="meet-thumb">
                  <img
                    alt=""
                    style={{ objectPosition: '60% 50%' }}
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_105822_bf7c2d53-9957-4521-bbbf-7c1ab7a70130.png"
                  />
                </span>
                <b>{currentUser ? 'Open Dashboard' : 'Get Started'}</b>
                <span className="meet-knob">
                  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="m6.6 3.6 6 5.4-6 5.4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Scroll Mouse Cue */}
            <a href="#features" className="scroll-mouse-hint" aria-label="Scroll to explore features">
              <div className="mouse-icon">
                <div className="mouse-wheel" />
              </div>
              <span>Scroll</span>
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          MAIN BODY SECTIONS
          ────────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-[1240px] mx-auto px-6 py-20 space-y-32">
        {/* ── SECTION: 6 CORE FEATURES ── */}
        <section id="features" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4A78B0] mb-2 inline-block">
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#020C21]">
              Smart Banking Features
            </h2>
            <p className="text-sm text-[#59627E] mt-2 leading-relaxed">
              A secure and intelligent platform that helps users manage their accounts, transactions, spending, savings and banking activities from one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '1. Smart Dashboard',
                desc: 'View account balance, income, expenses and recent transactions from one place.',
                icon: PieChart
              },
              {
                title: '2. Money Transfer',
                desc: 'Transfer money between accounts and securely track transfer status.',
                icon: ArrowUpRight
              },
              {
                title: '3. Spending Analysis',
                desc: 'Analyze transaction history and understand where money is being spent.',
                icon: BarChart3
              },
              {
                title: '4. Savings Planner',
                desc: 'Create savings goals and monitor progress toward achieving them.',
                icon: TrendingUp
              },
              {
                title: '5. EMI & Interest Calculator',
                desc: 'Calculate loan EMI, total interest and repayment amounts with interactive formula tools.',
                icon: Calculator
              },
              {
                title: '6. BANKO AI',
                desc: 'Interact with BANKO, the Smart Banking Assistant, to ask banking questions and receive insights based on transaction data.',
                icon: Sparkles
              }
            ].map((feat, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#4A78B0] flex items-center justify-center mb-5">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#020C21]">{feat.title}</h3>
                  <p className="text-xs text-[#59627E] mt-2 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-black/5 flex items-center justify-between text-xs text-[#4A78B0] font-semibold">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION: HOW IT WORKS (4 STEPS) ── */}
        <section id="how-it-works" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4A78B0] mb-2 inline-block">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#020C21]">
              How It Works
            </h2>
            <p className="text-sm text-[#59627E] mt-2">
              Get started with Smart Banking Assistant in a few minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Register', desc: 'Create a secure Smart Banking Assistant account with your name and email.' },
              { step: '02', title: 'Login', desc: 'Access your personal banking dashboard with role-based authentication.' },
              { step: '03', title: 'Manage', desc: 'View accounts, transactions, transfers, budgets and savings goals.' },
              { step: '04', title: 'Ask BANKO', desc: 'Use BANKO to understand spending, savings and banking information.' }
            ].map((s, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 shadow-xs">
                <span className="text-2xl font-extrabold text-[#4A78B0]/40 font-mono block mb-2">{s.step}</span>
                <h4 className="font-bold text-base text-[#020C21]">{s.title}</h4>
                <p className="text-xs text-[#59627E] mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION: SECURITY ── */}
        <section id="security" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4A78B0] mb-2 inline-block">
              Reliable Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#020C21]">
              Security & Data Protection
            </h2>
            <p className="text-sm text-[#59627E] mt-2">
              Structured with industry-standard practices for academic and enterprise software development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Secure Authentication', desc: 'Protected user sign-in with password hashing in the Java Spring Security backend.' },
              { title: 'Role-Based Access Control', desc: 'Strict separation between standard User accounts and Admin supervision consoles.' },
              { title: 'Transaction Validation', desc: 'Validation rules prevent negative amounts, same-account transfers, and overdrafts.' },
              { title: 'Protected Banking Data', desc: 'Data stored in normalized MySQL relational tables with foreign-key constraints.' },
              { title: 'Secure REST API Communication', desc: 'Standard JSON endpoints communicating between React frontend and Spring Boot.' },
              { title: 'User-Specific Account Access', desc: 'Account ledgers and transfers filtered strictly to authenticated user session IDs.' }
            ].map((sec, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 shadow-xs">
                <Shield className="w-5 h-5 text-[#4A78B0] mb-3" />
                <h4 className="font-bold text-sm text-[#020C21]">{sec.title}</h4>
                <p className="text-xs text-[#59627E] mt-1.5 leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION: ABOUT THE PROJECT ── */}
        <section id="about" className="space-y-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/95 shadow-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4A78B0] mb-2 inline-block">
              About The Project
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#020C21] tracking-tight">
              Smart Banking Assistant — Academic College Project
            </h3>
            <p className="text-sm text-[#59627E] mt-4 leading-relaxed max-w-3xl">
              <strong>Smart Banking Assistant</strong> is a Java-based banking management project designed to provide users with a simple, centralized platform for managing accounts, transactions, spending, budgets and savings goals.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-black/5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#020C21] block">Java 17 & Spring Boot</span>
                <span className="text-slate-500 text-[11px]">Backend REST API</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#020C21] block">MySQL Database</span>
                <span className="text-slate-500 text-[11px]">Relational Data Layer</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#020C21] block">React & Tailwind CSS</span>
                <span className="text-slate-500 text-[11px]">Responsive Frontend</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#020C21] block">BANKO AI Assistant</span>
                <span className="text-slate-500 text-[11px]">Smart Insights</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER: MLRIT TEAM ── */}
      <footer className="border-t border-black/5 bg-white/60 mt-32 py-12">
        <div className="max-w-[1240px] mx-auto px-6 space-y-8">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#4A78B0]">Developed by MLRIT Students</h4>
            <p className="text-xs text-[#59627E] mt-1">
              Department of Computer Science & Engineering / Information Technology · Marri Laxman Reddy Institute of Technology (MLRIT)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-black/5">
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 text-xs">
              <strong className="text-sm text-[#020C21] block">Vamshi Krishna</strong>
              <span className="text-[#4A78B0] font-mono text-[11px] block mt-0.5">Roll No: 25R21A67B5</span>
              <a href="mailto:25r21a67b5@mlrit.ac.in" className="text-slate-600 hover:text-black mt-2 block font-mono text-[11px]">
                25r21a67b5@mlrit.ac.in
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 text-xs">
              <strong className="text-sm text-[#020C21] block">Abhiram</strong>
              <span className="text-[#4A78B0] font-mono text-[11px] block mt-0.5">Roll No: 25R21A67A0</span>
              <a href="mailto:25r21a67A0@mlrit.ac.in" className="text-slate-600 hover:text-black mt-2 block font-mono text-[11px]">
                25r21a67A0@mlrit.ac.in
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 text-xs">
              <strong className="text-sm text-[#020C21] block">Priyanshu</strong>
              <span className="text-[#4A78B0] font-mono text-[11px] block mt-0.5">Roll No: 25R21A6779</span>
              <a href="mailto:25r21a6779@mlrit.ac.in" className="text-slate-600 hover:text-black mt-2 block font-mono text-[11px]">
                25r21a6779@mlrit.ac.in
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#59627E]">
            <div>
              <span className="font-bold text-[#020C21]">Smart Banking Assistant — Powered by BANKO</span>
              <span> · Developed by MLRIT Students</span>
            </div>
            <div className="flex gap-4">
              <a href="#hero" className="hover:text-black">Home</a>
              <a href="#features" className="hover:text-black">Features</a>
              <a href="#how-it-works" className="hover:text-black">How It Works</a>
              <a href="#security" className="hover:text-black">Security</a>
              <a href="#about" className="hover:text-black">About</a>
              <button onClick={() => navigateTo('login')} className="font-semibold text-[#020C21] hover:underline cursor-pointer">
                Login
              </button>
            </div>
          </div>
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
