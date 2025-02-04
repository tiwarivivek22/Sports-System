"use client"

import React, { useState, useEffect } from "react"

interface WeeklyData {
  steps: string;
  calories: string;
  distance: string;
  activeMinutes: string;
  date?: string;
}

export default function DashboardPage({ userData, onLogout }) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({
    steps: "",
    calories: "",
    distance: "",
    activeMinutes: "",
  })
  const [savedData, setSavedData] = useState<WeeklyData[]>([])

  useEffect(() => {
    const storedData = localStorage.getItem(`weeklyData_${userData.username}`)
    if (storedData) {
      setSavedData(JSON.parse(storedData))
    }
  }, [userData.username])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setWeeklyData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newData = { ...weeklyData, date: new Date().toISOString() }
    const updatedData = [...savedData, newData]
    setSavedData(updatedData)
    localStorage.setItem(`weeklyData_${userData.username}`, JSON.stringify(updatedData))
    setWeeklyData({
      steps: "",
      calories: "",
      distance: "",
      activeMinutes: "",
    })
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {userData.name}!</h1>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Enter Weekly Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="steps">
                Steps
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="steps"
                type="number"
                name="steps"
                value={weeklyData.steps}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="calories">
                Calories Burned
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="calories"
                type="number"
                name="calories"
                value={weeklyData.calories}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="distance">
                Distance (km)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="distance"
                type="number"
                name="distance"
                value={weeklyData.distance}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="activeMinutes">
                Active Minutes
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="activeMinutes"
                type="number"
                name="activeMinutes"
                value={weeklyData.activeMinutes}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Weekly Data
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-bold mb-4">Weekly Data History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Steps</th>
                <th className="px-4 py-2">Calories</th>
                <th className="px-4 py-2">Distance</th>
                <th className="px-4 py-2">Active Minutes</th>
              </tr>
            </thead>
            <tbody>
              {savedData.map((data, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="border px-4 py-2">{data.date ? new Date(data.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="border px-4 py-2">{data.steps}</td>
                  <td className="border px-4 py-2">{data.calories}</td>
                  <td className="border px-4 py-2">{data.distance}</td>
                  <td className="border px-4 py-2">{data.activeMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

