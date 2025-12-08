export default function Navbar() {
  return (
    <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Digital Life Lessons</a>
      </div>
      <div className="flex-none gap-2">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/">Home</a></li>
          <li><a href="/public-lessons">Public Lessons</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/signup">Sign Up</a></li>
        </ul>
      </div>
    </nav>
  )
}
