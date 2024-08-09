import React, { useState } from "react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/${isLogin ? 'login' : 'signup'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    console.log('Success:', data);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row full-height justify-content-center">
          <div className="col-12 text-center align-self-center py-5">
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <h6 className="mb-0 pb-3">
                <span className={isLogin ? "font-bold" : ""}>Log In </span>
                <span className={!isLogin ? "font-bold" : ""}>Sign Up</span>
              </h6>
              <input
                className="checkbox"
                type="checkbox"
                id="reg-log"
                name="reg-log"
                onChange={() => setIsLogin(!isLogin)}
              />
              <label htmlFor="reg-log"></label>
              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">
                  <div className={`card-front ${isLogin ? "" : "hidden"}`}>
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Log In</h4>
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input
                              type="email"
                              name="email"
                              className="form-style"
                              placeholder="Your Email"
                              id="logemail"
                              autoComplete="off"
                              onChange={handleInputChange}
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="password"
                              className="form-style"
                              placeholder="Your Password"
                              id="logpass"
                              autoComplete="off"
                              onChange={handleInputChange}
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          <button type="submit" className="btn mt-4">
                            Submit
                          </button>
                        </form>
                        <p className="mb-0 mt-4 text-center">
                          <a href="#0" className="link">
                            Forgot your password?
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`card-back ${!isLogin ? "" : "hidden"}`}>
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Sign Up</h4>
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input
                              type="text"
                              name="name"
                              className="form-style"
                              placeholder="Your Full Name"
                              id="logname"
                              autoComplete="off"
                              onChange={handleInputChange}
                            />
                            <i className="input-icon uil uil-user"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="email"
                              name="email"
                              className="form-style"
                              placeholder="Your Email"
                              id="logemail"
                              autoComplete="off"
                              onChange={handleInputChange}
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="password"
                              className="form-style"
                              placeholder="Your Password"
                              id="logpass"
                              autoComplete="off"
                              onChange={handleInputChange}
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          <button type="submit" className="btn mt-4">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}