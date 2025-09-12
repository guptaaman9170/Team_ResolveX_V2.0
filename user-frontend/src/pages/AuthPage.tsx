import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const AuthPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse: any) => {
    console.log("Google Credentials:", credentialResponse);

    // Save token or user info to localStorage/sessionStorage
    localStorage.setItem("google_token", credentialResponse.credential);

    // After login, redirect to Index
    navigate("/");
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign in with Google
        </h1>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default AuthPage;
