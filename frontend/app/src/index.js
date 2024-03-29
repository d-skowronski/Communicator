import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AuthProvider } from './context/AuthContext';
import 'react-tooltip/dist/react-tooltip.css'
import './css/GlobalStyles.css'

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools/>}
  </QueryClientProvider>
);

