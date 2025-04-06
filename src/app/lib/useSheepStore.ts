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

  // Load from localStorage or fallback to JSON
  useEffect(() => {
    const stored = localStorage.getItem('sheep')
    if (stored) {
      setSheepList(JSON.parse(stored))
    } else {
      fetch('/sheep-data.json')
        .then(res => res.json())
        .then(data => {
          setSheepList(data)
          localStorage.setItem('sheep', JSON.stringify(data))
        })
    }
  }, [])

  // Save to localStorage when sheepList changes
  useEffect(() => {
    if (sheepList.length > 0) {
      localStorage.setItem('sheep', JSON.stringify(sheepList))
    }
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
