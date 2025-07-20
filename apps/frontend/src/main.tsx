import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './components/theme-provider.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { TopBar } from './components/top-bar.tsx';
import { Footer } from './components/footer.tsx';
// import { registerSW } from "virtual:pwa-register";
import { QueryProvider } from './api/QueryProvider.tsx';
import './api/openapi-init.ts';

// registerSW({
//   immediate: true,
// });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <QueryProvider>
          <AuthProvider>
            <Toaster />
            <TopBar />
            <main className="pt-14 min-h-[calc(100vh-3.5rem)]">
              <App />
            </main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
