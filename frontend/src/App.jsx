//NOTE : Reviewed on 24th may, 2026

import React, { useEffect } from 'react';
import { setupAxiosInterceptors } from './services/api/client';
import AppRoutes from './routes';

function App() {
  useEffect(() => {
    // Maintain compatibility with interceptor setup
    setupAxiosInterceptors();
  }, []);

  return <AppRoutes />;
}

export default App;
