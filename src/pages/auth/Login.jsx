import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import AlertPopup from "../../components/common/AlertPopup";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import './login.css'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role) {
      navigate(`/${role}`);
    }
  }, [user, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setAlert({ show: true, message: "Credenciales inválidas" , type: "info" });
      console.error(e);
    }
  };

  return (
    <>
      <div className="section-alert">
        <AlertPopup
          show={alert.show}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      </div>
      <section className="login">
        <img src="../../src/assets/login.jpg" alt="Login" className="login--image" />
        <form onSubmit={handleLogin} className="login--form">
          <h1 className="login--title">Login</h1>

          <div className="login--content">
            <div className="login-box">
              <i className="ri-user-3-line login-icon"></i>
              <div className="login--input-box">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                  placeholder=" "
                />
                <label htmlFor="" className="login--input-label">Email</label>
              </div>
            </div>

            <div className="login-box">
              <i className="ri-lock-2-line login-icon"></i>
              <div className="login--input-box">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                  placeholder=" "
                />
                <label htmlFor="" className="login--input-label">Password</label>
                <i className="ri-eye-off-line login--eye" id="login--eye"></i>
              </div>
            </div>
          </div>

          <div className="login--check">
            <div className="login-check-group">
              <input type="checkbox" className="login--check-input" name="check" />
              <label htmlFor="" className="chek--label">Remember Me</label>
            </div>

            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login--button">Entrar</button>


        </form>
      </section>


    </>
  );
}
