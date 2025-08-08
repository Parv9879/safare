import React, { useContext, useState, useEffect } from 'react'
import clsx from "clsx"
import { Link } from "react-router-dom"
import { Menu, Search, User, LogIn, X, ShoppingCart } from "react-feather"

import { UserContext, CartContext } from '@/App'
import Button from "@/components/Button"
import Input from "@/components/Input"
import UserDropDown from '@/components/UserDropDown'
import api from "@/api"
import useClickOutside from '@/hooks/useClickOutside'

export default function Navbar() {
	const { user, setUser } = useContext(UserContext)
	const { cart, cartDispatch } = useContext(CartContext)
	const [showMenu, setShowMenu] = useState(false)
	const [shrinkLogo, setShrinkLogo] = useState(false)
	const navbarRef = useClickOutside(() => setShowMenu(false))

	useEffect(() => {
		const handleScroll = () => {
			setShrinkLogo(window.scrollY > 100)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<nav
			ref={navbarRef}
			className={clsx(
				"w-full sticky top-0 z-50 backdrop-blur-md",
				"bg-white/80 shadow-md px-6 py-3 flex flex-wrap items-center justify-between"
			)}
		>
			{/* --- LOGO --- */}
			<div className="flex items-center">
				<Link to="/" className="block">
					<video
						src="/assets/Safare.mp4"
						autoPlay
						loop
						muted
						playsInline
						className={clsx(
							"transition-all duration-500 object-contain",
							shrinkLogo ? "h-[50px]" : "h-[110px]"
						)}
					/>
				</Link>
			</div>

			{/* --- MENU & USER ICONS --- */}
			<div className="flex items-center space-x-4 md:order-2">
				{/* Cart */}
				<Link to="/cart" className="relative flex items-center pr-2">
					<ShoppingCart width={24} height={24} />
					{cart.products.length > 0 && (
						<div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex justify-center items-center">
							{cart.products.length}
						</div>
					)}
				</Link>

				{/* User */}
				{user && (
					<UserDropDown
						user={user}
						onLogout={() => {
							api.logoutUser()
							setUser(null)
							cartDispatch({ type: "RESET" })
						}}
					/>
				)}

				{/* Mobile menu toggle */}
				<button className="md:hidden focus:outline-none">
					{showMenu ? (
						<X width={24} height={24} onClick={() => setShowMenu(false)} />
					) : (
						<Menu width={24} height={24} onClick={() => setShowMenu(true)} />
					)}
				</button>
			</div>

			{/* --- NAV LINKS --- */}
			<div
				className={clsx(
					"hidden w-full md:flex md:items-center md:w-auto md:order-1",
					showMenu && "!flex flex-col mt-4"
				)}
			>
				<ul
					className={clsx(
						"flex flex-col items-center space-y-1 mt-4 md:flex-row md:space-y-0 md:space-x-6 md:mt-0"
					)}
					onClick={() => setShowMenu(false)}
				>
					<NavLink to="/products?category=men">Men</NavLink>
					<NavLink to="/products?category=women">Women</NavLink>
					<NavLink to="/products">All Products</NavLink>
				</ul>

				{/* Search bar */}
				<div className="flex items-center mt-4 md:mt-0 md:ml-6">
					<Input
						className="md:max-w-xs bg-white/80"
						icon={<Search />}
						placeholder="Search..."
					/>
				</div>

				{/* Auth Buttons */}
				{!user && (
					<ul
						className={clsx(
							"flex flex-col mt-4 md:flex-row md:space-x-4 md:mt-0"
						)}
					>
						<li>
							<Link to="/login">
								<Button secondary className="w-full md:w-auto">
									<LogIn width={20} height={20} className="mr-2" />
									Login
								</Button>
							</Link>
						</li>
						<li>
							<Link to="/register">
								<Button className="w-full md:w-auto">
									<User width={20} height={20} className="mr-2" />
									Register
								</Button>
							</Link>
						</li>
					</ul>
				)}
			</div>
		</nav>
	)
}

function NavLink({ children, to }) {
	return (
		<li className="text-gray-700 hover:text-gray-900 font-medium">
			<Link to={to}>{children}</Link>
		</li>
	)
}