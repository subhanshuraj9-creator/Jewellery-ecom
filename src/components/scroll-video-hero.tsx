"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FILM_FPS, videoFrameTime } from "@/lib/video-scrub";

type FilmState = "loading" | "ready" | "buffering" | "still" | "error";
const poster = "/video/aurelle-film-poster.webp";

export function ScrollVideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<FilmState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    let disposed = false;
    let cleanup = () => {};
    // This is the only GSAP timeline: the approved photographic hero is independent.
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        const mobile = window.matchMedia("(max-width: 760px)");
        const connection = (
          navigator as Navigator & {
            connection?: { saveData?: boolean };
          }
        ).connection;
        let metadata = false;
        let enabled = !reduced.matches && !connection?.saveData;
        let visible = true;
        let inFlight = false;
        let duration = 0;
        let frame = 0;
        let throttle = 0;
        let watchdog = 0;
        let metadataWatchdog = 0;
        let lastWrite = -Infinity;
        let seekStarted = 0;
        let slowSeeks = 0;
        const playhead = { progress: 0 };
        const report = (next: FilmState) => {
          if (!disposed) setStatus(next);
        };
        const cancelPending = () => {
          cancelAnimationFrame(frame);
          window.clearTimeout(throttle);
          window.clearTimeout(watchdog);
          window.clearTimeout(metadataWatchdog);
          frame = 0;
          throttle = 0;
        };
        const fallback = (next: "still" | "error") => {
          enabled = false;
          inFlight = false;
          cancelPending();
          video.pause();
          video.removeAttribute("src");
          video.load();
          report(next);
        };
        function schedule() {
          if (
            !enabled ||
            !metadata ||
            disposed ||
            document.hidden ||
            !visible ||
            inFlight ||
            frame ||
            throttle
          )
            return;
          frame = requestAnimationFrame(flush);
        }
        const flush = (now: number) => {
          frame = 0;
          if (!enabled || document.hidden || !visible || inFlight) return;
          const target = videoFrameTime(playhead.progress, duration);
          if (Math.abs(video.currentTime - target) < 0.5 / FILM_FPS) return;
          const wait = 1000 / FILM_FPS - (now - lastWrite);
          if (wait > 0) {
            throttle = window.setTimeout(() => {
              throttle = 0;
              schedule();
            }, wait);
            return;
          }
          try {
            inFlight = true;
            seekStarted = now;
            lastWrite = now;
            video.currentTime = target;
            watchdog = window.setTimeout(() => {
              // A suspended tab cannot meaningfully finish decoding a frame.
              if (!document.hidden && visible) fallback("still");
            }, 8000);
          } catch {
            fallback("error");
          }
        };
        const onMetadata = () => {
          if (!enabled) return;
          if (!Number.isFinite(video.duration) || video.duration <= 0) {
            fallback("error");
            return;
          }
          window.clearTimeout(metadataWatchdog);
          duration = video.duration;
          metadata = true;
          schedule();
        };
        const onFrame = () => {
          if (!enabled) return;
          report("ready");
          schedule();
        };
        const onSeeked = () => {
          if (!enabled) return;
          window.clearTimeout(watchdog);
          inFlight = false;
          if (mobile.matches && !document.hidden && visible) {
            slowSeeks =
              performance.now() - seekStarted > 450 ? slowSeeks + 1 : 0;
            if (slowSeeks >= 5) {
              fallback("still");
              return;
            }
          }
          onFrame();
        };
        const onWaiting = () => {
          if (enabled) report("buffering");
        };
        const onError = () => {
          if (enabled) fallback("error");
        };
        const stopPlayback = () => video.pause();
        const onVisibility = () => {
          if (!document.hidden && enabled) {
            // A seek completed while hidden may not have delivered its event yet.
            if (!video.seeking) inFlight = false;
            else {
              window.clearTimeout(watchdog);
              watchdog = window.setTimeout(() => fallback("still"), 8000);
            }
            if (!metadata) {
              window.clearTimeout(metadataWatchdog);
              metadataWatchdog = window.setTimeout(
                () => fallback("error"),
                20000,
              );
            }
            schedule();
          }
        };
        const loadSource = () => {
          if (!enabled) return;
          cancelPending();
          metadata = false;
          inFlight = false;
          report("loading");
          video.muted = true;
          video.preload = "auto";
          video.src = mobile.matches
            ? "/video/aurelle-film-mobile.mp4"
            : "/video/aurelle-film-desktop.mp4";
          video.load();
          metadataWatchdog = window.setTimeout(() => {
            if (!document.hidden) fallback("error");
          }, 20000);
        };
        video.addEventListener("loadedmetadata", onMetadata);
        video.addEventListener("loadeddata", onFrame);
        video.addEventListener("canplay", onFrame);
        video.addEventListener("seeked", onSeeked);
        video.addEventListener("waiting", onWaiting);
        video.addEventListener("error", onError);
        video.addEventListener("play", stopPlayback);
        document.addEventListener("visibilitychange", onVisibility);
        mobile.addEventListener("change", loadSource);
        const onReduced = () => {
          // Changing OS preferences takes effect immediately, without a reload.
          if (reduced.matches) fallback("still");
          else {
            enabled = !connection?.saveData;
            loadSource();
          }
          ScrollTrigger.refresh();
        };
        reduced.addEventListener("change", onReduced);
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) schedule();
        });
        observer.observe(section);
        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.25,
              invalidateOnRefresh: true,
            },
          });
          timeline.to(
            playhead,
            {
              progress: 1,
              duration: 1,
              ease: "none",
              onUpdate: () => {
                section.style.setProperty(
                  "--film-progress",
                  String(playhead.progress),
                );
                section.dataset.filmProgress = playhead.progress.toFixed(3);
                schedule();
              },
            },
            0,
          );
          timeline.to(
            ".film-copy-intro",
            { autoAlpha: 0, y: -20, duration: 0.12 },
            0.2,
          );
          timeline.fromTo(
            ".film-copy-middle",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.09 },
            0.35,
          );
          timeline.to(
            ".film-copy-middle",
            { autoAlpha: 0, y: -16, duration: 0.09 },
            0.59,
          );
          timeline.fromTo(
            ".film-copy-final",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.12 },
            0.7,
          );
        }, section);
        if (enabled) loadSource();
        else report("still");
        cleanup = () => {
          enabled = false;
          cancelPending();
          context.revert();
          observer.disconnect();
          mobile.removeEventListener("change", loadSource);
          reduced.removeEventListener("change", onReduced);
          document.removeEventListener("visibilitychange", onVisibility);
          video.removeEventListener("loadedmetadata", onMetadata);
          video.removeEventListener("loadeddata", onFrame);
          video.removeEventListener("canplay", onFrame);
          video.removeEventListener("seeked", onSeeked);
          video.removeEventListener("waiting", onWaiting);
          video.removeEventListener("error", onError);
          video.removeEventListener("play", stopPlayback);
          video.pause();
          video.removeAttribute("src");
          video.load();
          section.style.removeProperty("--film-progress");
        };
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [attempt]);

  return (
    <section
      ref={sectionRef}
      id="film"
      className="scroll-film"
      data-video-state={status}
      aria-labelledby="film-title"
    >
      <noscript>
        <style>{`.scroll-film{height:auto!important}.film-stage{position:relative!important}`}</style>
      </noscript>
      <div className="film-stage">
        <div className="film-visual">
          <Image
            src={poster}
            alt="Close-up of a gold chain necklace in warm studio light, from the supplied AURELLE film"
            fill
            priority
            sizes="100vw"
            className="film-poster"
          />
          <video
            ref={videoRef}
            width={1280}
            height={720}
            muted
            playsInline
            preload="none"
            poster={poster}
            aria-hidden="true"
            disablePictureInPicture
            tabIndex={-1}
          />
        </div>
        <div className="film-shade" aria-hidden="true" />
        <div className="film-masthead">
          <span>AURELLE</span>
        </div>
        <div className="film-copy film-copy-intro">
          <h2 id="film-title">
            Light, made
            <br />
            <em>tangible.</em>
          </h2>
          <p>Sculptural gold. A closer look.</p>
          <Link href="/collections" className="film-link">
            Explore the collection <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="film-copy film-copy-middle">
          <p className="film-statement">
            Every angle,
            <br />a new expression.
          </p>
        </div>
        <div className="film-copy film-copy-final">
          <p className="film-statement">Wear the moment.</p>
          <Link href="#film-edit" className="film-link">
            Discover the pieces <ArrowDown size={16} />
          </Link>
        </div>
        <div className="film-bottom">
          <span className="film-scroll">
            <ArrowDown size={16} />
            <span>Scroll to explore</span>
          </span>
          <div className="film-status" role="status">
            {status === "loading"
              ? "Preparing the film"
              : status === "buffering"
                ? "Preparing the next frame"
                : status === "still"
                  ? "Still image edition"
                  : status === "error"
                    ? "Film unavailable · Still image"
                    : "Scroll down or back to move through the film"}
            {status === "error" && (
              <button
                onClick={() => setAttempt((value) => value + 1)}
                aria-label="Retry loading the film"
              >
                <RotateCcw size={13} /> Retry
              </button>
            )}
          </div>
        </div>
        <div className="film-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
