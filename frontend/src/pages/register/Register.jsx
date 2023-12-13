import { userStore } from "../../stores/userStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../register/register.module.css";
import { Logo } from "../../components/logo/Logo";

export const Register = () => {
  // can use get method from the userStore
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   initialize the navigate function
  const navigate = useNavigate();
  // function to handle the click event of the signup button
  const storeHandleSignup = userStore((state) => state.handleSignup);

  const onSignupClick = async () => {
    if (!username || !password || !email) {
      alert("Please enter email, username, and password");
      return;
    }

    // Password validation using Regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]{6,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 6 characters and include lowercase, uppercase, and a number."
      );
      return;
    }

    // Email validation using Regex
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   alert("Please enter a valid email address");
    //   return;
    // }

    try {
      await storeHandleSignup(username, password, email);

      navigate("/login");
    } catch (error) {
      // Handle any errors that occur during signup
      console.error("Signup error:", error);
      alert("An error occurred during signup");
    }
  };

  return (
    <section className={styles.section}>
      <nav className={styles.register}>
        <ul>
          <Link to="/">Back</Link>
          <Link to="/login">Login</Link>
        </ul>
      </nav>
      <div className={styles.logo}>
        <Logo />
      </div>

      <div className={styles.signUp}>
        <h2 className={styles.title}>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className={styles.firstText}>
          Password (must be 6 characters or more, including both uppercase,
          lowercase letters and a number).
        </p>
        <p className={styles.secondText}>
          Your personal data will be used to support your experience throughout
          this website, to manage access to your account, and for other purposes
          described in our private policy.
        </p>
        <button onClick={onSignupClick}>Sign Up</button>
      </div>
    </section>
  );
};
