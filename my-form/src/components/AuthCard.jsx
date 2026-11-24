import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthCard({ defaultTab }) {  
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(defaultTab || 'login')

    useEffect(() => {
        setActiveTab(defaultTab || 'login')
    }, [defaultTab])

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        navigate(`/${tab}`) 
    }

    return (
        <div
            className="card shadow border-0 p-4"
            style={{ width: '420px', borderRadius: '12px' }}
        >
            <div className="d-flex mb-4" style={{ borderBottom: '1px solid #dee2e6' }}>
                <button
                    type="button"
                    onClick={() => handleTabChange('login')}
                    className="btn flex-fill fw-bold"
                    style={{
                        backgroundColor: 'transparent',
                        color: activeTab === 'login' ? '#0d6efd' : '#6c757d',
                        border: 'none',
                        borderBottom: activeTab === 'login' ? '2px solid #0d6efd' : '2px solid transparent',
                        borderRadius: 0,
                        paddingBottom: '0.75rem',
                    }}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => handleTabChange('register')}
                    className="btn flex-fill fw-bold"
                    style={{
                        backgroundColor: 'transparent',
                        color: activeTab === 'register' ? '#0d6efd' : '#6c757d',
                        border: 'none',
                        borderBottom: activeTab === 'register' ? '2px solid #0d6efd' : '2px solid transparent',
                        borderRadius: 0,
                        paddingBottom: '0.75rem',
                    }}
                >
                    Register
                </button>
            </div>

            {activeTab === 'login' ? (
                <LoginForm setActiveTab={handleTabChange} />
            ) : (
                <RegisterForm setActiveTab={handleTabChange} />
            )}
        </div>
    )
}