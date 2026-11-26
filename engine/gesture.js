// Studio gestures: tap, drag, and two-finger pinch and slide on a game's canvas, for any game played by touch
// (first built for Sarah's Sim spec 001, Nov 26, 2026: drag and drop is a main control there, the bible's named exception
// to studio-bible/controls.md). Knows nothing about any game. Points are in canvas pixels, not CSS pixels.
//
//   StudioGesture.attach(canvas, {
//     down(p)              a finger went down (before we know if it's a tap or a drag); return true to start a drag at once
//     tap(p)               lifted without moving far
//     dragStart(p0, p)     moved past the slop; p0 is where it went down
//     drag(p)  dragEnd(p)  while dragging, and on lift
//     pinch(g)             two fingers: g = {scale, dx, dy, mid} since the last call (scale > 1 is spreading apart)
//     pinchEnd()
//     cancel()             a drag stopped by a second finger or a cancelled touch
//     wheel(g)             mouse wheel or trackpad on a computer: the same g as pinch
//   })
// attach returns {dragging(), busy()}: whether a drag, or any gesture, is under way.
(function () {
  var SLOP = 4;   // canvas px a finger may wander and still count as a tap

  function attach(cv, o) {
    var pts = {}, mode = null, start = null, last = null, pinchLast = null;
    function local(e) {
      var r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height };
    }
    function two() { var k = Object.keys(pts); return k.length >= 2 ? [pts[k[0]], pts[k[1]]] : null; }
    function pinchState(t) { return { d: Math.hypot(t[0].x - t[1].x, t[0].y - t[1].y) || 1, mx: (t[0].x + t[1].x) / 2, my: (t[0].y + t[1].y) / 2 }; }

    function onDown(e) {
      e.preventDefault();
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      var p = local(e); pts[e.pointerId] = p;
      var t = two();
      if (t) {
        if (mode === 'drag' && o.cancel) o.cancel();
        mode = 'pinch'; pinchLast = pinchState(t); return;
      }
      mode = 'press'; start = p; last = p;
      if (o.down && o.down(p)) { mode = 'drag'; if (o.dragStart) o.dragStart(p, p); }
    }
    function onMove(e) {
      if (!(e.pointerId in pts)) return;
      var p = local(e); pts[e.pointerId] = p;
      if (mode === 'pinch') {
        var t = two(); if (!t) return;
        var s = pinchState(t);
        if (o.pinch) o.pinch({ scale: s.d / pinchLast.d, dx: s.mx - pinchLast.mx, dy: s.my - pinchLast.my, mid: { x: s.mx, y: s.my } });
        pinchLast = s; return;
      }
      if (mode === 'press' && Math.hypot(p.x - start.x, p.y - start.y) > SLOP) { mode = 'drag'; if (o.dragStart) o.dragStart(start, p); }
      if (mode === 'drag' && o.drag) o.drag(p);
      last = p;
    }
    function onUp(e) {
      if (!(e.pointerId in pts)) return;
      var p = local(e); delete pts[e.pointerId];
      if (mode === 'pinch') { if (!two()) { if (Object.keys(pts).length === 0) { mode = null; if (o.pinchEnd) o.pinchEnd(); } else { mode = 'after'; if (o.pinchEnd) o.pinchEnd(); } } return; }
      if (mode === 'after') { if (!Object.keys(pts).length) mode = null; return; }
      if (e.type === 'pointercancel') { if (mode === 'drag' && o.cancel) o.cancel(); mode = null; return; }
      if (mode === 'press' && o.tap) o.tap(p);
      else if (mode === 'drag' && o.dragEnd) o.dragEnd(p);
      mode = null;
    }
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onUp);
    cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    cv.addEventListener('wheel', function (e) {
      e.preventDefault(); var p = local(e);
      var g = e.ctrlKey ? { scale: Math.exp(-e.deltaY / 100), dx: 0, dy: 0, mid: p } : { scale: Math.exp(-e.deltaY / 400), dx: 0, dy: 0, mid: p };
      if (o.wheel) o.wheel(g); else if (o.pinch) { o.pinch(g); if (o.pinchEnd) o.pinchEnd(); }
    }, { passive: false });
    return {
      dragging: function () { return mode === 'drag'; },
      busy: function () { return mode !== null; }
    };
  }

  window.StudioGesture = { attach: attach };
})();
