import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from '@sabfry/avatarium';
import { Formik, Form, Field } from 'formik';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
      axios.get('https://api.example.com/user')
        .then(response => setUser(response.data))
        .catch(error => console.error('Error fetching user data:', error));
    }, []);
    if (!user) return <div>Loading...</div>;
    return (
      <div className="profile-page">
        <h1>Profile Page</h1>
        <div className="profile-info">
          <Avatar theme="blobs" />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <Formik
            initialValues={{ name: user.name, email: user.email }}
            onSubmit={(values, { setSubmitting }) => {
              axios.post('https://api.example.com/user/update', values)
                .then(response => {
                  setUser(response.data);
                  setSubmitting(false);
                })
                .catch(error => {
                  console.error('Error updating user data:', error);
                  setSubmitting(false);
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div>
                  <label htmlFor="name">Name</label>
                  <Field id="name" name="name" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <Field id="email" name="email" placeholder="john.doe@example.com" type="email" />
                </div>
                <button type="submit" disabled={isSubmitting}>
                  Update
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };
  export default ProfilePage;