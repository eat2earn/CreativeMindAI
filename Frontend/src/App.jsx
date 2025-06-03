import React, { useContext, useEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import Landing from './pages/Landing'
import Navbar from './components/Navbar'
import Footer from './components/Footer.jsx'
import Login from './components/Login'
import Loading from './components/Loading'
import Pattern from './components/Pattern'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Carousel from './pages/Carousel'
import RemoveBackground from './pages/RemoveBackground'
import { createGlobalStyle } from 'styled-components';
import { BackgroundBoxesDemo } from './components/ui/BackgroundBoxesDemo.jsx';
import TextToSpeechPlayground from './components/ui/TextToSpeechPlayground';
import Userprofile from './components/Userprofile';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

const AppLayout = () => {
  const { showLogin, isLoading, setIsLoading } = useContext(AppContext)
  const location = useLocation()

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }

    handleRouteChange()
  }, [location.pathname, setIsLoading])
  
  return (
    <div className='min-h-screen flex flex-col relative w-full overflow-x-hidden'>
      <Pattern />
      <Navbar />
      {showLogin && <Login />}
      {isLoading && <Loading />}
      <div className="flex-grow mb-16">
      <Outlet />
      </div>
      <Footer />
    </div>
  )
}

const MenuLayout = () => {
  const { setIsLoading, isLoading } = useContext(AppContext)
  const location = useLocation()

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 3000)
      return () => clearTimeout(timer)
    }

    handleRouteChange()
  }, [location.pathname, setIsLoading])

  return (
    <div className='min-h-screen relative w-full overflow-x-hidden'>
      <Pattern />
      {isLoading && <Loading />}
      <Outlet />
    </div>
  )
}

// Add ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AppContext);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <GlobalStyle />
      <ToastContainer />
      <Routes>
        {/* Landing page as root route */}
        <Route path="/" element={<Landing />} />
        
        {/* Protected Chat Route */}
        <Route 
          path="/creativeMindAI-thinkAI" 
          element={
            <ProtectedRoute>
              <BackgroundBoxesDemo />
            </ProtectedRoute>
          } 
        />
        <Route path="/tts" element={<TextToSpeechPlayground />} />
        
        {/* Main app routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/app/result" element={<Result />} />
          <Route path="/app/buy" element={<BuyCredit />} />
          <Route path="/app/remove-background" element={<RemoveBackground />} />
          <Route path="/app/profile" element={<Userprofile />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>

        {/* Menu routes */}
        <Route path="/menu" element={<MenuLayout />}>
          <Route index element={<Carousel />} />
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App