import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body text-center space-y-4">
          <div className="text-6xl">🧭</div>
          <h1 className="text-3xl font-bold">Page Not Found</h1>
          <p className="text-base-content/70">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="card-actions justify-center gap-3">
            <button onClick={() => navigate(-1)} className="btn btn-outline">Go Back</button>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
