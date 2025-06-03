import React, { useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const RemoveBackground = () => {
  const { backendUrl, token, credit, loadCreditsData } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    if (credit <= 0) {
      toast.error('No credits left! Please purchase more credits.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      formData.append('image', blob, 'image.png');

      const { data } = await axios.post(
        `${backendUrl}/api/image/remove-background`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token
          }
        }
      );

      if (data.success) {
        setProcessedImage(data.processedImage);
        loadCreditsData();
        toast.success('Background removed successfully!');
      } else {
        toast.error(data.message || 'Failed to remove background');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove background');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'removed-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen p-8 flex flex-col items-center justify-center bg-transparent"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="max-w-4xl w-full bg-transparent rounded-lg shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Remove Image Background
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-emerald-900">
                  <p>Click to upload image</p>
                  <p className="text-sm">(Max size: 5MB)</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Processed Image Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-full h-64 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-transparent">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing...</p>
                  </motion.div>
                ) : processedImage ? (
                  <motion.img
                    key="processed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    src={processedImage}
                    alt="Processed"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-emerald-900"
                  >
                    <p>Processed image will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveBackground}
            disabled={!selectedImage || loading}
            className={`px-6 py-3 rounded-full text-white font-medium ${
              !selectedImage || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Remove Background'}
          </motion.button>

          {processedImage && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700"
              >
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-6 py-3 rounded-full bg-gray-600 text-white font-medium hover:bg-gray-700"
              >
                Reset
              </motion.button>
            </>
          )}
        </div>

        {/* Credits Display */}
        <div className="mt-6 text-center text-gray-600">
          <p>Credits remaining: {credit}</p>
          <p className="text-sm">1 credit per image</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RemoveBackground; 