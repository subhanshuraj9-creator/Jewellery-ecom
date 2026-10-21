"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { useStore } from "./store-provider";
import { Modal } from "./modal";
import { products, money, categories } from "@/lib/products";
export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = headerRef.current;
    const film = document.getElementById("film");
    if (!header || pathname !== "/" || !film) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // The film finishes when its sticky stage reaches the end of its track.
      const released = film.getBoundingClientRect().bottom <= innerHeight + 1;
      header.dataset.filmReleased = String(released);
      header.inert = !released;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(film);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      delete header.dataset.filmReleased;
      header.inert = false;
    };
  }, [pathname]);
  const { count, setBagOpen } = useStore();
  const [panel, setPanel] = useState<"search" | "account" | "menu" | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const filtered = products.filter((p) =>
    `${p.name} ${p.category} ${p.materials}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  const close = () => setPanel(null);
  return (
    <>
      <div className="announcement">
        <span>Sculptural jewellery in 18k gold vermeil</span>
        <Link href="/collections" className="announcement-right">
          Explore the collection <ArrowUpRight size={12} />
        </Link>
      </div>
      <header ref={headerRef} className="header">
        <button
          className="icon-button mobile-menu"
          aria-label="Open navigation"
          onClick={() => setPanel("menu")}
        >
          <Menu size={21} />
        </button>
        <Link className="wordmark" href="/" aria-label="Aurelle home">
          AURELLE<span>GOLD JEWELLERY</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/collections">Shop all</Link>
          <Link href="/collections?edit=new">
            New arrivals <span className="tiny-dot" />
          </Link>
          <Link href="/#lookbook">The lookbook</Link>
          <Link href="/#final-edit">Our philosophy</Link>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search jewellery"
            onClick={() => setPanel("search")}
          >
            <Search size={19} />
          </button>
          <button
            className="icon-button account-button"
            aria-label="Your account"
            onClick={() => setPanel("account")}
          >
            <UserRound size={19} />
          </button>
          <button
            className="icon-button bag-button"
            aria-label={`Open shopping bag, ${count} items`}
            onClick={() => setBagOpen(true)}
          >
            <ShoppingBag size={19} />
            <span>{count}</span>
          </button>
        </div>
      </header>
      <Modal open={panel === "search"} onClose={close} title="Search jewellery">
        <label className="search-input">
          <Search size={20} />
          <input
            autoComplete="off"
            type="search"
            placeholder="Try rings, pearls, or Solstice…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </label>
        <p className="eyebrow search-caption">
          {query ? `${filtered.length} PIECES FOUND` : "EXPLORE THE COLLECTION"}
        </p>
        <div className="search-results">
          {filtered.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} onClick={close}>
              <Image src={p.image} alt="" width={62} height={70} />
              <div>
                <span className="serif">{p.name}</span>
                <small>
                  {p.category} · {money(p.price)}
                </small>
              </div>
              <ArrowUpRight size={17} />
            </Link>
          ))}
          {!filtered.length && (
            <p className="search-empty">
              No pieces found. Try “gold”, “ring”, or “pearl”.
            </p>
          )}
        </div>
      </Modal>
      <Modal open={panel === "account"} onClose={close} title="Your account">
        <div className="account-content">
          <UserRound size={32} strokeWidth={1} />
          <p>Customer accounts are not available in this demo.</p>
          <p className="fine-print">No personal information is collected.</p>
          <button className="button button-dark" onClick={close}>
            Continue shopping <ArrowRight size={17} />
          </button>
        </div>
      </Modal>
      <Modal
        open={panel === "menu"}
        onClose={close}
        title="Explore AURELLE"
        drawer
      >
        <nav className="mobile-links" aria-label="Mobile navigation">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/collections${c === "All jewellery" ? "" : `?category=${c}`}`}
              onClick={close}
            >
              {c}
              <ArrowUpRight size={20} />
            </Link>
          ))}
          <Link href="/#story" onClick={close}>
            Style guide <ArrowUpRight size={20} />
          </Link>
          <Link href="/#lookbook" onClick={close}>
            The lookbook <ArrowUpRight size={20} />
          </Link>
          <Link href="/#final-edit" onClick={close}>
            Our philosophy <ArrowUpRight size={20} />
          </Link>
          <Link href="/#care" onClick={close}>
            Jewellery care <ArrowUpRight size={20} />
          </Link>
        </nav>
      </Modal>
    </>
  );
}
