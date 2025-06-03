# Frontend Application

This is the frontend application for the project, built with React and Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

3. Start the development server:
```bash
npm run dev
```

## Razorpay Integration

The application uses Razorpay for payment processing. The integration is handled through several components:

### 1. Script Loading
- The Razorpay script is loaded asynchronously in `index.html`
- A utility function in `src/utils/razorpay.js` handles script loading and error suppression

### 2. Payment Flow
1. User selects a plan in `BuyCredit.jsx`
2. Backend creates an order
3. Frontend initializes Razorpay payment
4. User completes payment
5. Backend verifies payment
6. Credits are added to user's account

### Error Handling
- Invalid URL errors are suppressed
- Payment failures show user-friendly error messages
- Loading states are properly managed
- Network errors are handled gracefully

### Environment Variables
- `VITE_RAZORPAY_KEY_ID`: Your Razorpay public key
- `VITE_BACKEND_URL`: Backend API URL

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── context/        # React context providers
├── pages/          # Page components
├── utils/          # Utility functions
└── main.jsx        # Application entry point
```

## Dependencies

- React
- Vite
- Axios
- React Router
- Framer Motion
- React Toastify
- TailwindCSS
