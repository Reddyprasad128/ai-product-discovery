import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, token, role, allowedRoles }) => {
  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
