'use client'

import { useSheepStore, Sheep } from '@/lib/useSheepStore'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function SheepPage() {
  const { sheepList, addSheep, deleteSheep } = useSheepStore()

  const [form, setForm] = useState<Omit<Sheep, 'id'>>({
    tag: '',
    breed: '',
    dob: '',
    gender: 'Male',
    status: 'Healthy',
    notes: ''
  })

  function handleAdd() {
    addSheep({ ...form, id: uuidv4() })
    setForm({ tag: '', breed: '', dob: '', gender: 'Male', status: 'Healthy', notes: '' })
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sheep Manager</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Tag"
          className="p-2 border rounded"
          value={form.tag}
          onChange={e => setForm({ ...form, tag: e.target.value })}
        />
        <input
          placeholder="Breed"
          className="p-2 border rounded"
          value={form.breed}
          onChange={e => setForm({ ...form, breed: e.target.value })}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={form.dob}
          onChange={e => setForm({ ...form, dob: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={form.gender}
          onChange={e => setForm({ ...form, gender: e.target.value as any })}
        >
          <option>Male</option>
          <option>Female</option>
        </select>
        <select
          className="p-2 border rounded"
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
          className="p-2 border rounded"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <button
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        Add Sheep
      </button>

      <h2 className="text-lg font-semibold mb-2">All Sheep</h2>
      <div className="space-y-4">
        {sheepList.map(sheep => (
          <div
            key={sheep.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p><strong>{sheep.tag}</strong> - {sheep.breed} - {sheep.status}</p>
              <p className="text-sm text-gray-600">{sheep.notes}</p>
            </div>
            <button
              onClick={() => deleteSheep(sheep.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
