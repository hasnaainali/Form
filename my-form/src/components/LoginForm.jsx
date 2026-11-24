import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/profileSlice'
import { loginSchema, validateStepByStep } from '../utils/validationSchemas'
import { FaEye, FaEyeSlash } from 'react-icons/fa' 
export default function LoginForm({ setActiveTab }) { 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false) 

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleLogin = async (e) => {
        e.preventDefault()

        const error = validateStepByStep(loginSchema, form)
        if (error) return toast.error(error)

        try {
            const res = await axios.post('http://localhost:5000/api/users/login', form)
            const user = res.data

            dispatch(setUser(user))
            toast.success('Login successful!')

            if (user.role === 'admin') {
                navigate('/admin', { replace: true })
            } else {
                navigate('/form', { replace: true })
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Login failed. Backend might be down.')
            }
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Email</label>
                    <input type="email" name="email" className="form-control" placeholder="Enter email" value={form.email} onChange={handleChange} />
                </div>
                
                <div className="mb-3">
                    <label className="form-label fw-semibold text-dark" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Password</label>
                    <div className="position-relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            className="form-control" 
                            placeholder="Enter password" 
                            value={form.password} 
                            onChange={handleChange} 
                            style={{ paddingRight: '40px' }} 
                        />
                        <span 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold mt-4">Login</button>
            </form>

            <div className="text-center mt-3">
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>Don't have an account? </span>
                <span 
                    onClick={() => setActiveTab('register')} 
                    style={{ color: '#0d6efd', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                    Sign up
                </span>
            </div>
        </div>
    )
}