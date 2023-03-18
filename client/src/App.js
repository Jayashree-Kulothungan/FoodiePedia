import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Nav from "./components/Navigation/nav";
import AddReview from "./components/addReview";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import RestaurantDetails from "./components/restaurantDetails";
import Restaurants from "./components/restaurants";
import Stats from "./components/stats";

function App() {
	return (
		<div className="App">
			<Nav />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/addreview" element={<AddReview />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/restaurantdets/:id" element={<RestaurantDetails />} />
				<Route path="/restaurants" element={<Restaurants />} />
				<Route path="stats/" element={<Stats />} />
			</Routes>
		</div>
	);
}

export default App;
