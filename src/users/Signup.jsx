import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { create } from './api-user';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';

const SignupForm = ({ onSigninLinkClick }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSigninClicked, setIsSigninClicked] = useState(false);
  // const [open, setOpen] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  // const [openDialog, setOpenDialog] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      const user = {
        name: name || undefined,
        email: email || undefined,
        password: password || undefined,
        role: 'user',
      };

      create(user)
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            console.log('Signup successful');
            setIsSignupSuccess(true);
            // setOpenDialog(true);
            // navigate('/signin');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleCloseDialog = () => {
    setIsSignupSuccess(false);
    navigate('/signin');
  };

  return (
    <div className="signup-container">
      <div className="card signup-form">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="lastName">Name:</label>
            <input
              type="lastName"
              id="lastName"
              name="lastName"
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
            />
            {nameError && (
              <span className="error-message" style={{ color: 'red' }}>
                {nameError}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <span className="error-message" style={{ color: 'red' }}>
                {emailError}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <span className="error-message" style={{ color: 'red' }}>
                {passwordError}
              </span>
            )}
          </div>
          <button type="submit">Sign up</button>
        </form>
        <p>
          Already have an Account?{' '}
          <span
            onClick={() => navigate('/signin')}
            style={{
              cursor: 'pointer',
              textDecoration: isSigninClicked ? 'underline' : 'none',
            }}
          >
            Sign in
          </span>
        </p>
      </div>
      <Dialog open={isSignupSuccess} onClose={handleCloseDialog}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignupForm;
