import React, { useState } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Typography, Link } from '@material-ui/core';

const Login = ({ handleChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const poolData = {
    UserPoolId: 'us-east-1_tZ4v5GsGx',
    ClientId: '5r7hias527h55b1mvml5qg2lvg'
  };

  const userPool = new CognitoUserPool(poolData);

  const onSubmit = e => {
    e.preventDefault();

    const authenticationData = {
      Username: email,
      Password: password
    };

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    const authDetails = new AuthenticationDetails(authenticationData);

    user.authenticateUser(authDetails, {
      onSuccess: data => {
        console.log('Login success:', data);
		<Link to="/restaurant"></Link>
      },
      onFailure: err => {
        console.error('Login failure:', err);
        setErrorMessage(err.message);
      }
    });
  };

  return (
    <form onSubmit={onSubmit}>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
	  <button type="submit" onClick={(e) => {e.preventDefault(); window.location.href="/restaurants"}}>Login</button>
      <Typography > Do you have an account ?
           <Link href="/register" onClick={() => handleChange("event", 1)} >
                        Register
            </Link>
      </Typography>
    </form>
  );
};

export default Login;
