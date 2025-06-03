import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import ThreeLogin from './ThreeLogin'

const Navbar = () => {
    const { user, setShowLogin, logout, credit, profileData } = useContext(AppContext)
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [showThreeLogin, setShowThreeLogin] = useState(false)

    const handleAccountClick = () => {
        navigate('/app/profile')
        setIsDropdownOpen(false)
    }

    const handleLogout = () => {
        logout()
        setIsDropdownOpen(false)
    }

    const handleLoginClick = () => {
        setShowThreeLogin(true)
    }

    const getProfileImage = () => {
        if (profileData?.profileImage?.data) {
            return profileData.profileImage.data
        }
        return assets.profile_icon
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.profile-dropdown')) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isDropdownOpen])

    return (
        <>
        <div className='flex items-center justify-between py-4'>
            <Link to='/app'>
                <img src={assets.logo_1} alt="" className='w-28 sm:w-32 lg:w-40' />
            </Link>
            
            <div className='flex items-center gap-4'>
                    {user ? (
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <button onClick={() => navigate('/app/buy')} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
                            <img className='w-5' src={assets.credit_star} alt='' />
                            <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits left : {credit}</p>
                        </button>
                        <div className='relative profile-dropdown'>
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className='cursor-pointer'
                            >
                                <img 
                                    src={getProfileImage()} 
                                    className='w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-all duration-300' 
                                    alt="Profile" 
                                />
                            </div>
                            
                            {isDropdownOpen && (
                                <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50'>
                                    <div className='p-4 border-b border-gray-200'>
                                        <div className='flex items-center gap-3'>
                                            <img 
                                                src={getProfileImage()} 
                                                className='w-12 h-12 rounded-full object-cover border-2 border-gray-200' 
                                                alt="Profile" 
                                            />
                                            <div>
                                                <p className='font-medium text-gray-900'>
                                                    Hi {profileData?.username || 'User'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className='py-2'>
                                        <li 
                                            onClick={handleAccountClick}
                                            className='px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors'
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Account Settings
                                        </li>
                                        <li 
                                            onClick={() => navigate('/app/saved')}
                                            className='px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors'
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                            Saved Results
                                        </li>
                                        <li 
                                            onClick={handleLogout}
                                            className='px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors border-t border-gray-100'
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    ) : (
                    <div className='flex items-center gap-2 sm:gap-5'>
                        <p onClick={() => navigate('/app/buy')} className='cursor-pointer bg-blue-100 sm:px-3 py-2 text-blue-500 rounded-full'>Subscription</p>
                            <button onClick={handleLoginClick} className='bg-blue-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full'>Login</button>
                        </div>
                    )}
                    </div>
            </div>
            {showThreeLogin && <ThreeLogin onClose={() => setShowThreeLogin(false)} />}
        </>
    )
}

export default Navbar