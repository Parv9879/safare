import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { ChevronRight } from "react-feather"
import { categories, sliderItems } from '@/dummydata'

import Button from "@/components/Button"
import Container from "@/components/Container"
import CategoryList from "@/ui/CategoryList"
import ProductList from "@/ui/ProductList"
import Newsletter from "@/ui/Newsletter"
import Slider from "@/ui/Slider"
import api from '../api'
import { CartContext, UserContext } from "@/App"
import Carousel from '../components/Carousel'


export default function HomePage() {
	const { user } = useContext(UserContext)
	const { cartDispatch } = useContext(CartContext)
	const [products, setProducts] = useState([])

	useEffect(() => {
		(async () => {
			try {
				const resp = await api.fetchProducts("", true)
				console.log('API Response:', resp)
				if (resp.status !== "error") {
					setProducts(resp)
				} else {
					console.error('Error fetching products:', resp)
					setProducts([]) // Set empty array as fallback
				}
			} catch (error) {
				console.error('Failed to fetch products:', error)
				setProducts([]) // Set empty array as fallback
			}
		})()
	}, [])

	const addToCart = async (product, quantity = 1) => {
		if (user) {
			const resp = await api.addProductsToCart([{ productID: product._id, quantity }])
			if (resp.status === "ok") {
				cartDispatch({ type: "ADD_PRODUCTS", payload: [{ ...product, quantity }] })
			}
		} else {
			cartDispatch({ type: "ADD_PRODUCTS", payload: [{ ...product, quantity }] })
		}
	}

	return (
		<main>
			{/* Branding Intro */}
			<section className="text-center py-8">
				<h1 className="text-4xl font-bold text-gray-800">Welcome to <span className="text-red-500">Safaré</span></h1>
				<p className="text-lg text-gray-600 mt-2">Explore premium Indian men’s fashion</p>
			</section>

			{/* Hero Carousel */}
			<section>
				<Carousel slides={sliderItems} />
			</section>

			{/* Popular Categories */}
			<Container heading="Explore by Occasion">
				<CategoryList categories={categories} />
			</Container>

			{/* Latest Arrivals (modified) */}
			<Container heading="Latest Arrivals">
				{products && products.length > 0 ? (
					<ProductList products={products.slice(0, 4)} onAddToCart={addToCart} />
				) : (
					<p className="text-center text-gray-500">Loading products...</p>
				)}

				<Link to="/products" className="flex justify-center">
					<Button className="text-lg mt-6" link>
						Browse Full Collection <ChevronRight className="ml-2" />
					</Button>
				</Link>
			</Container>

			{/* Newsletter */}
			<section className="my-20">
				<Newsletter />
			</section>
		</main>
	)
}
