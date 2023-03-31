import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import userPool from "../UserPool";
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const theme = createTheme();

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [givenName, setGivenName] = useState("");
	const [familyName, setfamilyName] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setEmail(data.get("email"));
		setPassword(data.get("password"));
		setGivenName(data.get("firstName"));
		setfamilyName(data.get("lastName"));
		var attributeList = [];
		var dataEmail = {
			Name: "email",
			Value: email,
		};
		var dataGivenName = {
			Name: "given_name",
			Value: givenName,
		};
		var dataFamilyName = {
			Name: "family_name",
			Value: familyName,
		};
		var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
			dataEmail
		);
		var attributegivenName = new AmazonCognitoIdentity.CognitoUserAttribute(
			dataGivenName
		);
		var attributefamilyName = new AmazonCognitoIdentity.CognitoUserAttribute(
			dataFamilyName
		);
		attributeList.push(attributeEmail);
		attributeList.push(attributegivenName);
		attributeList.push(attributefamilyName);
		userPool.signUp(email, password, attributeList, null, (err, result) => {
			if (result) {
				console.log("user successfully added to cognito");
			}
		});
	};

	return (
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
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="#" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
