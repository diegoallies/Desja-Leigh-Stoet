'use client'

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Sheep = {
  id: string
  tag: string
  breed: string
  dob: string
  gender: 'Male' | 'Female'
  status: 'Healthy' | 'Sick' | 'Sold' | 'Dead'
  notes?: string
}

export default function SheepPage() {
  const [sheepList, setSheepList] = useState<Sheep[]>([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState<Omit<Sheep, 'id'>>({
    tag: '',
    breed: '',
    dob: '',
    gender: 'Male',
    status: 'Healthy',
    notes: ''
  })

  useEffect(() => {
    async function fetchSheep() {
      const res = await fetch('/sheep-data.json')
      const data = await res.json()
      setSheepList(data)
      setLoading(false)
    }
    fetchSheep()
  }, [])

  function handleAdd() {
    const newSheep: Sheep = { ...form, id: uuidv4() }
    setSheepList(prev => [...prev, newSheep])
    setForm({ tag: '', breed: '', dob: '', gender: 'Male', status: 'Healthy', notes: '' })
  }

  function handleDelete(id: string) {
    setSheepList(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="bg-[#fdf6ec] min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-[#3e3a36]">🐑 Sheep Manager</h1>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Sheep</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Tag"
              className="p-2 border border-gray-300 rounded"
              value={form.tag}
              onChange={e => setForm({ ...form, tag: e.target.value })}
            />
            <input
              placeholder="Breed"
              className="p-2 border border-gray-300 rounded"
              value={form.breed}
              onChange={e => setForm({ ...form, breed: e.target.value })}
            />
            <input
              type="date"
              className="p-2 border border-gray-300 rounded"
              value={form.dob}
              onChange={e => setForm({ ...form, dob: e.target.value })}
            />
            <select
              className="p-2 border border-gray-300 rounded"
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value as any })}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as any })}
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Sold</option>
              <option>Dead</option>
            </select>
            <textarea
              placeholder="Notes"
              className="p-2 border border-gray-300 rounded sm:col-span-2"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />
          </div>
          <button
            onClick={handleAdd}
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition"
          >
            ➕ Add Sheep
          </button>
        </div>

        {/* Sheep List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Sheep</h2>
          {loading ? (
            <p className="text-gray-500 text-center">Loading sheep...</p>
          ) : (
            <div className="space-y-5">
              {sheepList.map((sheep) => (
                <div
                  key={sheep.id}
                  className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:ring-2 hover:ring-green-300 transition"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#3e3a36] mb-1">{sheep.tag} — {sheep.breed}</h3>
                    <p className="text-sm text-gray-600">
                      {sheep.status} • {sheep.gender} • DOB: {new Date(sheep.dob).toLocaleDateString()}
                    </p>
                    {sheep.notes && (
                      <p className="text-sm text-gray-500 italic mt-2">{sheep.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => window.location.href = `/sheep/${sheep.id}`}
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sheep.id)}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
