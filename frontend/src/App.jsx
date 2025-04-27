import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SchoolTransactions from './pages/SchoolTransactions';
import StatusChecker from './pages/StatusChecker';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/school/:schoolId" element={<SchoolTransactions />} />
              <Route path="/check-status" element={<StatusChecker />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
