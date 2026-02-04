import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userService } from '../services/api';
import { Formik, Form, Field } from 'formik';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(user);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await userService.getAddresses();
        setAddresses(res.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            Addresses
          </button>
          <button
            className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payment Methods
          </button>
          <button
            className={`tab-btn ${activeTab === 'prime' ? 'active' : ''}`}
            onClick={() => setActiveTab('prime')}
          >
            Prime Membership
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="tab-content">
            <Formik
              initialValues={{
                firstName: profile?.firstName || '',
                lastName: profile?.lastName || '',
                email: profile?.email || '',
                phone: profile?.phone || '',
              }}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await userService.updateProfile(values);
                  setProfile(values);
                } catch (error) {
                  console.error('Error updating profile:', error);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {() => (
                <Form className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <Field type="text" name="firstName" />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <Field type="text" name="lastName" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <Field type="email" name="email" disabled />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <Field type="tel" name="phone" disabled />
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="tab-content">
            <h2>Saved Addresses</h2>
            <div className="addresses-list">
              {addresses.length === 0 ? (
                <p>No saved addresses</p>
              ) : (
                addresses.map(address => (
                  <div key={address._id} className="address-card">
                    <h4>{address.name}</h4>
                    <p>{address.addressLine1}, {address.addressLine2}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>Phone: {address.phone}</p>
                    <div className="address-actions">
                      <button>Edit</button>
                      <button>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="add-address-btn">+ Add New Address</button>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="tab-content">
            <h2>Saved Payment Methods</h2>
            <p>Coming soon...</p>
          </div>
        )}

        {activeTab === 'prime' && (
          <div className="tab-content">
            <h2>Prime Membership</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
