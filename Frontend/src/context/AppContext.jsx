import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        username: '',
        bio: '',
        profileImage: '',
        joinDate: ''
    });
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/credits', {
                headers: { token }
            });

            if (data.success) {
                setCredit(data.credits);
                setUser(prev => ({
                    ...prev,
                    ...data.user,
                    username: data.user.username || prev?.username
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/image/generate-image',
                { prompt },
                { headers: { token } }
            );

            if (data.success) {
                loadCreditsData();
                return data.resultImage;
            } else {
                toast.error(data.message || "Image generation failed");
                loadCreditsData();

                if (data.creditBalance === 0) {
                    toast.error("You have no credits left!");
                    navigate('/app/buy');
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const removeBackground = async (imageFile) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const { data } = await axios.post(
                backendUrl + '/api/image/remove-background',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token
                    }
                }
            );

            if (data.success) {
                loadCreditsData();
                return data.processedImage;
            } else {
                toast.error(data.message || "Background removal failed");
                loadCreditsData();

                if (data.creditBalance === 0) {
                    toast.error("You have no credits left!");
                    navigate('/app/buy');
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    };

    const fetchChatHistory = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/chatbot/history`, {
                headers: { token }
            });
            if (data.success) {
                setChatHistory(data.history);
            }
        } catch (error) {
            toast.error("Failed to load chat history");
        }
    };

    const sendChatMessage = async (messages, chatId = null) => {
        try {
            setIsChatLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/api/chatbot/chat`,
                { messages, chatId },
                { headers: { token } }
            );

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.choices && data.choices[0]?.message) {
                await fetchChatHistory();
                return {
                    success: true,
                    message: data.choices[0].message,
                    chatId: data.chatId
                };
            } else {
                throw new Error("Invalid response format from AI");
            }
        } catch (error) {
            toast.error(error.message || "Failed to send message");
            return { success: false, error: error.message };
        } finally {
            setIsChatLoading(false);
        }
    };

    const deleteChat = async (chatId) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/chatbot/chat/${chatId}`, {
                headers: { token }
            });
            
            if (data.success) {
                setChatHistory(prev => prev.filter(chat => chat._id !== chatId));
                if (currentChat?._id === chatId) {
                    setCurrentChat(null);
                }
                toast.success("Chat deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    };

    const startNewChat = () => {
        setCurrentChat(null);
    };

    const selectChat = (chat) => {
        setCurrentChat(chat);
    };

    const updateProfile = async (profileUpdates) => {
        try {
            setIsProfileLoading(true);
            const { data } = await axios.put(
                `${backendUrl}/api/user/profile`,
                profileUpdates,
                { headers: { token } }
            );

            if (data.success) {
                setProfileData(prev => ({ ...prev, ...profileUpdates }));
                setUser(prev => ({ ...prev, ...profileUpdates }));
                toast.success("Profile updated successfully");
                return true;
            } else {
                toast.error(data.message || "Failed to update profile");
                return false;
            }
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
            return false;
        } finally {
            setIsProfileLoading(false);
        }
    };

    const loadProfileData = async () => {
        if (!token) {
            return;
        }

        try {
            setIsProfileLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
                headers: { 
                    'token': token,
                    'Content-Type': 'application/json'
                }
            });

            if (data.success) {
                const profile = {
                    fullName: data.profile.fullName || '',
                    email: data.profile.email || '',
                    username: data.profile.username || '',
                    bio: data.profile.bio || '',
                    profileImage: data.profile.profileImage || '',
                    joinDate: data.profile.joinDate || ''
                };
                setProfileData(profile);
                setUser(prev => ({
                    ...prev,
                    username: profile.username
                }));
            } else {
                throw new Error(data.message || 'Failed to load profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load profile data');
        } finally {
            setIsProfileLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadCreditsData();
            fetchChatHistory();
            loadProfileData();
        }
    }, [token]);

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage,
        isLoading,
        setIsLoading,
        removeBackground,
        chatHistory,
        currentChat,
        isChatLoading,
        sendChatMessage,
        deleteChat,
        startNewChat,
        selectChat,
        fetchChatHistory,
        profileData,
        setProfileData,
        updateProfile,
        loadProfileData,
        isProfileLoading
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
