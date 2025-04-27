import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSchool, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FaHome },
    { path: '/check-status', label: 'Check Status', icon: FaSearch },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              School Payments
            </Link>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <Icon className="mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
