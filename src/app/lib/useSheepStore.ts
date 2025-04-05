'use client'

import { useEffect, useState } from 'react'

export type Sheep = {
  id: string
  tag: string
  breed: string
  dob: string
  gender: 'Male' | 'Female'
  status: 'Healthy' | 'Sick' | 'Sold' | 'Dead'
  notes?: string
}

export function useSheepStore() {
  const [sheepList, setSheepList] = useState<Sheep[]>([])

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sheep')
    if (stored) setSheepList(JSON.parse(stored))
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('sheep', JSON.stringify(sheepList))
  }, [sheepList])

  function addSheep(sheep: Sheep) {
    setSheepList(prev => [...prev, sheep])
  }

  function deleteSheep(id: string) {
    setSheepList(prev => prev.filter(s => s.id !== id))
  }

  function updateSheep(updated: Sheep) {
    setSheepList(prev => prev.map(s => (s.id === updated.id ? updated : s)))
  }

  return { sheepList, addSheep, deleteSheep, updateSheep }
}
