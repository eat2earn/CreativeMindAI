import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value }) => (
  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#d0dee7]">
    <p className="text-[#0e161b] text-base font-medium leading-normal">{title}</p>
    <p className="text-[#0e161b] tracking-light text-2xl font-bold leading-tight">{value}</p>
  </div>
);

const FormField = ({ label, value, onChange, type = "text" }) => (
  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
    <div className="input-container w-full">
      <input
        type={type}
        className="text-input w-full rounded-xl p-4 text-base"
        id={label.toLowerCase().replace(/\s+/g, '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</label>
    </div>
  </div>
);

const ProfileImageUpload = ({ currentImage, onImageUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { token, backendUrl } = useContext(AppContext);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Please upload an image under 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axios.post(
        `${backendUrl}/api/user/profile/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token
          }
        }
      );

      if (response.data.success) {
        onImageUpdate(response.data.profile);
        toast.success('Profile image updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getImageSource = () => {
    if (currentImage?.data) {
      return currentImage.data;
    }
    return assets.profile_icon;
  };

  return (
    <div className="relative group">
      <div 
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 cursor-pointer relative"
        style={{ backgroundImage: `url(${getImageSource()})` }}
        onClick={handleImageClick}
      >
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-200 flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </span>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
      />
    </div>
  );
};

const ProfileFormSection = ({ profileData, onUpdate, isProfileLoading }) => {
  const [formData, setFormData] = useState(profileData);
  const { token, backendUrl } = useContext(AppContext);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        {
          fullName: formData.fullName,
          username: formData.username,
          bio: formData.bio
        },
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        onUpdate(response.data.profile);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField 
        label="Full Name" 
        value={formData.fullName} 
        onChange={handleChange('fullName')} 
      />
      <FormField 
        label="Email" 
        value={formData.email} 
        onChange={handleChange('email')}
        type="email" 
        disabled={true}
      />
      <FormField 
        label="Username" 
        value={formData.username} 
        onChange={handleChange('username')} 
      />
      <FormField 
        label="Bio" 
        value={formData.bio} 
        onChange={handleChange('bio')} 
      />
      <div className="flex px-4 py-3 justify-end">
        <button 
          type="submit"
          disabled={isProfileLoading}
          className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1993e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] ${isProfileLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="truncate">
            {isProfileLoading ? 'Updating...' : 'Update Profile'}
          </span>
        </button>
      </div>
    </form>
  );
};

const UpdatePasswordSection = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { token, backendUrl } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/update-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Password updated successfully");
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4">
      <FormField 
        label="Current Password" 
        value={passwords.currentPassword} 
        onChange={(value) => setPasswords(prev => ({ ...prev, currentPassword: value }))}
        type="password"
      />
      <FormField 
        label="New Password" 
        value={passwords.newPassword} 
        onChange={(value) => setPasswords(prev => ({ ...prev, newPassword: value }))}
        type="password"
      />
      <FormField 
        label="Confirm New Password" 
        value={passwords.confirmPassword} 
        onChange={(value) => setPasswords(prev => ({ ...prev, confirmPassword: value }))}
        type="password"
      />
      <div className="flex px-4 py-3 justify-end">
        <button 
          type="submit"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1993e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
        >
          Update Password
        </button>
      </div>
    </form>
  );
};

const CreditHistorySection = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const { token, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        toast.error("Please login to view credit history");
        navigate('/login');
        return;
      }

      try {
        const { data } = await axios.get(`${backendUrl}/api/user/credit-history`, {
          headers: { 
            'token': token,
            'Content-Type': 'application/json'
          }
        });
        
        if (data.success) {
          setTransactions(data.transactions);
        } else {
          toast.error(data.message || "Failed to load credit history");
        }
      } catch (error) {
        console.error("Credit history error:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          // Clear invalid token
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.code === 'ERR_NETWORK') {
          toast.error("Cannot connect to server. Please check your internet connection.");
        } else {
          toast.error(error.response?.data?.message || "Failed to load credit history");
        }
      }
    };
    fetchTransactions();
  }, [token, backendUrl, navigate]);

  const getFilteredTransactions = () => {
    if (activeFilter === 'all') return transactions;
    return transactions.filter(transaction => transaction.type === activeFilter);
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'Image Generation':
        return 'text-blue-600';
      case 'Voice Generation':
        return 'text-purple-600';
      case 'Background Removal':
        return 'text-green-600';
      case 'Credit Purchase':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="px-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-[#1993e5] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All History
        </button>
        <button
          onClick={() => setActiveFilter('Image Generation')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'Image Generation'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Image Generation
        </button>
        <button
          onClick={() => setActiveFilter('Voice Generation')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'Voice Generation'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Voice Generation
        </button>
        <button
          onClick={() => setActiveFilter('Background Removal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'Background Removal'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Background Removal
        </button>
        <button
          onClick={() => setActiveFilter('Credit Purchase')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'Credit Purchase'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Credit Purchases
        </button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-[#d0dee7]">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date & Time</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Type</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Credits</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Description</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredTransactions().map((transaction, index) => (
              <tr key={index} className="border-b border-[#d0dee7] hover:bg-gray-50">
                <td className="py-4 px-6 text-sm text-gray-600">
                  {formatDateTime(transaction.date)}
                </td>
                <td className="py-4 px-6">
                  <span className={`text-sm font-medium ${getTransactionTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {transaction.description}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status || 'completed'}
                  </span>
                </td>
              </tr>
            ))}
            {getFilteredTransactions().length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No transactions found for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SavedResultsSection = () => {
  const [savedResults, setSavedResults] = useState([]);
  const { token, backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchSavedResults = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/saved-results`, {
          headers: { token }
        });
        if (data.success) {
          setSavedResults(data.results);
        }
      } catch (error) {
        toast.error("Failed to load saved results");
      }
    };
    fetchSavedResults();
  }, [token, backendUrl]);

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedResults.map((result, index) => (
          <div key={index} className="border border-[#d0dee7] rounded-xl p-4">
            <img src={result.imageUrl} alt={result.prompt} className="w-full h-48 object-cover rounded-lg mb-2" />
            <p className="text-sm text-gray-600">{result.prompt}</p>
            <p className="text-xs text-gray-500">{new Date(result.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function Userprofile() {
  const { 
    profileData, 
    updateProfile, 
    isProfileLoading,
    user,
    credit,
    loadProfileData
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('profile');

  const handleImageUpdate = (updatedProfile) => {
    updateProfile(updatedProfile);
    loadProfileData();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <h2 className="text-[#0e161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Profile Information
            </h2>
            <ProfileFormSection 
              profileData={profileData}
              onUpdate={updateProfile}
              isProfileLoading={isProfileLoading}
            />
            <h2 className="text-[#0e161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Usage Statistics
            </h2>
            <div className="flex flex-wrap gap-4 p-4">
              <StatCard title="Credits Remaining" value={credit || '0'} />
              <StatCard title="Images Generated" value={user?.imagesGenerated || '0'} />
            </div>
          </>
        );
      case 'password':
        return (
          <>
            <h2 className="text-[#0e161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Update Password
            </h2>
            <UpdatePasswordSection />
          </>
        );
      case 'credits':
        return (
          <>
            <h2 className="text-[#0e161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Credit History
            </h2>
            <CreditHistorySection />
          </>
        );
      case 'saved':
        return (
          <>
            <h2 className="text-[#0e161b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Saved Results
            </h2>
            <SavedResultsSection />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <style>
        {`
          .input-container {
            width: auto;
            position: static;
            display: flex;
            flex-direction: column-reverse;
          }

          .input-container label {
            color: black;
            position: relative;
            top: 2px;
            border-top: none;
            border-right: none;
            border-left: none;
            width: fit-content;
            transition: transform 0.2s;
            margin: 0px 0px 0px 12px;
            padding: 0px 4px 0px 4px;
            font-size: 20px;
          }

          .input-container input:focus + label {
            color: rgb(161, 66, 249);
            transform: scale(1.2);
            transform: translateX(0.5rem);
          }

          .input-container input {
            border: 2px rgb(161, 66, 249) solid;
            padding: 8px;
            background: transparent;
          }

          .input-container input:focus {
            outline: none;
          }
        `}
      </style>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex p-4 @container">
              <div className="flex w-full flex-col gap-4 min-[520px]:flex-row min-[520px]:justify-between min-[520px]:items-center">
                <div className="flex gap-4">
                  <ProfileImageUpload 
                    currentImage={profileData.profileImage}
                    onImageUpdate={handleImageUpdate}
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-[#0e161b] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      {profileData.fullName || 'Loading...'}
                    </p>
                    <p className="text-[#4e7a97] text-base font-normal leading-normal">
                      {profileData.email || 'Loading...'}
                    </p>
                    <p className="text-[#4e7a97] text-base font-normal leading-normal">
                      Joined {profileData.joinDate || 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-3">
              <div className="flex border-b border-[#d0dee7] px-4 gap-8">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'profile' 
                      ? 'border-b-[#1993e5] text-[#0e161b]' 
                      : 'border-b-transparent text-[#4e7a97]'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Profile Settings</p>
                </button>
                <button 
                  onClick={() => setActiveTab('password')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'password' 
                      ? 'border-b-[#1993e5] text-[#0e161b]' 
                      : 'border-b-transparent text-[#4e7a97]'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Update Password</p>
                </button>
                <button 
                  onClick={() => setActiveTab('credits')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'credits' 
                      ? 'border-b-[#1993e5] text-[#0e161b]' 
                      : 'border-b-transparent text-[#4e7a97]'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Credit History</p>
                </button>
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === 'saved' 
                      ? 'border-b-[#1993e5] text-[#0e161b]' 
                      : 'border-b-transparent text-[#4e7a97]'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Saved Results</p>
                </button>
              </div>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Userprofile;