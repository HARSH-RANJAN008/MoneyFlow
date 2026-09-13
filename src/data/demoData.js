export const accounts = [
  { id: 'checking', name: 'Everyday checking', number: '•••• 4928', type: 'Checking', balance: 84250, available: 77500, color: 'aqua', icon: 'wallet', status: 'Active' },
  { id: 'savings', name: 'Rainy day fund', number: '•••• 1148', type: 'Savings', balance: 240000, available: 240000, color: 'blue', icon: 'landmark', status: 'Active' },
  { id: 'credit', name: 'MoneyFlow credit', number: '•••• 2026', type: 'Credit card', balance: -18750, available: 81250, color: 'sand', icon: 'credit-card', status: 'Active' },
  { id: 'investments', name: 'Growth portfolio', number: 'MF • 0981', type: 'Investment', balance: 186300, available: 186300, color: 'violet', icon: 'trending-up', status: 'Active' },
]

export const transactions = [
  { id: 'tx-1', title: 'Salary credit', merchant: 'Acme Technologies', category: 'Income', date: '2026-08-15', amount: 52000, status: 'Completed', type: 'income', icon: 'briefcase' },
  { id: 'tx-2', title: 'Sunday groceries', merchant: 'Nature’s Basket', category: 'Food & dining', date: '2026-08-16', amount: -3240, status: 'Completed', type: 'expense', icon: 'shopping-basket' },
  { id: 'tx-3', title: 'Electricity bill', merchant: 'Tata Power', category: 'Bills & utilities', date: '2026-08-14', amount: -1860, status: 'Completed', type: 'expense', icon: 'zap' },
  { id: 'tx-4', title: 'Weekend getaway', merchant: 'MakeMyTrip', category: 'Travel', date: '2026-08-13', amount: -8450, status: 'Pending', type: 'expense', icon: 'plane' },
  { id: 'tx-5', title: 'Freelance payment', merchant: 'Grey Matter Studio', category: 'Income', date: '2026-08-10', amount: 9500, status: 'Completed', type: 'income', icon: 'sparkles' },
  { id: 'tx-6', title: 'Monthly SIP', merchant: 'Parag Parikh Flexi Cap', category: 'Investments', date: '2026-08-09', amount: -5000, status: 'Completed', type: 'expense', icon: 'line-chart' },
  { id: 'tx-7', title: 'Music subscription', merchant: 'Spotify', category: 'Entertainment', date: '2026-08-07', amount: -119, status: 'Completed', type: 'expense', icon: 'music' },
  { id: 'tx-8', title: 'Cab to airport', merchant: 'Uber', category: 'Transport', date: '2026-08-04', amount: -642, status: 'Completed', type: 'expense', icon: 'car' },
]

export const spendingData = [
  { month: 'Mar', income: 43000, spending: 22300, savings: 15800 },
  { month: 'Apr', income: 44000, spending: 27400, savings: 18400 },
  { month: 'May', income: 45000, spending: 24500, savings: 19800 },
  { month: 'Jun', income: 46500, spending: 30300, savings: 16100 },
  { month: 'Jul', income: 48000, spending: 28600, savings: 18600 },
  { month: 'Aug', income: 52000, spending: 31750, savings: 20250 },
]

export const categoryData = [
  { name: 'Food', value: 8240, color: '#e6ac5f' },
  { name: 'Shopping', value: 6510, color: '#49b9bb' },
  { name: 'Bills', value: 5960, color: '#7773ce' },
  { name: 'Travel', value: 4820, color: '#e88569' },
  { name: 'Other', value: 6220, color: '#b8bf9f' },
]

export const goals = [
  { id: 1, name: 'Emergency fund', emoji: '🛟', current: 240000, target: 300000, date: 'Dec 2026', accent: 'aqua' },
  { id: 2, name: 'Japan, 2027', emoji: '🗻', current: 54000, target: 180000, date: 'Mar 2027', accent: 'violet' },
  { id: 3, name: 'New workspace', emoji: '🪴', current: 32700, target: 75000, date: 'Nov 2026', accent: 'sand' },
]

export const bills = [
  { id: 1, name: 'Airtel Broadband', category: 'Internet', amount: 999, due: '18 Aug', icon: 'wifi', color: 'blue', paid: false },
  { id: 2, name: 'Rent', category: 'Housing', amount: 18000, due: '01 Sep', icon: 'home', color: 'sand', paid: false },
  { id: 3, name: 'Spotify Premium', category: 'Subscription', amount: 119, due: '07 Sep', icon: 'music', color: 'violet', paid: false },
  { id: 4, name: 'Tata Power', category: 'Electricity', amount: 1860, due: '14 Aug', icon: 'zap', color: 'aqua', paid: true },
]

export const notifications = [
  { id: 1, title: 'Transfer completed', detail: '₹12,000 sent to Aditi Mehra', time: '12m ago', read: false, icon: 'arrow-up-right' },
  { id: 2, title: 'Bill due soon', detail: 'Airtel Broadband is due tomorrow', time: '2h ago', read: false, icon: 'calendar-clock' },
  { id: 3, title: 'You’re making progress', detail: 'Emergency fund is 80% funded', time: '1d ago', read: true, icon: 'target' },
]
