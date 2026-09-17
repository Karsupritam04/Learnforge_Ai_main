import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const { isAuthenticated, user, loginWithRedirect, logout, configured } = useAuth()

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-ink-950 text-paper-100 h-screen sticky top-0 px-5 py-6">
      <NavLink to="/" className="flex items-center gap-2 mb-8">
        <span className="text-moss-400 font-serif text-2xl">T→L</span>
        <span className="font-serif text-lg tracking-tight">Text to Learn</span>
      </NavLink>

      <nav className="flex flex-col gap-1 text-sm">
        <SidebarLink to="/">All courses</SidebarLink>
        {isAuthenticated && <SidebarLink to="/my-courses">My courses</SidebarLink>}
      </nav>

      <div className="mt-auto pt-6 border-t border-ink-800 text-sm">
        {!configured && (
          <p className="text-ink-700/80 text-xs leading-relaxed mb-3">
            Auth0 isn't configured yet — running unauthenticated. See client/.env.example.
          </p>
        )}
        {isAuthenticated ? (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-paper-100/80">{user?.name || user?.email}</span>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="text-clay-400 hover:text-clay-500 focus-ring rounded"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="w-full rounded-md bg-moss-500 hover:bg-moss-600 transition-colors py-2 font-medium focus-ring"
          >
            Log in
          </button>
        )}
      </div>
    </aside>
  )
}

function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `rounded-md px-3 py-2 transition-colors focus-ring ${
          isActive ? 'bg-ink-800 text-paper-100' : 'text-paper-100/70 hover:bg-ink-900 hover:text-paper-100'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
