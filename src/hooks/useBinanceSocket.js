import { useEffect } from 'react'
import binanceWs from '../services/binanceWs'
import usePriceStore from '../stores/usePriceStore'
import { ASSETS } from '../lib/constants'

export default function useBinanceSocket() {
  const setPriceData = usePriceStore((s) => s.setPriceData)
  const addSparklinePoint = usePriceStore((s) => s.addSparklinePoint)

  useEffect(() => {
    const unsubscribers = ASSETS.map((asset) => {
      const stream = `${asset.binanceSymbol.toLowerCase()}@ticker`
      return binanceWs.subscribe(stream, (data) => {
        setPriceData(asset.binanceSymbol, {
          price: parseFloat(data.c),
          change: parseFloat(data.p),
          changePercent: parseFloat(data.P),
          high: parseFloat(data.h),
          low: parseFloat(data.l),
          volume: parseFloat(data.v),
          quoteVolume: parseFloat(data.q),
        })
        addSparklinePoint(asset.binanceSymbol, parseFloat(data.c))
      })
    })

    return () => unsubscribers.forEach((unsub) => unsub())
  }, [setPriceData, addSparklinePoint])
}
