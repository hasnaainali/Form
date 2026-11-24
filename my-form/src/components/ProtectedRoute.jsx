import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute() {
  const user = useSelector(state => state.profile.user)
  return user ? <Outlet /> : <Navigate to="/login" replace />
}