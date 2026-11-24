import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { registerSchema, validateStepByStep } from '../utils/validationSchemas'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function RegisterForm({ setActiveTab }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleRegister = async (e) => {
        e.preventDefault()

        const error = validateStepByStep(registerSchema, form)
        if (error) return toast.error(error)

        try {
            const { confirmPassword, ...dataToSend } = form;  
            
            await axios.post('http://localhost:5000/api/users/register', dataToSend)
            
            toast.success('Registration successful! Please login.')
            
            setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'user' })
            
            setTimeout(() => {
                setActiveTab('login')
            }, 3000);

        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Registration failed. Backend might be down.')
            }
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Full Name</label>
                <input type="text" name="name" className="form-control" placeholder="Enter full name" value={form.name} onChange={handleChange} />
            </div>

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

            <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Confirm Password</label>
                <div className="position-relative">
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword" 
                        className="form-control" 
                        placeholder="Confirm password" 
                        value={form.confirmPassword} 
                        onChange={handleChange} 
                        style={{ paddingRight: '40px' }}
                    />
                    <span 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6c757d' }}
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold text-dark" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Role</label>
                <select name="role" className="form-control" value={form.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold mt-4">Register</button>

            <div className="text-center mt-3">
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>Already have an account? </span>
                <span 
                    onClick={() => setActiveTab('login')} 
                    style={{ color: '#0d6efd', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                    Login
                </span>
            </div>
        </form>
    )
}