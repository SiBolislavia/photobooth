System Architecture & Security Audit

Technical Architecture Overview

The system operates on a Client-Side Processing First paradigm. The Next.js server serves static assets and client component logic, while all heavy image processing and media manipulation execute inside the client browser.

       +-------------------------------------------------------+
       |                  User Browser (Client)                |
       |                                                       |
       |  +------------------+         +--------------------+  |
       |  | MediaDevices API |         | Framer Motion UI   |  |
       |  +--------+---------+         +---------+----------+  |
       |           |                             |             |
       |           v                             v             |
       |  +------------------+         +--------------------+  |
       |  |  Live Camera     |         | Frame Selector     |  |
       |  |  (CSS Mirrored)  |         | & State Engine     |  |
       |  +--------+---------+         +---------+----------+  |
       |           |                             |             |
       |           +--------------+--------------+             |
       |                          |                            |
       |                          v                            |
       |             +--------------------------+              |
       |             | HTML5 2D Canvas Engine   |              |
       |             | (Non-Mirrored Layering)  |              |
       |             +------------+-------------+              |
       |                          |                            |
       |            +-------------+-------------+              |
       |            |                           |              |
       |            v                           v              |
       |  +------------------+        +-------------------+    |
       |  | High-Res PNG Blob|        | Native Print Window|    |
       |  +------------------+        +-------------------+    |
       +-------------------------------------------------------+


Security Audit & Vulnerability Assessment

The following security risks were identified in the proposed photobooth stack, along with their engineering remediations:

Vulnerability 1: Stored / DOM XSS via Unsanitized SVG Frames

Threat Vector: If custom frame overlays are loaded as SVG strings or external SVG files, malicious scripts Embedded within <script> tags or inline onload handlers inside the SVG XML can execute within the user session.

Risk Rating: High

Remediation:

Render frame overlays exclusively via standard <img> tags or rasterized PNG assets.

If inline SVG elements are necessary, parse them using DOMPurify before DOM injection.

Vulnerability 2: Memory Leak & Denial of Service (DoS) via Canvas Blobs

Threat Vector: Generating multiple high-resolution Canvas snapshots creates large Blob objects and Object URLs in browser memory. Unreleased object URLs cause progressive memory accumulation, crashing mobile browser tabs.

Risk Rating: Medium-High

Remediation:

Enforce explicit invocation of URL.revokeObjectURL(blobUrl) whenever a photo session