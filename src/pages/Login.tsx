
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  // Add a direct access button to dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">ELIBEST MS</h1>
        <p className="text-text/70">Shoe Management System</p>
      </div>
      
      <div className="w-full max-w-md">
        <button 
          onClick={goToDashboard}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg mb-4 font-medium"
        >
          Access Dashboard Directly
        </button>
        
        <div className="border-t border-gray-200 my-6">
          <p className="text-center text-text/70 bg-light relative top-[-12px] inline-block px-4">
            OR
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
