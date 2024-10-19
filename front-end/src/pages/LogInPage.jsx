import { useState, useEffect } from "react";
import "../assets/LogInPage.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const ErrorNotification = ({ message }) => {
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      if (message) {
        setVisible(true); // Hiển thị thông báo khi có message mới
  
        const timer = setTimeout(() => {
          setVisible(false); // Ẩn thông báo sau 3 giây
        }, 3000);
  
        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
      }
    }, [message]); // Chạy lại khi message thay đổi
  
    if (!visible) return null; // Không render gì nếu không visible
  
    return (
      <div className="login-page__error-notification">
        {message}
      </div>
    );
  };
  

const LogInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // State for error message
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("Sai mật khẩu."); // Set error message
  };
  // Check if the button should be disabled based on input values
  const isButtonDisabled = !username || !password;

  return (
    <div className="login-page">
      <form method="post" className="login-page__form" onSubmit={handleSubmit}>
        <img
        src="../../public/thread.ico"
        alt="Logo"
        className="login-page__logo"
        style={{ display: window.innerWidth <= 480 ? "block" : "none" }} // Điều kiện hiển thị logo
      />
        <span>
          <p className="login-page__title">Đăng nhập bằng tài khoản Instagram</p>
        </span>

        <div id="input-format">
          <input
            required
            type="text"
            placeholder="Tên người dùng, số điện thoại hoặc email"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username value
          />
        </div>

        <div id="input-format" style={{ position: "relative" }}>
          <input
            required
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            name="password"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setError("")}} // Update password value
          />
          {password && ( // Show the eye icon only if there's a password
            <span
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent the input from being focused
                toggleShowPassword();
              }}
            >
              {showPassword ? <VscEyeClosed /> : <VscEye />}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="login-page__button"
          disabled={isButtonDisabled}
        >
          Đăng nhập
        </button>

        <a href="#" className="login-page__forgot-password">
          Bạn quên mật khẩu ư?
        </a>

        <div className="login-page__separator">
          <hr />
          <span>hoặc</span>
          <hr />
        </div>

        <div className="login-page__instagram-login">
          <img
            src="../../public/instagram.png"
            alt="Instagram"
            width="45"
            height="45"
          />
          <span>
            <p>Tiếp tục bằng Instagram</p>
          </span>
          <span className="login-page__arrow">
            <svg
              aria-label="Đăng nhập"
              role="img"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              transform="rotate(180)"
              stroke="currentColor"
            >
              <title>Đăng nhập</title>
              <polyline points="16.502 3 7.498 12 16.502 21" />
            </svg>
          </span>
        </div>

        <ErrorNotification message={error} />
      </form>

      <footer>
        <div className="login-page__footer-links">
          <span>© 2024</span>
          <a
            href="https://help.instagram.com/769983657850450"
            target="_blank"
            rel="noopener noreferrer"
          >
            Điều khoản của Threads
          </a>
          <a
            href="https://help.instagram.com/515230437301944"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chính sách quyền riêng tư
          </a>
          <a
            href="https://privacycenter.instagram.com/policies/cookies/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chính sách Cookie
          </a>
          <a href="#">Báo cáo sự cố</a>
        </div>
      </footer>
    </div>
  );
};

export default LogInPage;
