export const ASSETS = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    binanceSymbol: 'BTCUSDT',
    color: '#F7931A',
    coingeckoId: 'bitcoin',
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    binanceSymbol: 'ETHUSDT',
    color: '#627EEA',
    coingeckoId: 'ethereum',
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    binanceSymbol: 'SOLUSDT',
    color: '#9945FF',
    coingeckoId: 'solana',
  },
]

export const TIME_RANGES = [
  { label: '1D', value: '1D', interval: '1m', limit: 1440 },
  { label: '1W', value: '1W', interval: '15m', limit: 672 },
  { label: '1M', value: '1M', interval: '1h', limit: 720 },
  { label: '3M', value: '3M', interval: '4h', limit: 540 },
  { label: '1Y', value: '1Y', interval: '1d', limit: 365 },
  { label: 'ALL', value: 'ALL', interval: '1w', limit: 500 },
]

export const INDICATORS = [
  { id: 'sma50', label: 'SMA 50', type: 'overlay' },
  { id: 'sma200', label: 'SMA 200', type: 'overlay' },
  { id: 'ema50', label: 'EMA 50', type: 'overlay' },
  { id: 'ema200', label: 'EMA 200', type: 'overlay' },
  { id: 'bb', label: 'BB', type: 'overlay' },
  { id: 'rsi', label: 'RSI', type: 'sub' },
  { id: 'macd', label: 'MACD', type: 'sub' },
]

export const COLORS = {
  purple: '#9945FF',
  green: '#14F195',
  red: '#FF3B69',
  bitcoin: '#F7931A',
  ethereum: '#627EEA',
  solana: '#9945FF',
  sma50: '#FFD700',
  sma200: '#FF6B6B',
  ema50: '#4ECDC4',
  ema200: '#45B7D1',
  bbUpper: 'rgba(153, 69, 255, 0.4)',
  bbLower: 'rgba(153, 69, 255, 0.4)',
  bbMiddle: 'rgba(153, 69, 255, 0.7)',
  macdLine: '#9945FF',
  macdSignal: '#14F195',
  macdHistoUp: 'rgba(20, 241, 149, 0.5)',
  macdHistoDown: 'rgba(255, 59, 105, 0.5)',
  rsiLine: '#9945FF',
}

export const INITIAL_BALANCE = 100000
