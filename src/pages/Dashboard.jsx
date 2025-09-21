"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate()

  // Redirect to the new route-based dashboard
  useEffect(() => {
    navigate('/dashboard/properties', { replace: true })
  }, [navigate])

  return null
}

export default Dashboard
