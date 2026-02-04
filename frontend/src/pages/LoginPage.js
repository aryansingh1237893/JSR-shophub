import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../services/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AuthPages.css';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState('email');

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');
      const res = await authService.login(values);
      localStorage.setItem('token', res.data.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: res.data.user, token: res.data.token },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login to ShopHub</h1>

        {/* Login Method Toggle */}
        <div className="login-method-toggle">
          <button
            className={loginMethod === 'email' ? 'active' : ''}
            onClick={() => setLoginMethod('email')}
          >
            Email
          </button>
          <button
            className={loginMethod === 'phone' ? 'active' : ''}
            onClick={() => setLoginMethod('phone')}
          >
            Phone
          </button>
        </div>

        {loginMethod === 'email' && (
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="auth-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label>Email</label>
                  <Field type="email" name="email" placeholder="Enter your email" />
                  <ErrorMessage name="email" component="span" className="error" />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <Field type="password" name="password" placeholder="Enter your password" />
                  <ErrorMessage name="password" component="span" className="error" />
                </div>

                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {loginMethod === 'phone' && (
          <Form className="auth-form">
            <div className="form-group">
              <label>Phone Number</label>
              <Field type="tel" name="phone" placeholder="+91" />
            </div>
            <button type="button" className="submit-btn">
              Send OTP
            </button>
          </Form>
        )}

        <div className="divider">or</div>

        <div className="social-login">
          <button className="google-btn">Continue with Google</button>
          <button className="facebook-btn">Continue with Facebook</button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
