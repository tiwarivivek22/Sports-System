"use client"

import React, { useState } from "react"

interface User {
  username: string
  password: string
}

const users: User[] = []

export default function AuthPage({ onAuthSuccess }) {
  const [isSignIn, setIsSignIn] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (isSignIn) {
      // Sign In
      const user = users.find((u) => u.username === username && u.password === password)
      if (user) {
        onAuthSuccess(user)
      } else {
        setError("Invalid username or password")
      }
    } else {
      // Sign Up
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (users.some((u) => u.username === username)) {
        setError("Username already exists")
        return
      }
      const newUser = { username, password }
      users.push(newUser)
      onAuthSuccess(newUser)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 text-center">
          <button className={`mr-2 ${isSignIn ? "text-blue-500 font-bold" : ""}`} onClick={() => setIsSignIn(true)}>
            Sign In
          </button>
          <button className={`ml-2 ${!isSignIn ? "text-blue-500 font-bold" : ""}`} onClick={() => setIsSignIn(false)}>
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isSignIn && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                placeholder="******************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

