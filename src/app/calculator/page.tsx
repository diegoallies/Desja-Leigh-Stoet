'use client'

import { useState } from 'react'
import { useSheepStore, Sheep } from '../lib/useSheepStore'

export default function LivestockCalculatorPage() {
  const { sheepList, updateSheep } = useSheepStore()
  const [selectedSheep, setSelectedSheep] = useState<Sheep | null>(null)
  const [estimatedWeight, setEstimatedWeight] = useState<number>(0)
  const [pricePerKg, setPricePerKg] = useState<number>(80) // R80 default
  const [showInvoice, setShowInvoice] = useState(false)

  const availableSheep = sheepList.filter(s => s.status !== 'Sold' && s.status !== 'Dead')

  const saleValue = (estimatedWeight * pricePerKg).toFixed(2)

  function handleSellSheep() {
    if (selectedSheep) {
      updateSheep({ ...selectedSheep, status: 'Sold' })
      alert(`Sheep ${selectedSheep.tag} marked as SOLD.`)
      setSelectedSheep(null)
      setEstimatedWeight(0)
      setShowInvoice(true)
    }
  }

  return (
    <div className="bg-[#fdf6ec] min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#3e3a36] mb-2">📊 Livestock Calculator</h1>
        <p className="text-sm text-center text-gray-600 mb-6">Estimate weight, set price, sell sheep, and generate invoices.</p>

        {/* Sheep Selector */}
        <div className="bg-white shadow rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Select Sheep</h2>
          <select
            value={selectedSheep?.id || ''}
            onChange={e => {
              const sheep = availableSheep.find(s => s.id === e.target.value)
              setSelectedSheep(sheep || null)
              setShowInvoice(false)
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">-- Choose a sheep --</option>
            {availableSheep.map(s => (
              <option key={s.id} value={s.id}>{s.tag} — {s.breed}</option>
            ))}
          </select>

          {selectedSheep && (
            <div className="space-y-4 mt-4">
              <p className="text-sm text-gray-700"><strong>Breed:</strong> {selectedSheep.breed}</p>
              <p className="text-sm text-gray-700"><strong>Gender:</strong> {selectedSheep.gender}</p>
              <p className="text-sm text-gray-700"><strong>Status:</strong> {selectedSheep.status}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Weight (kg)</label>
                  <input
                    type="number"
                    value={estimatedWeight}
                    onChange={e => setEstimatedWeight(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price per kg (R)</label>
                  <input
                    type="number"
                    value={pricePerKg}
                    onChange={e => setPricePerKg(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <p className="text-md text-gray-800 mt-4">💰 <strong>Estimated Sale Value:</strong> R{saleValue}</p>

              <button
                onClick={handleSellSheep}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition"
              >
                ✅ Confirm Sale
              </button>
            </div>
          )}
        </div>

        {/* Invoice block */}
        {showInvoice && selectedSheep && (
          <div className="bg-white shadow-lg rounded-xl p-6 border border-green-200">
            <h2 className="text-xl font-bold text-green-700 mb-4">🧾 Sale Invoice</h2>
            <p><strong>Sheep Tag:</strong> {selectedSheep.tag}</p>
            <p><strong>Breed:</strong> {selectedSheep.breed}</p>
            <p><strong>Weight:</strong> {estimatedWeight} kg</p>
            <p><strong>Rate:</strong> R{pricePerKg.toFixed(2)} / kg</p>
            <p><strong>Total:</strong> <span className="text-green-800 font-bold">R{saleValue}</span></p>
            <p className="mt-2 text-sm text-gray-500">* Auto-generated invoice for your records.</p>
          </div>
        )}
      </div>
    </div>
  )
}