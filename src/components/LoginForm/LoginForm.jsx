import "./LoginForm.css";

export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload for now
    alert("Login clicked (stub)");
  };

  return (
    <div className="mda-login">
      <h2 className="mda-login-title">Broker / Builder Login</h2>
      <form className="mda-login-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <a className="mda-forgot" href="#">
          Forgot Password?
        </a>
      </form>
    </div>
  );
}
