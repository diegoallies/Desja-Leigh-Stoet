'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Sheep = {
  id: string
  tag: string
  breed: string
  dob: string
  gender: 'Male' | 'Female'
  status: 'Healthy' | 'Sick' | 'Sold' | 'Dead'
  notes?: string
}

export default function SheepDetailPage() {
  const router = useRouter()
  const params = useParams()
  const sheepId = typeof params?.id === 'string' ? params.id : params?.id[0] || ''

  const [sheep, setSheep] = useState<Sheep | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sheepId) return;

    async function loadSheepData() {
      try {
        const res = await fetch('/sheep-data.json')
        if (!res.ok) throw new Error('Failed to fetch sheep data')
        const data: Sheep[] = await res.json()
        const found = data.find((s) => s.id === sheepId)

        if (found) {
          setSheep(found)
        } else {
          setError(`No sheep found with ID: ${sheepId}`)
        }
      } catch (err) {
        setError('Failed to load sheep data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadSheepData()
  }, [sheepId])

  if (loading) {
    return <p className="p-10 text-center text-gray-500 animate-pulse">Loading sheep info...</p>
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        ❌ {error}
        <br />
        <button
          onClick={() => router.push('/sheep')}
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ← Back to List
        </button>
      </div>
    )
  }

  function handleSave() {
    alert('✅ Sheep info updated (not persisted in JSON).')
    router.push('/sheep')
  }

  return (
    <div className="bg-[#fdf6ec] min-h-screen px-4 py-10 sm:px-6 lg:px-8 fade-in">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3e3a36]">
            🐑 Manage: {sheep.tag}
          </h1>
          <button
            onClick={() => router.push('/sheep')}
            className="text-sm text-blue-600 underline hover:text-blue-800 transition"
          >
            ← Back to List
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 space-y-6 transition duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Tag" value={sheep.tag} onChange={(v) => setSheep((prev) => prev ? { ...prev, tag: v } : prev)} />
            <Input label="Breed" value={sheep.breed} onChange={(v) => setSheep((prev) => prev ? { ...prev, breed: v } : prev)} />
            <Select
              label="Gender"
              value={sheep.gender}
              options={['Male', 'Female']}
              onChange={(v) => setSheep((prev) => prev ? { ...prev, gender: v as any } : prev)}
            />
            <Select
              label="Status"
              value={sheep.status}
              options={['Healthy', 'Sick', 'Sold', 'Dead']}
              onChange={(v) => setSheep((prev) => prev ? { ...prev, status: v as Sheep['status'] } : prev)}
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                value={sheep.dob}
                onChange={(e) => setSheep((prev) => prev ? { ...prev, dob: e.target.value } : prev)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={sheep.notes || ''}
                onChange={(e) => setSheep((prev) => prev ? { ...prev, notes: e.target.value } : prev)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm"
            >
              ✅ Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📜 Health History</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><strong>2024-12-02:</strong> Dewormed and vaccinated.</li>
            <li><strong>2025-01-15:</strong> Minor injury on back leg, ointment applied.</li>
            <li><strong>2025-03-10:</strong> Shearing marked and completed.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
    </div>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
