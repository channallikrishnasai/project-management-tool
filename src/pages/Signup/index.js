import { Link } from "react-router-dom";

// CSS
import "./index.css";

// Images
import Image from "../../assets/images/loginSide.png";

const Signup = () => {
  return (
    <div className="signup-container">
      <div className="left-section">
        <img src={Image} alt="Signup" />
      </div>

      <div className="right-section">
        <div className="signup-card">
          <div className="switch">
            <Link to="/login" className="switch-item">
              <h2 id="login">Log In</h2>
            </Link>
            <Link to="/signup" className="switch-item">
              <h2>Sign Up</h2>
            </Link>
          </div>

          <hr />

          <div className="signup-form">
            <input type="text" name="full-name" placeholder="Full Name" />
            <input type="text" name="email" placeholder="Email" />
            <input type="text" name="password" placeholder="Password" />

            <button type="submit">Sign Up</button>

            <span className="remember-me">
              <input type="checkbox" name="remember-me" />
              <span>Remember Me</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
