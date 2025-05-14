
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  // Immediately redirect to dashboard without any authentication checks
  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Redirecting to dashboard...
    </div>
  );
};

export default Index;
