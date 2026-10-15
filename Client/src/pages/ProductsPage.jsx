import {useEffect, useState} from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar.jsx';
import { axiosInstance } from '../axiosCalls/axios';


// const products = [
//   { name: 'The Diplomat Briefcase', category: 'Briefcases', price: '$1,250', initial: 'B' },
//   { name: 'Heritage Weekender', category: 'Travel', price: '$890', initial: 'W' },
//   { name: 'Bifold, Cognac', category: 'Wallets', price: '$310', initial: 'F' },
//   { name: 'The Scholar Satchel', category: 'Bags', price: '$640', initial: 'S' },
//   { name: 'Card Holder, Ebony', category: 'Wallets', price: '$180', initial: 'C' },
//   { name: 'The Gentlemen Belt', category: 'Accessories', price: '$220', initial: 'G' },
//   { name: 'Document Folio', category: 'Briefcases', price: '$470', initial: 'D' },
//   { name: 'Travel Wash Kit', category: 'Travel', price: '$260', initial: 'T' },
// ];

const categories = ['All Categories', 'Briefcases', 'Bags', 'Wallets', 'Travel', 'Accessories'];

export default function ProductsPage() {
  const [searchParam, setSearchParam] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [categoryParam, setCategoryParam] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  function handleSearch(e){
    // Search text becomes a query parameter for the backend filter.
    setSearchParam(e.target.value);
  }

  function handleCategory(e){
    // "All Categories" means no category filter should be sent.
    setCategoryParam(e.target.value);
  }

  async function fetchData(){
    setLoading(true);

    // Build query params only from active filters.
    const params = {}

    if(searchParam){
      params.search = searchParam;
    }

    if(categoryParam && categoryParam !== "All Categories"){
      params.category = categoryParam;
    }

    // Send the GET request with the applicable params.
    const response = await axiosInstance.get("/products", {
        params : params
    });

    if(response.data){
      setProductsData(response.data.products)
    }
    setLoading(false);
  }

  useEffect(()=>{
    async function fetchWishlist(){
      // This marks product cards as already wishlisted on first render.
      const response = await axiosInstance.get("/wishlist");

      const ids = response.data.products.map(p=>p._id)

      setWishlistIds(ids);
    }
    fetchWishlist();
  }, []);

  useEffect(()=>{fetchData()}, [searchParam, categoryParam]);



  return (
      <div className="min-h-screen bg-[#f6f1e7] font-serif text-[#2b2118]">
        <Navbar />

        {/* Page heading */}
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">The Collection</p>
          <h1 className="mt-3 text-4xl">All Goods</h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#c9bda6]" />
            <span className="text-[10px] text-[#b08d57]">❦</span>
            <span className="h-px w-10 bg-[#c9bda6]" />
          </div>
        </div>

        {/* Search + category bar */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-stretch gap-3 border-y border-[#d9cfbe] bg-[#fbf8f1] px-6 py-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8a7c66]">
                ⌕
              </span>
              <input
                type="text"
                placeholder="Search the collection…"
                className="w-full border border-[#d9cfbe] bg-[#f6f1e7] py-2.5 pl-9 pr-3.5 font-serif text-sm text-[#2b2118] outline-none transition placeholder:text-[#b3a68e] focus:border-[#7a4a2b]"
                onChange={handleSearch}
              />
            </div>

            {/* Category dropdown */}
            <select
              className="border border-[#d9cfbe] bg-[#f6f1e7] px-4 py-2.5 font-serif text-sm text-[#2b2118] outline-none transition focus:border-[#7a4a2b]"
              defaultValue="All Categories"
              onChange={handleCategory}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Sort dropdown */}
            <select
              className="border border-[#d9cfbe] bg-[#f6f1e7] px-4 py-2.5 font-serif text-sm text-[#2b2118] outline-none transition focus:border-[#7a4a2b]"
              defaultValue="Featured"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>

            {/* Apply all filters */}
            <button
              type="button"
              className="bg-[#2b2118] px-8 py-2.5 text-xs uppercase tracking-[0.25em] text-[#f6f1e7] transition hover:bg-[#7a4a2b] active:scale-[0.99]"
              onClick={fetchData}
            >
              Search
            </button>
          </div>
        </div>

        {/* Product grid */}
        <div className="mx-auto max-w-6xl px-6 py-12">
          {loading && (
            <p className="pb-6 text-center text-sm italic text-[#8a7c66]">Loading products...</p>
          )}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsData.map((p) => (
              <ProductCard
                key={p.name}
                _id={p._id}
                name={p.name}
                description={p.description}
                price={p.price}
                category={p.category}
                image={p.image}
                stock={p.stock}
                initialWishlisted={wishlistIds.includes(p._id)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-14 flex items-center justify-center gap-2">
            <button className="border border-[#c9bda6] bg-[#fbf8f1] px-4 py-2.5 text-xs text-[#2b2118] transition hover:border-[#2b2118]">
              ←
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`border px-4 py-2.5 text-xs transition ${
                  n === 1
                    ? 'border-[#2b2118] bg-[#2b2118] text-[#f6f1e7]'
                    : 'border-[#c9bda6] bg-[#fbf8f1] text-[#2b2118] hover:border-[#2b2118]'
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-2 text-[#8a7c66]">…</span>
            <button className="border border-[#c9bda6] bg-[#fbf8f1] px-4 py-2.5 text-xs text-[#2b2118] transition hover:border-[#2b2118]">
              8
            </button>
            <button className="border border-[#c9bda6] bg-[#fbf8f1] px-4 py-2.5 text-xs text-[#2b2118] transition hover:border-[#2b2118]">
              →
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#2b2118] text-[#c9bda6]">
          <div className="mx-auto max-w-6xl px-6 py-12 text-center">
            <p className="tracking-[0.25em]">
              ASHFORD <span className="text-[#b08d57]">&amp;</span> SONS
            </p>
            <p className="mt-10 text-[10px] tracking-[0.2em] text-[#8a7c66]">
              © 2026 Ashford &amp; Sons Ltd. · Northampton, England
            </p>
          </div>
        </footer>
      </div>
    );
}
