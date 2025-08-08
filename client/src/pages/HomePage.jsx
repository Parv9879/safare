import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { ChevronRight } from "react-feather"
import { categories, sliderItems } from '@/dummydata'

import Button from "@/components/Button"
import Container from "@/components/Container"
import CategoryList from "@/ui/CategoryList"
import ProductList from "@/ui/ProductList"
import Newsletter from "@/ui/Newsletter"
import api from '../api'
import { CartContext, UserContext } from "@/App"
import Carousel from '../components/Carousel'

// --- If you chose Option B (import), uncomment this:
// import heroVideo from '@/assets/hero.mp4';

export default function HomePage() {
  const { user } = useContext(UserContext)
  const { cartDispatch } = useContext(CartContext)
  const [products, setProducts] = useState([])
  const [videoError, setVideoError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.fetchProducts("", true)
        if (resp.status !== "error") setProducts(resp)
        else setProducts([])
      } catch (e) {
        console.error('Failed to fetch products:', e)
        setProducts([])
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
      {/* ===== Top Fullscreen Hero Video ===== */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {/* Fallback poster or loader */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/70">Loading video…</span>
          </div>
        )}

        <video
          // Option A: using public/ path
          src="/assets/hero.mp4"

          // Option B: using import (uncomment the import above and this line)
          // src={heroVideo}

          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          onCanPlay={() => setVideoLoaded(true)}
          onError={(e) => {
            setVideoError(true)
            console.error('Hero video failed to load.', e?.currentTarget?.src)
          }}
        >
          {/* Backup sources if you have them */}
          {/* <source src="/assets/hero.webm" type="video/webm" /> */}
          {/* <source src="/assets/hero.mp4" type="video/mp4" /> */}
        </video>

        {/* Optional overlay text (remove if you want pure video) */}
        {/* <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-widest uppercase">Safaré</h1>
        </div> */}

        {/* If error, show a fallback still */}
        {videoError && (
          <img
            src="/assets/hero-fallback.jpg"
            alt="Hero fallback"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </section>

      {/* ===== Hero Carousel ===== */}
      <section>
        <Carousel slides={sliderItems} />
      </section>

      {/* ===== Popular Categories ===== */}
      <Container heading="Explore by Occasion">
        <CategoryList categories={categories} />
      </Container>

      {/* ===== Latest Arrivals ===== */}
      <Container heading="Latest Arrivals">
        {products?.length ? (
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

      {/* ===== Newsletter ===== */}
      <section className="my-20">
        <Newsletter />
      </section>
    </main>
  )
}
