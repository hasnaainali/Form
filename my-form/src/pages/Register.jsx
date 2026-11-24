import AuthCard from "../components/AuthCard"

export default function Register() {
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundColor: '#1e1e1e' }}
        >
            <AuthCard defaultTab="register" />
        </div>
    )
}