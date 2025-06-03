import React, { useEffect, useRef, useState, useContext } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './ThreeLogin.css'; // We'll create this file next

const ThreeLogin = ({ onClose }) => {
    const canvasRef = useRef(null);
    const [state, setState] = useState('Login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modelLoading, setModelLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const lengthRef = useRef(7);
    const parentRef = useRef(null);
    const mixerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const { backendUrl, setToken, setUser } = useContext(AppContext);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null; // Make sure background is transparent
        const parentElement = canvasRef.current.parentElement;
        const sizes = {
            width: parentElement.offsetWidth,
            height: parentElement.offsetHeight
        };

        // Camera setup with better initial position
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(0, 0, 2); // Thoda aage
        scene.add(camera);

        // Renderer setup with better quality
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });

        renderer.setClearColor(0x000000, 0); // Make sure background is transparent
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased intensity
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increased intensity
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(2048, 2048);
        directionalLight.shadow.camera.far = 15;
        directionalLight.shadow.camera.left = -7;
        directionalLight.shadow.camera.top = 7;
        directionalLight.shadow.camera.right = 7;
        directionalLight.shadow.camera.bottom = -7;
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Add subtle point light for better model visibility
        const pointLight = new THREE.PointLight(0xffffff, 0.5); // Increased intensity
        pointLight.position.set(-5, 5, 5);
        scene.add(pointLight);

        // 3D Model with loading state
        const parent = new THREE.Group();
        scene.add(parent);
        parentRef.current = parent;

        // Add loading manager for better error handling
        const loadingManager = new THREE.LoadingManager(
            // Success callback
            () => {
                setModelLoading(false);
            },
            // Progress callback
            () => {},
            // Error callback
            () => {
                setError('Failed to load 3D model. Please refresh the page.');
                setModelLoading(false);
            }
        );

        const gltfLoader = new GLTFLoader(loadingManager);
        
        // Try loading the model with error handling
        try {
            gltfLoader.load(
                '/models/scene3.glb',
                (gltf) => {
                    const model = gltf.scene;
                    
                    // Make the model even smaller
                    model.scale.set(0.8, 0.8, 0.8);
                    model.position.set(0, 0, 0);
                    
                    // Make sure all materials are visible
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material.transparent = true;
                            child.material.opacity = 1;
                            child.material.needsUpdate = true;
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    // Add model to parent
                    parent.add(model);
                    
                    // Setup animations if they exist
                    if (gltf.animations && gltf.animations.length) {
                        mixerRef.current = new THREE.AnimationMixer(model);
                        const action = mixerRef.current.clipAction(gltf.animations[0]);
                        action.play();
                    }
                },
                undefined,
                (error) => {
                    setError('Failed to load 3D model. Please refresh the page.');
                    setModelLoading(false);
                }
            );
        } catch (error) {
            setError('Failed to initialize 3D model. Please refresh the page.');
            setModelLoading(false);
        }

        // Enhanced mouse movement with smoother camera
        const mouse = new THREE.Vector2();
        const targetMouse = new THREE.Vector2();
        const currentMouse = new THREE.Vector2();

        const handleMouseMove = (event) => {
            targetMouse.x = (event.clientX / sizes.width) * 2 - 1;
            targetMouse.y = -(event.clientY / sizes.height) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation with smoother transitions
        const clock = new THREE.Clock();
        let previousTime = 0;

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            const deltaTime = elapsedTime - previousTime;
            previousTime = elapsedTime;

            // Smooth mouse movement
            currentMouse.lerp(targetMouse, 0.1);

            // Update mixer if it exists
            if (mixerRef.current) {
                mixerRef.current.update(deltaTime);
            }

            // Smoother camera movement
            camera.position.x = THREE.MathUtils.lerp(
                camera.position.x,
                -Math.sin(currentMouse.x / 3) * 0.5,
                0.1
            );
            camera.position.y = THREE.MathUtils.lerp(
                camera.position.y,
                -Math.sin(currentMouse.y / 5) * 0.5,
                0.1
            );

            // Enhanced model rotation with smooth transitions
            if (parentRef.current) {
                if (lengthRef.current !== 0 && lengthRef.current !== 7.5 && lengthRef.current !== 7.6) {
                    const targetRotation = (lengthRef.current / 10) - 0.75;
                    parentRef.current.rotation.y = THREE.MathUtils.lerp(
                        parentRef.current.rotation.y,
                        targetRotation,
                        0.1
                    );
                }

                if (lengthRef.current === 7.5) {
                    parentRef.current.rotation.y = THREE.MathUtils.lerp(
                        parentRef.current.rotation.y,
                        Math.PI,
                        0.1
                    );
                }

                if (lengthRef.current === 7.6) {
                    parentRef.current.rotation.y = THREE.MathUtils.lerp(
                        parentRef.current.rotation.y,
                        0,
                        0.1
                    );
                }
            }

            renderer.render(scene, camera);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Enhanced window resize handling
        const handleResize = () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleResize);

        // Cleanup with proper animation frame cancellation
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (mixerRef.current) {
                mixerRef.current.stopAllAction();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            renderer.dispose();
            scene.clear(); // Clear all objects from the scene
        };
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        lengthRef.current = e.target.value.length;
        setError(''); // Clear any previous errors
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(''); // Clear any previous errors
    };

    const handlePasswordFocus = () => {
        lengthRef.current = 7.5;
    };

    const handlePasswordBlur = () => {
        lengthRef.current = 7.6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        // Validate form fields
        if (state === 'Sign Up') {
            if (!name.trim()) {
                setError('Please enter your full name');
                return;
            }
            if (!username.trim()) {
                setError('Please enter a username');
                return;
            }
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                setError('Username can only contain letters, numbers and underscores');
                return;
            }
            if (username.length < 3 || username.length > 30) {
                setError('Username must be between 3 and 30 characters');
                return;
            }
        }
        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }
        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    toast.success('Login successful!');
                    onClose();
                    navigate('/app');
                } else {
                    setError(data.message || 'Login failed');
                    toast.error(data.message || 'Login failed');
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password, username });
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    toast.success('Registration successful!');
                    onClose();
                    navigate('/app');
                } else {
                    setError(data.message || 'Registration failed');
                    toast.error(data.message || 'Registration failed');
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Operation failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.classList.contains('login-overlay')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="login-overlay">
            <div className="login-popup-card">
                <div className="model-container">
                    <canvas ref={canvasRef} className="webgl" />
                    {modelLoading && (
                        <div className="model-loading visible">
                            Loading 3D Model...
                        </div>
                    )}
                </div>
                <div className="popup-welcome-text">
                    <h2>{state === 'Login' ? 'Welcome back' : 'Create Account'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="form-container">
                    {state !== 'Login' && (
                        <>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="signup-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="signup-username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </>
                    )}
                    <div className="input-group">
                        <input
                            type="email"
                            id="login-email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Email or Username"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="login-password"
                            value={password}
                            onChange={handlePasswordChange}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            placeholder="Password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {error && (
                        <div className="error-message visible">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : state === 'Login' ? 'Unlock' : 'Create Account'}
                    </button>
                </form>
                <div className="popup-forgot">
                    <a href="/forgot-password">Forgot password?</a>
                </div>
                <div className="popup-signup">
                    {state === 'Login' ? (
                        <div>
                    <span>Don't have an account?</span>
                            <a href="#" onClick={(e) => { e.preventDefault(); setState('Sign Up'); }}>Sign up</a>
                        </div>
                    ) : (
                        <div>
                            <span>Already have an account?</span>
                            <a href="#" onClick={(e) => { e.preventDefault(); setState('Login'); }}>Login</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThreeLogin; 