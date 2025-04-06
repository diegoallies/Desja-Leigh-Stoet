'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false })

type FeedEntry = {
  category: 'Lambs' | 'Ewes' | 'Rams'
  feedType: string
  quantityPerSheepKg: number
  frequency: 'Once Daily' | 'Twice Daily' | 'Every 2 Days'
  totalSheep: number
  stockKg: number
  costPerKg: number
}

const defaultFeed: FeedEntry[] = [
  {
    category: 'Lambs',
    feedType: 'Starter Pellets',
    quantityPerSheepKg: 0.5,
    frequency: 'Twice Daily',
    totalSheep: 15,
    stockKg: 40,
    costPerKg: 6,
  },
  {
    category: 'Ewes',
    feedType: 'Lucerne Hay',
    quantityPerSheepKg: 1.8,
    frequency: 'Once Daily',
    totalSheep: 30,
    stockKg: 100,
    costPerKg: 4,
  },
  {
    category: 'Rams',
    feedType: 'Grain Mix',
    quantityPerSheepKg: 1.2,
    frequency: 'Every 2 Days',
    totalSheep: 5,
    stockKg: 20,
    costPerKg: 5.5,
  },
]

export default function FeedPage() {
  const [feedPlan, setFeedPlan] = useState<FeedEntry[]>([])
  const [newFeed, setNewFeed] = useState<FeedEntry>({
    category: 'Lambs',
    feedType: '',
    quantityPerSheepKg: 0,
    frequency: 'Once Daily',
    totalSheep: 0,
    stockKg: 0,
    costPerKg: 0,
  })

  useEffect(() => {
    setFeedPlan(defaultFeed)
  }, [])

  function calculateDailyUsage(entry: FeedEntry) {
    const freqMultiplier =
      entry.frequency === 'Once Daily'
        ? 1
        : entry.frequency === 'Twice Daily'
        ? 2
        : 0.5
    return entry.quantityPerSheepKg * entry.totalSheep * freqMultiplier
  }

  function getDaysRemaining(entry: FeedEntry) {
    const dailyUse = calculateDailyUsage(entry)
    return dailyUse === 0 ? 0 : Math.floor(entry.stockKg / dailyUse)
  }

  function generateChartData(entry: FeedEntry) {
    const days = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`)
    let stock = entry.stockKg
    const usage = calculateDailyUsage(entry)
    const values = days.map(() => {
      stock = Math.max(0, stock - usage)
      return stock
    })

    return {
      labels: days,
      datasets: [
        {
          label: `${entry.category} - Feed Stock Projection`,
          data: values,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    }
  }

  function handleAddFeed() {
    if (!newFeed.feedType || newFeed.totalSheep <= 0) return
    setFeedPlan(prev => [...prev, newFeed])
    setNewFeed({
      category: 'Lambs',
      feedType: '',
      quantityPerSheepKg: 0,
      frequency: 'Once Daily',
      totalSheep: 0,
      stockKg: 0,
      costPerKg: 0,
    })
  }

  function handleEditFeed(index: number, updated: FeedEntry) {
    const updatedList = [...feedPlan]
    updatedList[index] = updated
    setFeedPlan(updatedList)
  }

  function handleDeleteFeed(index: number) {
    setFeedPlan(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-[#fdf6ec] min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3e3a36] mb-2">🌾 Feed Monitoring</h1>
          <p className="text-sm text-gray-600">Track usage, inventory, cost, and plan ahead for refills.</p>
        </div>

        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">➕ Add New Feed Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div><label className="text-sm font-medium">Category</label><select value={newFeed.category} onChange={e => setNewFeed({ ...newFeed, category: e.target.value as any })} className="p-2 border rounded w-full">
              <option value="Lambs">Lambs</option>
              <option value="Ewes">Ewes</option>
              <option value="Rams">Rams</option>
            </select></div>
            <div><label className="text-sm font-medium">Feed Type</label><input type="text" value={newFeed.feedType} onChange={e => setNewFeed({ ...newFeed, feedType: e.target.value })} className="p-2 border rounded w-full" /></div>
            <div><label className="text-sm font-medium">Quantity/Sheep (kg)</label><input type="number" value={newFeed.quantityPerSheepKg} onChange={e => setNewFeed({ ...newFeed, quantityPerSheepKg: parseFloat(e.target.value) })} className="p-2 border rounded w-full" /></div>
            <div><label className="text-sm font-medium">Frequency</label><select value={newFeed.frequency} onChange={e => setNewFeed({ ...newFeed, frequency: e.target.value as any })} className="p-2 border rounded w-full">
              <option>Once Daily</option>
              <option>Twice Daily</option>
              <option>Every 2 Days</option>
            </select></div>
            <div><label className="text-sm font-medium">Total Sheep</label><input type="number" value={newFeed.totalSheep} onChange={e => setNewFeed({ ...newFeed, totalSheep: parseInt(e.target.value) })} className="p-2 border rounded w-full" /></div>
            <div><label className="text-sm font-medium">Stock (kg)</label><input type="number" value={newFeed.stockKg} onChange={e => setNewFeed({ ...newFeed, stockKg: parseFloat(e.target.value) })} className="p-2 border rounded w-full" /></div>
            <div><label className="text-sm font-medium">Cost/kg (R)</label><input type="number" value={newFeed.costPerKg} onChange={e => setNewFeed({ ...newFeed, costPerKg: parseFloat(e.target.value) })} className="p-2 border rounded w-full" /></div>
          </div>
          <button onClick={handleAddFeed} className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">Add Feed</button>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedPlan.map((entry, idx) => {
            const dailyUse = calculateDailyUsage(entry)
            const daysRemaining = getDaysRemaining(entry)
            const refillCost = (entry.totalSheep * entry.quantityPerSheepKg * 7) * entry.costPerKg

            return (
              <div
                key={idx}
                className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-xl transition space-y-2"
              >
                <input className="text-xl font-bold text-[#3e3a36] w-full" value={entry.category} onChange={e => handleEditFeed(idx, { ...entry, category: e.target.value as any })} />
                <input className="text-sm w-full" value={entry.feedType} onChange={e => handleEditFeed(idx, { ...entry, feedType: e.target.value })} />
                <input className="text-sm w-full" type="number" value={entry.quantityPerSheepKg} onChange={e => handleEditFeed(idx, { ...entry, quantityPerSheepKg: parseFloat(e.target.value) })} />
                <select className="text-sm w-full" value={entry.frequency} onChange={e => handleEditFeed(idx, { ...entry, frequency: e.target.value as any })}>
                  <option>Once Daily</option>
                  <option>Twice Daily</option>
                  <option>Every 2 Days</option>
                </select>
                <input className="text-sm w-full" type="number" value={entry.totalSheep} onChange={e => handleEditFeed(idx, { ...entry, totalSheep: parseInt(e.target.value) })} />
                <input className="text-sm w-full" type="number" value={entry.stockKg} onChange={e => handleEditFeed(idx, { ...entry, stockKg: parseFloat(e.target.value) })} />
                <input className="text-sm w-full" type="number" value={entry.costPerKg} onChange={e => handleEditFeed(idx, { ...entry, costPerKg: parseFloat(e.target.value) })} />
                <p className="text-sm text-gray-600">🔥 Daily Usage: {dailyUse.toFixed(1)}kg</p>
                <p className="text-sm text-gray-600">📅 Days Remaining: <strong>{daysRemaining}</strong></p>
                <p className="text-sm text-gray-600">💰 Refill Cost (7 days): R{refillCost.toFixed(2)}</p>
                <button onClick={() => handleDeleteFeed(idx)} className="text-xs mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </div>
            )
          })}
        </section>

        <section className="bg-white rounded-xl shadow p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">📊 Feed Depletion Projections</h2>
          <div className="space-y-6">
            {feedPlan.map((entry, idx) => (
              <div key={idx} className="bg-[#fdfdf9] p-4 rounded-xl border">
                <h3 className="font-medium text-gray-700 mb-2">{entry.category}</h3>
                <div className="h-64">
                  <Line data={generateChartData(entry)} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
