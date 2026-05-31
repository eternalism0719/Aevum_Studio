# CHANGELOG - AEVUM STUDIO PORTFOLIO

## [v3.6.0] - 2026-05-01
### Added
- **Side System Wobble Animation**: Introduced `side-system-wobble` animation for Photography and AI Video systems. This creates a premium "floating" effect by oscillating `rotateX` and `rotateY` between -10deg and 10deg, ensuring the orbits stay moving without ever becoming invisible (which happened during full 360° rotation).

## [v3.5.9] - 2026-05-01
### Fixed
- **Left/Right Depth Sorting**: Extended the star-clone injection system to include both `.side-star` elements (Photography & AI Video). All three stars now live inside the `planet-2d-overlay` stacking context at `z-index: 15`, so planet depth sort (`z:5` above / `z:25` below) works correctly for all three systems.
- **Per-Star Depth Reference**: Planet nodes now find their nearest star clone's Y position for depth comparison (`getNearestStarY()`), instead of using a single global center Y. This ensures accurate occlusion for off-center side systems.
- **Orbit Disappearing Fix**: Removed `global-spin` (full 360° Y-axis rotation) from `.side-system-container`. Orbits are now fixed tilted ellipses; only planets animate. This prevents the edge-on viewing angle that caused orbits to appear to vanish.
- **Side-Star Ghost**: Set `.side-star` to `opacity: 0` (position ghost). Their visible clones in the overlay provide correct depth with the rest of the 2D system.

## [v3.5.8] - 2026-05-01
### Fixed
- **Central Planet Content**: Fixed the missing labels and animations (like "Logo Animation") for central orbits. The sync logic now performs a deep clone of all ghost node children, ensuring that labels, spheres, and custom animations are rendered in the 2D overlay.
- **Interaction**: Enabled `pointer-events: auto` on 2D overlay nodes to maintain hover reactivity.

## [v3.5.7] - 2026-05-01
### Fixed
- **Text Visibility**: Restored central and side system labels ("End to End", "Photography", etc.) by lowering the 2D overlay layer's `z-index` and explicitly raising label `z-index` to `30`.
- **Side Orbit Styling**: Updated side orbital rings to `2px solid` with a subtle glow, providing a more tangible "thickness" as requested, while maintaining the 3D integrity.

## [v3.5.6] - 2026-05-01
### Fixed
- **Planet Geometric Integrity**: Resolved the 3D perspective ellipse issue by implementing a "Ghost Sync" system. The 3D nodes now serve only as position trackers (`opacity: 0`), while a new 2D Overlay Layer renders perfect circles synced via `requestAnimationFrame` and `getBoundingClientRect()`.
- **Visuals**: All orbital rings thickened to `2.5px` dashed lines for enhanced technical clarity.

## [v3.5.5] - 2026-05-01
### Fixed
- **Planet Geometry**: Implemented mathematical scale-compensation on side planets to eliminate 3D perspective squashing. By countering the `rotateX` and `rotateY` tilt with inverse `scaleX/Y` factors, the planets now render as perfect circles regardless of their position on the orbit.
- **Orbit Styling**: Increased all orbital ring border widths to `2px` for a bolder, more technical look.

## [v3.5.4] - 2026-05-01
### Changed
- **Orbit Visibility**: Increased the opacity and brightness of all orbital rings (central and side systems) for better visibility against the dark background.
- **Planet Aesthetics**: Updated Photography and AI Video side planets to be solid glowing spheres (`background: currentColor`), matching the core system's high-energy visual style while maintaining their distinct color identities.

## [v3.5.3] - 2026-04-30
### Changed
- **Central Core Update**: Replaced the "Infinity" icon with the official `PJ_LOGO_matte.png`, featuring a custom cyan glow effect.
- **Side Systems Upgrade**: Transplanted the pulsing ring effect to the side stars (Photography, AI Video).
- **Orbit Systems**: Redesigned the side systems by replacing identical Dyson rings with unique, dynamic 3D orbital rings featuring glowing planet nodes.
- **Layout Enhancements**: Applied UI/UX Pro Max guidelines to improve spatial distribution and neon visual hierarchy.

## [v3.5.2] - 2026-04-30
### Changed
- **AI Video Icon Update**: Replaced the `smart_display` icon with a `smart_toy` (robot) icon to better represent AI technology.
- **Node Aesthetic Overhaul**: Converted the "diamond" (rhombus) nodes into glowing circular orbital nodes.
- **Improved 3D Readability**: Implemented a counter-rotation animation (`side-star-counter`) on the nodes to ensure icons remain upright and facing the camera while the 3D system rotates.

## [v3.5.1] - 2026-04-30
### Fixed
- **Map Visual Cleanup**: Removed the dashed connecting lines (`connecting-line`) between the Photography/AI Video systems and the central core in the 3D Interstellar Map to reduce visual clutter.


## [v3.5.0] - 2026-04-27
### Changed
- **Native 3D Interstellar Map**: Replaced the Spline 3D viewer embed with a fully native CSS 3D implementation. Recreated the exact atom-like orbit structure (End to End) and rotating wireframe outer systems (Photography, AI Video) using purely CSS `transform-style: preserve-3d` and keyframe animations to perfectly match the site's neon aesthetic.

## [v3.4.0] - 2026-04-27 [LATEST STABLE]
### Added
- **Integrated Security HUD**: Replaced the floating architect card with a responsive glass panel featuring a hover-triggered scan line effect.
- **Precision Grid Alignment**: Implemented `items-start` on the main content grid to prevent vertical stretching and ensure cross-column panel synchronization.

### Changed
- **Arsenal Accordion Refinement**:
    - **Aesthetic Overhaul**: Implemented a "stencil" look with high-saturation black text on brand-colored neon tabs (+15% font size boost).
    - **Content Update**: Updated specialized skillsets for Blender (Material/Lighting), AE (Visual Effects), and renamed Photoshop to Photographer (Photo Color Grading).
- **Layout Optimization**: Removed legacy hardcoded `min-height` constraints on glass panels, allowing them to collapse perfectly to fit their content.

### Fixed
- **Arsenal Collapsing Bug**: Resolved the issue where the entire folder stack would shrink when the mouse entered the container padding, using the CSS `:has()` selector for precise hover targeting.

## [v3.3.2] - 2026-04-23
### Added
- **Global Gravity Interaction**: Rewrote `galaxy.js` event listeners to use `window` scope, ensuring background attraction works through all content layers.

### Fixed
- **Visual Wholeness**: Removed the global semi-opaque backdrop from content sections to reveal the full starfield.
- **Localized Glassmorphism**: Applied `blur(8px)` and `rgba(8, 8, 10, 0.25)` background directly to individual content panels for a more premium, floating effect.

## [v3.3.0] - 2026-04-23
### Added
- **Aevum Elapsed Timer**: Implemented a system runtime counter starting from `00:00:00` upon site entry.
- **HUD Spatial Optimization**: Increased vertical gap between world clocks (gap-6 to gap-10) for better legibility.

### Fixed
- **Cinematic Snap Offset (Refined)**: Increased jump offset to 120px to ensure panels are not flush with the top, providing better breathing room.
- **Neural Schematic Overlap**: Increased section padding (py-48) and top margin (mt-20) to prevent content collisions.
- **Script Consolidation**: Removed redundant legacy scripts and centralized all navigation/HUD logic into a single module-based script.

## [v3.2.0] - 2026-04-23
### Added
- **HUD World Time Interface**: Real-time clocks for 8 global cities (TPE, TYO, LON, NYC, etc.) integrated into the brand page Hero section.
- **Atmospheric Starfield Continuation**: Starfield background now remains visible throughout the entire page by reducing content backdrop opacity to 0.4.
- **Latency HUD**: Added decorative HUD elements for system latency and sync status.

### Fixed
- **Scroll-Snap Offset**: Added header compensation (-60px) to the cinematic scroll jump to prevent content clipping.
- **Layout Density**: Reduced vertical padding (py-24 to py-12) and panel padding to ensure more content is visible immediately after scrolling.
- **Visual Center Balance**: Fine-tuned Hero title position with `-8vh` offset for better visual weight.

## [v3.1.0] - 2026-04-23
### Added
- **High-Intensity Gravitational Lens**: Custom cursor with `brightness(2.2)` and `contrast(1.4)` backdrop filters.
- **Cinematic Snap Scroll**: Automatic smooth jump from Hero to About section.
- **Galaxy Engine V3**: Native WebGL implementation with optimized density (1.2) and interaction strength (1.2).

### Changed
- **Content Container Strategy**: Implemented `max-w-1200px` constraints to prevent edge-to-edge layout issues.
- **Inverted Backdrop Strategy**: Dark background only applies below the hero to keep the starfield pure.

## [v3.0.0] - 2026-04-22
### Initial Migration
- Ported WebGL Galaxy engine from React to Vanilla JS.
- Refactored `brand.html` to follow UIUXPROMAX design standards.
