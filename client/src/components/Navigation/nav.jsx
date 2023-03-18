import React from "react";
import { Link } from "react-router-dom";
import { PrimaryNav, MenuLink, Menu, Hamburger } from "./NavStructure";
export default function Nav() {
	return (
		<>
			<PrimaryNav>
				<Menu>
					<MenuLink to="/" activeStyle>
						Home
					</MenuLink>
					<MenuLink to="/restaurants" activeStyle>
						Restaurants
					</MenuLink>
					<MenuLink to="/addreview" activeStyle>
						Add Reviews
					</MenuLink>
					<MenuLink to="/stats" activeStyle>
						Statistics
					</MenuLink>
					<MenuLink to="/login" activeStyle>
						Login/Register
					</MenuLink>
				</Menu>
			</PrimaryNav>
		</>
	);
}
