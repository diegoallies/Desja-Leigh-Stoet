'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface Sheep {
  id: string
  tag: string
  breed: string
  dob: string
  gender: string
  status: 'Healthy' | 'Sick' | 'Sold' | 'Dead'
  notes?: string
}

export default function HealthMonitoringPage() {
  const [sheepList, setSheepList] = useState<Sheep[]>([])
  const [filter, setFilter] = useState<'All' | 'Healthy' | 'Sick' | 'Dead'>('All')
  const [search, setSearch] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()

  useEffect(() => {
    async function fetchSheepData() {
      const res = await fetch('/sheep-data.json')
      const data = await res.json()
      setSheepList(data)
    }
    fetchSheepData()
  }, [])

  const filtered = sheepList.filter(s => {
    const matchStatus = filter === 'All' || s.status === filter
    const matchSearch = s.tag.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const statusCounts = ['Healthy', 'Sick', 'Sold', 'Dead'].map(
    status => sheepList.filter(s => s.status === status).length
  )

  const barChartData = {
    labels: ['Healthy', 'Sick', 'Sold', 'Dead'],
    datasets: [
      {
        label: 'Sheep Count',
        data: statusCounts,
        backgroundColor: ['#16a34a', '#dc2626', '#facc15', '#9ca3af'],
        borderRadius: 6,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        ticks: { stepSize: 1 },
        beginAtZero: true
      }
    }
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto font-sans bg-[#f9fafb] min-h-screen">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-center text-[#1f2937]">🩺 Herd Health Monitoring</h1>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Sheep Health Overview</h2>
        <div className="h-48 sm:h-40">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Healthy', 'Sick', 'Dead'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-6 py-2 rounded-full font-medium shadow-sm transition text-sm sm:text-base ${
                filter === s
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm w-48"
          />
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="text-sm underline text-gray-600 hover:text-black"
          >
            {viewMode === 'grid' ? 'Switch to List View' : 'Switch to Card View'}
          </button>
        </div>
      </div>

      {/* Sheep Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
        {filtered.map(sheep => (
          <div
            key={sheep.id}
            onClick={() => router.push(`/sheep/${sheep.id}`)}
            className={`cursor-pointer bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-green-400 border border-gray-100 ${
              viewMode === 'list' ? 'flex items-center justify-between' : ''
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{sheep.tag}</h3>
              <p className="text-sm text-gray-500">{sheep.breed}</p>
            </div>
            {viewMode === 'list' && (
              <span className="ml-4 text-xs text-gray-400 italic">View</span>
            )}
            {viewMode === 'grid' && (
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p><strong>Gender:</strong> {sheep.gender}</p>
                <p><strong>Status:</strong> {sheep.status}</p>
                <p><strong>DOB:</strong> {new Date(sheep.dob).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-gray-500">No sheep found for the selected filter or search.</p>
      )}
    </div>
  )
}
