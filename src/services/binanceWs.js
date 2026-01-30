const BASE_URL = 'wss://stream.binance.com:9443/stream'

class BinanceWebSocket {
  constructor() {
    this.ws = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnect = 30000
    this.reconnectTimer = null
    this.streams = []
    this.isVisible = true

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isVisible = !document.hidden
        if (this.isVisible && !this.ws) {
          this.connect()
        } else if (!this.isVisible && this.ws) {
          this.disconnect()
        }
      })
    }
  }

  connect() {
    if (this.ws || this.streams.length === 0) return

    const url = `${BASE_URL}?streams=${this.streams.join('/')}`
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.stream && msg.data) {
          const callbacks = this.listeners.get(msg.stream) || []
          callbacks.forEach((cb) => cb(msg.data))
        }
      } catch { /* ignore parse errors */ }
    }

    this.ws.onclose = () => {
      this.ws = null
      if (this.isVisible && this.streams.length > 0) {
        this.scheduleReconnect()
      }
    }

    this.ws.onerror = () => {
      if (this.ws) this.ws.close()
    }
  }

  disconnect() {
    clearTimeout(this.reconnectTimer)
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  scheduleReconnect() {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnect)
    this.reconnectAttempts++
    this.reconnectTimer = setTimeout(() => this.connect(), delay)
  }

  subscribe(stream, callback) {
    if (!this.listeners.has(stream)) {
      this.listeners.set(stream, [])
    }
    this.listeners.get(stream).push(callback)

    if (!this.streams.includes(stream)) {
      this.streams.push(stream)
      this.disconnect()
      this.connect()
    }

    return () => {
      const cbs = this.listeners.get(stream) || []
      const idx = cbs.indexOf(callback)
      if (idx !== -1) cbs.splice(idx, 1)

      if (cbs.length === 0) {
        this.listeners.delete(stream)
        this.streams = this.streams.filter((s) => s !== stream)
        if (this.streams.length === 0) {
          this.disconnect()
        } else {
          this.disconnect()
          this.connect()
        }
      }
    }
  }
}

const binanceWs = new BinanceWebSocket()
export default binanceWs
