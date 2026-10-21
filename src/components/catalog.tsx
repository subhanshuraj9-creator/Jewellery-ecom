"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories, products, type Category } from "@/lib/products";
import { ProductCard } from "./product-card";
export function Catalog({
  initialCategory = "All jewellery",
  newOnly = false,
  full = false,
}: {
  initialCategory?: Category;
  newOnly?: boolean;
  full?: boolean;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<Category>(initialCategory);
  const [sort, setSort] = useState("featured");
  const [onlyNew, setOnlyNew] = useState(newOnly);
  const selected = products.filter(
    (p) =>
      (category === "All jewellery" || p.category === category) &&
      (!onlyNew || p.badge === "NEW"),
  );
  if (sort === "price-low") selected.sort((a, b) => a.price - b.price);
  if (sort === "price-high") selected.sort((a, b) => b.price - a.price);
  return (
    <section
      className={`catalog section-space ${full ? "catalog-full" : ""}`}
      id="shop"
    >
      {!full && (
        <div className="section-heading">
          <div>
            <p className="editorial-label">All jewellery</p>
            <h2>Explore the collection.</h2>
          </div>
          <Link href="/collections" className="text-link">
            Shop all jewellery <ArrowRight size={16} />
          </Link>
        </div>
      )}
      <div className="catalog-toolbar">
        <div
          className="category-tabs"
          aria-label="Filter jewellery by category"
        >
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "active" : ""}
              onClick={() => {
                setCategory(c);
                if (full) {
                  const url = new URL(window.location.href);
                  if (c === "All jewellery")
                    url.searchParams.delete("category");
                  else url.searchParams.set("category", c);
                  router.replace(url.pathname + url.search, { scroll: false });
                }
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="sort-label">
          <span className="sr-only">Sort products</span>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
        <p className="catalog-count" aria-live="polite">
          {selected.length} {selected.length === 1 ? "piece" : "pieces"}
        </p>
      </div>
      {onlyNew && (
        <button
          className="filter-pill"
          onClick={() => {
            setOnlyNew(false);
            const url = new URL(window.location.href);
            url.searchParams.delete("edit");
            router.replace(url.pathname + url.search, { scroll: false });
          }}
        >
          New arrivals · Clear ×
        </button>
      )}
      <div className="product-grid">
        {selected.map((product, index) => (
          <ProductCard
            product={product}
            key={product.id}
            eager={full && index < 2}
          />
        ))}
      </div>
      {!selected.length && (
        <div className="empty-state">
          <h3>No matching jewellery.</h3>
          <p>Clear your filters to browse all eight pieces.</p>
          <button
            className="button button-dark"
            onClick={() => {
              setCategory("All jewellery");
              setOnlyNew(false);
              if (full) {
                const url = new URL(window.location.href);
                url.searchParams.delete("category");
                url.searchParams.delete("edit");
                router.replace(url.pathname + url.search, { scroll: false });
              }
            }}
          >
            Show all jewellery
          </button>
        </div>
      )}
    </section>
  );
}
