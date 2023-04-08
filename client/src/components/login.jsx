import React, { useState } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Typography, Link } from "@material-ui/core";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";


const Login = ({ handleChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const poolData = {
    UserPoolId: "us-east-1_ejWiyq9E0",
    ClientId: "3m5b119nb903msrjh7jl6pp12j",
  };

  const userPool = new CognitoUserPool(poolData);
  const theme = createTheme();
  const handleSubmit = (e) => {
    e.preventDefault();

    const authenticationData = {
      Username: email,
      Password: password,
    };

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails(authenticationData);

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        const user = data["accessToken"]["payload"]["username"];
        localStorage.setItem("user", user);
        navigate("/home");
        window.location.reload();
      },
      onFailure: (err) => {
        console.error("Login failure:", err);
      },
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

// const Login = ({ handleChange }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const poolData = {
//     UserPoolId: 'us-east-1_tZ4v5GsGx',
//     ClientId: '5r7hias527h55b1mvml5qg2lvg'
//   };

//   const userPool = new CognitoUserPool(poolData);

//   const onSubmit = e => {
//     e.preventDefault();

//     const authenticationData = {
//       Username: email,
//       Password: password
//     };

//     const user = new CognitoUser({
//       Username: email,
//       Pool: userPool
//     });

//     const authDetails = new AuthenticationDetails(authenticationData);

//     user.authenticateUser(authDetails, {
//       onSuccess: data => {
//         console.log('Login success:', data);
// 		<Link to="/restaurant"></Link>
//       },
//       onFailure: err => {
//         console.error('Login failure:', err);
//         setErrorMessage(err.message);
//       }
//     });
//   };

//   return (
//     <form onSubmit={onSubmit}>
//       {errorMessage && <div className="error">{errorMessage}</div>}
//       <div>
//         <label htmlFor="email">Email:</label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="password">Password:</label>
//         <input
//           type="password"
//           id="password"
//           name="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//         />
//       </div>
// 	  <button type="submit" onClick={(e) => {e.preventDefault(); window.location.href="/restaurants"}}>Login</button>
//       <Typography > Do you have an account ?
//            <Link href="/register" onClick={() => handleChange("event", 1)} >
//                         Register
//             </Link>
//       </Typography>
//     </form>
//   );
// };

export default Login;
