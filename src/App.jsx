import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import RegisterPage from './Pages/RegisterPage'
import LoginPage from './Pages/LoginPage'
import TransparencyPage from './Pages/TransparencyPage'
import AboutPage from './Pages/AboutPage'
import DonationPage from './Pages/DonationPage'
import ChangePasswordPage from './Pages/ChangePasswordPage'
import NgoManagementPage from './Pages/NgoManagementPage'
import AdminDashboardPage from './Pages/AdminDashboardPage'
import CausesPage from './Pages/CausesPage'
import BundleDetailPage from './Pages/BundleDetailPage'
import NgoProfilePage from './Pages/NgoProfilePage'
import DonorProfilePage from './Pages/DonorProfilePage'
import NgoTransparencyPage from './Pages/NgoTransparencyPage'
import Navbar from './components/Navbar'
import { User, Bell, Settings, LogOut, Menu, X, ChevronDown, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import RequireAuth from './components/guards/RequireAuth'
import RequireRole from './components/guards/RequireRole'
import RequireGuest from './components/guards/RequireGuest'
import SettingsPage from './Pages/SettingsPage'
import { ngoService } from './services/ngoService'

function OngRouteLoader() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#0A665C] animate-spin" />
        <p className="text-gray-500 font-medium">Carregando ONG...</p>
      </div>
    </div>
  )
}

function OngProfileRoute({ onNavigate }) {
  const { id } = useParams()
  const location = useLocation()
  const [ong, setOng] = useState(location.state?.ong || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (location.state?.ong && String(location.state.ong.id) === String(id)) {
        setOng(location.state.ong)
        setLoading(false)
        return
      }
      try {
        const data = await ngoService.getById(id)
        if (!cancelled) setOng(data)
      } catch {
        if (!cancelled) setError('Não foi possível carregar a ONG.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, location.state?.ong])

  if (loading) return <OngRouteLoader />
  if (error || !ong) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-red-500 font-medium">{error || 'ONG não encontrada.'}</p>
      </div>
    )
  }
  return <NgoProfilePage ong={ong} onNavigate={onNavigate} />
}

function OngTransparencyRoute({ onNavigate }) {
  const { id } = useParams()
  const location = useLocation()
  const [ong, setOng] = useState(location.state?.ong || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (location.state?.ong && String(location.state.ong.id) === String(id)) {
        setOng(location.state.ong)
        setLoading(false)
        return
      }
      try {
        const data = await ngoService.getById(id)
        if (!cancelled) setOng(data)
      } catch {
        if (!cancelled) setError('Não foi possível carregar a ONG.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, location.state?.ong])

  if (loading) return <OngRouteLoader />
  if (error || !ong) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-red-500 font-medium">{error || 'ONG não encontrada.'}</p>
      </div>
    )
  }
  return <NgoTransparencyPage ong={ong} onNavigate={onNavigate} />
}

function ProfileDropdown({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        id="profile-menu-btn"
        onClick={() => setOpen(o => !o)}
        className="flex items-center space-x-2 group cursor-pointer"
        title="Menu do perfil"
      >
        <div className="w-9 h-9 rounded-full bg-[#F5F2EC] flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition overflow-hidden">
          <svg className="w-6 h-6 text-[#8C8273] opacity-80 mt-1" viewBox="0 0 100 100" fill="none">
            <path d="M50 50C58.2843 50 65 43.2843 65 35C65 26.7157 58.2843 20 50 20C41.7157 20 35 26.7157 35 35C35 43.2843 41.7157 50 50 50Z" fill="currentColor"/>
            <path d="M72 75C72 63.9543 62.1503 55 50 55C37.8497 55 28 63.9543 28 75" fill="currentColor"/>
          </svg>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">
              {user.role === 'donor' ? 'Doador' : user.role === 'admin' ? 'Administrador' : 'ONG'}
            </p>
          </div>
          <button
            id="goto-profile-btn"
            onClick={() => {
              setOpen(false);
              if (user.role === 'ong') onNavigate('/gestao-ong');
              else if (user.role === 'admin') onNavigate('/admin-dashboard');
              else onNavigate('/donor-profile');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
          >
            <User className="w-4 h-4 text-gray-400" />
            <span>{user.role === 'ong' ? 'Minha ONG' : user.role === 'admin' ? 'Painel Admin' : 'Meu Perfil'}</span>
          </button>
          <button
            id="goto-settings-btn"
            onClick={() => { setOpen(false); onNavigate('/configuracoes'); }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span>Configurações</span>
          </button>
          <div className="border-t border-gray-50 mt-1 pt-1">
            <button
              id="logout-btn"
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ links, user, onNavigate, onLogin, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        id="mobile-menu-btn"
        onClick={() => setOpen(o => !o)}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        aria-label="Abrir menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-50 py-4 px-6 space-y-1">
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => { setOpen(false); onNavigate(link.path); }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <button onClick={() => {
                  setOpen(false);
                  if (user.role === 'ong') onNavigate('/gestao-ong');
                  else if (user.role === 'admin') onNavigate('/admin-dashboard');
                  else onNavigate('/donor-profile');
                }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                  {user.role === 'ong' ? 'Minha ONG' : user.role === 'admin' ? 'Painel Admin' : 'Meu Perfil'}
                </button>
                <button onClick={() => { setOpen(false); onLogout(); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                  Sair
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setOpen(false); onNavigate('/login'); }}
                  className="w-full bg-[#0A665C] text-white font-bold py-3 rounded-xl text-sm">
                  Login
                </button>
                <button onClick={() => { setOpen(false); onNavigate('/causas'); }}
                  className="w-full border border-[#0A665C] text-[#0A665C] font-bold py-3 rounded-xl text-sm">
                  Doar Agora
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AppContent() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()



  const handleNavigate = (path, data = null) => {
    if (path === 'ong-profile' && data) {
      navigate(`/ong/${data.id}`, { state: { ong: data } })
      return
    }
    if (path === 'ong-transparency' && data) {
      navigate(`/ong/${data.id}/transparency`, { state: { ong: data } })
      return
    }
    navigate(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { label: 'Nossa Missão', path: '/' },
    { label: 'Causas', path: '/causas' },
    { label: 'Transparência', path: '/transparency' },
    { label: 'Sobre', path: '/sobre' },
  ]

  const rightContent = user ? (
    <div className="flex items-center space-x-5">
      <button
        id="donate-btn"
        onClick={() => navigate('/causas')}
        className="bg-[#0A665C] text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-teal-900 transition shadow-sm cursor-pointer hidden md:block"
      >
        Doar Agora
      </button>
      <ProfileDropdown user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
    </div>
  ) : (
    <div className="hidden md:flex items-center space-x-4">
      <button
        id="donate-now-btn"
        onClick={() => handleNavigate('/causas')}
        className="bg-teal-800 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-teal-900 transition shadow-sm"
      >
        Doar Agora
      </button>
      <button
        id="login-btn"
        onClick={() => handleNavigate('/login')}
        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition focus:outline-none cursor-pointer"
        title="Login"
      >
        <User className="w-5 h-5" />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="relative">
        <nav className="flex justify-between items-center py-6 px-8 md:px-16 bg-white border-b border-gray-50">
          <div
            className="text-2xl font-bold text-teal-800 tracking-tight cursor-pointer"
            onClick={() => handleNavigate('/')}
          >
            ONG<span className="text-teal-600">+</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex space-x-10 text-gray-500 font-medium text-sm">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className="hover:text-teal-700 transition"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {rightContent}
            <MobileMenu
              links={navLinks}
              user={user}
              onNavigate={handleNavigate}
              onLogin={() => handleNavigate('/login')}
              onLogout={handleLogout}
            />
          </div>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<LandingPage onExploreCauses={() => navigate('/causas')} onNavigate={navigate} />} />
        
        {/* Guest Routes */}
        <Route path="/register" element={
          <RequireGuest><RegisterPage onLoginClick={() => navigate('/login')} /></RequireGuest>
        } />
        <Route path="/login" element={
          <RequireGuest><LoginPage onRegisterClick={() => navigate('/register')} /></RequireGuest>
        } />
        
        {/* Public Routes */}
        <Route path="/transparency" element={<TransparencyPage onNavigate={navigate} />} />
        <Route path="/sobre" element={<AboutPage onNavigate={navigate} />} />
        <Route path="/causas" element={<CausesPage onNavigate={handleNavigate} />} />
        <Route path="/bundle/:id" element={<BundleDetailPage />} />
        <Route path="/ong/:id" element={<OngProfileRoute onNavigate={handleNavigate} />} />
        <Route path="/ong/:id/transparency" element={<OngTransparencyRoute onNavigate={handleNavigate} />} />
        <Route path="/ong-transparency" element={<Navigate to="/ong/1/transparency" replace />} />

        {/* Protected Area */}
        <Route path="/doacao" element={<RequireAuth><DonationPage onGoHome={() => navigate('/')} /></RequireAuth>} />
        <Route path="/configuracoes" element={<RequireAuth><SettingsPage /></RequireAuth>} />
        <Route path="/alterar-senha" element={<RequireAuth><ChangePasswordPage /></RequireAuth>} />
        
        {/* Role Specific */}
        <Route path="/donor-profile" element={<RequireRole allowedRoles={['donor']}><DonorProfilePage onNavigate={handleNavigate} /></RequireRole>} />
        <Route path="/gestao-ong" element={<RequireRole allowedRoles={['ong']}><NgoManagementPage /></RequireRole>} />
        <Route path="/admin-dashboard" element={<RequireRole allowedRoles={['admin']}><AdminDashboardPage /></RequireRole>} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
