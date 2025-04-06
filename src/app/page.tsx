'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import Link from 'next/link'
import 'animate.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type Sheep = {
  id: string
  tag: string
  breed: string
  dob: string
  gender: string
  status: 'Healthy' | 'Sick' | 'Sold' | 'Dead'
  notes?: string
}

type FeedEntry = {
  category: string
  stockKg: number
}

export default function HomePage() {
  const [sheepList, setSheepList] = useState<Sheep[]>([])
  const [feedData, setFeedData] = useState<FeedEntry[]>([])

  useEffect(() => {
    async function fetchData() {
      const resSheep = await fetch('/sheep-data.json')
      const sheep = await resSheep.json()
      setSheepList(sheep)

      const resFeed = await fetch('/feed-data.json')
      const feed = await resFeed.json()
      setFeedData(feed)
    }

    fetchData()
  }, [])

  const total = sheepList.length
  const sold = sheepList.filter(s => s.status === 'Sold').length
  const healthy = sheepList.filter(s => s.status === 'Healthy').length
  const sick = sheepList.filter(s => s.status === 'Sick').length
  const dead = sheepList.filter(s => s.status === 'Dead').length

  const chartData = {
    labels: ['Healthy', 'Sick', 'Sold', 'Dead'],
    datasets: [
      {
        data: [healthy, sick, sold, dead],
        backgroundColor: ['#22c55e', '#ef4444', '#facc15', '#a3a3a3'],
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  }

  const feedBarChart = {
    labels: feedData.map(f => f.category),
    datasets: [
      {
        label: 'Feed Stock (kg)',
        data: feedData.map(f => f.stockKg),
        backgroundColor: '#38bdf8',
        borderRadius: 6,
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#fdf6ec] text-[#3e3a36] animate__animated animate__fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <h1 className="text-4xl font-bold text-center">🐑 Desja Leigh Stoet</h1>

        {/* STAT CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 animate__animated animate__fadeInUp">
          <StatCard title="Total Sheep" value={total} icon="🐑" />
          <StatCard title="Sold" value={sold} icon="💸" />
          <StatCard title="Healthy" value={healthy} icon="✅" />
          <StatCard title="Sick" value={sick} icon="❌" />
        </section>

        {/* CHARTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate__animated animate__fadeInUp">
          <div className="bg-white rounded-xl shadow p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-center">Health Distribution</h2>
            <div className="h-60">
              <Doughnut data={chartData} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-center">Feed Stock by Category</h2>
            <div className="h-60">
              <Bar data={feedBarChart} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </section>

        {/* TOOL LINKS */}
        <section className="animate__animated animate__fadeInUp">
          <h2 className="text-2xl font-semibold mb-4 text-center">Farm Management Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ToolCard
              title="Herd Health Monitoring"
              description="Track sheep health, treatments, and alerts."
              icon="🩺"
              color="bg-red-100"
              href="/health"
            />
            <ToolCard
              title="Feed Optimization"
              description="Optimize feed schedules and monitor nutrition."
              icon="🌾"
              color="bg-green-100"
              href="/feed"
            />
            <ToolCard
              title="Livestock Calculator"
              description="Calculate weight, sale value, and ROI."
              icon="📊"
              color="bg-yellow-100"
              href="/calculator"
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-sm text-gray-500 pt-12 pb-6 border-t border-gray-200">
          © {new Date().getFullYear()} Desja Leigh Stoet — Built with love by Diego Allies
        </footer>
      </div>
    </main>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-lg sm:text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}

function ToolCard({
  title,
  description,
  icon,
  color = 'bg-gray-100',
  href,
}: {
  title: string
  description: string
  icon: string
  color?: string
  href: string
}) {
  return (
    <Link
      href={href}
      className={`block p-5 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 ${color}`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </Link>
  )
}