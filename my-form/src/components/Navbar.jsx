import { useNavigate, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../store/profileSlice'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.profile.user)

  const handleLogout = () => {
    dispatch(logoutUser())
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const navLinkStyle = ({ isActive }) => ({
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent'
  })

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2">
      <span className="navbar-brand fw-bold mb-0">My Form App</span>
      
      <div className="d-flex ms-auto align-items-center gap-2">
        {user?.role === 'admin' && (
          <NavLink to="/admin" style={navLinkStyle}>Admin Dashboard</NavLink>
        )}
        
        <NavLink to="/form" style={navLinkStyle}>Form</NavLink>
        
        <button className="btn btn-danger btn-sm fw-bold ms-3" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}