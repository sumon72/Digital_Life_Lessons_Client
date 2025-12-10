import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body text-center space-y-4">
          <div className="text-6xl">⛔</div>
          <h1 className="text-3xl font-bold">Unauthorized</h1>
          <p className="text-base-content/70">
            You don't have permission to view this page. Please log in with the right account.
          </p>
          <div className="card-actions justify-center gap-3">
            <Link to="/" className="btn btn-outline">Go Home</Link>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
