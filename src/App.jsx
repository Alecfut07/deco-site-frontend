import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import PortfolioGallery from './components/Portfolio/PortfolioGallery';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <Services />
        <PortfolioGallery />
        <About />
        <Contact />
        <Footer />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;