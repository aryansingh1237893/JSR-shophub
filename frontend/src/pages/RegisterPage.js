import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../services/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AuthPages.css';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');
      const { confirmPassword, ...userData } = values;
      const res = await authService.register(userData);
      localStorage.setItem('token', res.data.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: res.data.user, token: res.data.token },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Join ShopHub</h1>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <Field type="text" name="firstName" placeholder="First name" />
                  <ErrorMessage name="firstName" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <Field type="text" name="lastName" placeholder="Last name" />
                  <ErrorMessage name="lastName" component="span" className="error" />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <Field type="email" name="email" placeholder="Enter your email" />
                <ErrorMessage name="email" component="span" className="error" />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <Field type="tel" name="phone" placeholder="10 digit phone number" />
                <ErrorMessage name="phone" component="span" className="error" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <Field type="password" name="password" placeholder="At least 6 characters" />
                <ErrorMessage name="password" component="span" className="error" />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <Field type="password" name="confirmPassword" placeholder="Re-enter password" />
                <ErrorMessage name="confirmPassword" component="span" className="error" />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
