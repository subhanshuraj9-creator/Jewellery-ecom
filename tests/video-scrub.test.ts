import assert from "node:assert/strict";
import test from "node:test";
import { FILM_FPS, videoFrameTime } from "../src/lib/video-scrub.ts";

test("waits for finite metadata and clamps seeks to displayable frames", () => {
  for (const duration of [0, -1, NaN, Infinity]) {
    assert.equal(videoFrameTime(0.7, duration), 0);
  }
  assert.equal(videoFrameTime(-0.5, 10), 0);
  assert.equal(videoFrameTime(NaN, 10), 0);
  assert.equal(videoFrameTime(2, 10), 239 / FILM_FPS);
  assert.ok(videoFrameTime(1, 9.99) < 9.99);
});

test("forward and reverse positions resolve to identical source frames", () => {
  const positions = [0, 0.12, 0.37, 0.56, 0.81, 1];
  const forward = positions.map((progress) => videoFrameTime(progress, 10));
  const reverse = [...positions]
    .reverse()
    .map((progress) => videoFrameTime(progress, 10));
  assert.deepEqual(reverse, [...forward].reverse());
  for (let index = 1; index < forward.length; index++) {
    assert.ok(forward[index] > forward[index - 1]);
  }
});
