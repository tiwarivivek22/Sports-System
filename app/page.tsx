"use client"

import React, { useState, useEffect } from "react"
import AuthPage from "./components/AuthPage"
import DashboardPage from "./components/DashboardPage.tsx"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("auth")
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
      setCurrentPage("dashboard")
    }
  }, [])

  const handleAuthSuccess = (user) => {
    setCurrentUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))
    setCurrentPage("profile")
  }

  const handleProfileSave = (profileData) => {
    const updatedUser = { ...(currentUser || {}), ...profileData }
    setCurrentUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
    setCurrentPage("auth")
  }

  return (
    <div className="container mx-auto p-4">
      {currentPage === "auth" && <AuthPage onAuthSuccess={handleAuthSuccess} />}
      {currentPage === "dashboard" && <DashboardPage userData={currentUser} onLogout={handleLogout} />}
    </div>
  )
}

