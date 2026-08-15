# Fine Art Portfolio & Print Store (Sanity CMS + IntaSend Payments + Vercel)

A full-featured, editorial single-page-application (SPA) art portfolio and online store built with **Vite, React 19, TypeScript, Tailwind CSS v4, Framer Motion**, **Sanity.io Headless CMS**, and **IntaSend Payment Gateway** (supporting M-Pesa, Visa, and Mastercard payouts in Kenya).

---

## Features Overview

- **Sanity Headless CMS**: Full artwork management (`artwork` & `inquiry` schemas) with hotspot image cropping, medium, dimensions, year, dual currency pricing (KES & USD), artwork type (`original` / `print` / `both`), and availability status (`available` / `sold` / `inquire`).
- **Dynamic SPA Routing (`react-router-dom`)**:
  - `Home` (`/`): High-impact editorial hero banner, featured artworks grid, artist statement teaser.
  - `Gallery` (`/gallery`): Full archive with medium tags and availability status filters (`Available Original`, `Prints Available`, `Sold Archive`).
  - `ArtworkDetail` (`/artwork/:slug`): Zoomable high-res image lightbox, dual pricing (KES / USD), artwork specifications, and checkout action buttons.
  - `About` (`/about`): Comprehensive biography, studio philosophy, exhibitions, collections.
  - `Contact` (`/contact`): Inquiry form for private collector reservations and commissions.
  - `Studio` (`/studio`): Embedded CMS management portal.
- **IntaSend Checkout & Webhooks**:
  - Integrated via Vercel Serverless Functions (`/api/checkout` and `/api/webhook`).
  - Supports M-Pesa, Visa, and Mastercard.
  - Automatically patches artwork status to **"sold"** in Sanity when an original piece is purchased via IntaSend.
- **Social Media Optimization (Open Graph)**:
  - Dynamic `og:image`, `og:title`, and `og:description` meta tags on artwork pages via `react-helmet-async` for Instagram link-in-bio traffic.

---

## Project Organization

```text
ROSE_art/
├── api/                   # Vercel Serverless Functions
│   ├── checkout.ts        # IntaSend payment session creation
│   ├── webhook.ts         # IntaSend payment completion handler (updates Sanity status)
│   └── inquiry.ts         # Contact form submission to Sanity
├── schemas/               # Sanity CMS Document Schemas
│   ├── artwork.ts         # Artwork schema (images with hotspot, prices, status, etc.)
│   ├── inquiry.ts         # Customer inquiry schema
│   └── index.ts
├── src/
│   ├── components/        # React UI components
│   │   ├── Navbar.tsx     # Editorial header navigation with mobile drawer
│   │   ├── Footer.tsx     # Studio footer & links
│   │   └── ImageZoomModal.tsx # Lightbox high-res image zoom
│   ├── pages/             # Route pages
│   │   ├── Home.tsx
│   │   ├── Gallery.tsx
│   │   ├── ArtworkDetail.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── StudioPage.tsx
│   ├── lib/
│   │   └── sanity.ts      # Sanity client & fallback dataset
│   ├── types/
│   │   └── artwork.ts     # TypeScript interfaces
│   ├── App.tsx            # Main router component
│   └── main.tsx
├── sanity.config.ts       # Local Sanity Studio configuration
├── vercel.json            # Vercel SPA rewrites & serverless function config
├── .env.example           # Environment variables template
└── README.md
```

---

## 1. Local Development Setup

### Install Dependencies & Start Dev Server
```bash
npm install
npm run dev
```

The application will run locally at `http://localhost:5173`. Out of the box, it includes a fallback dataset of artwork items so you can test all pages and features immediately without configuring Sanity credentials first.

---

## 2. Setting Up Sanity Headless CMS

1. **Create a Sanity Account & Project**:
   - Go to [sanity.io](https://www.sanity.io) and create a free account.
   - Install Sanity CLI globally (or use `npx`):
     ```bash
     npx sanity init
     ```
   - Copy your **Project ID** and **Dataset Name** (default: `production`).

2. **Configure Local Environment**:
   - Create a `.env` file in the root of your project:
     ```env
     VITE_SANITY_PROJECT_ID=your_project_id_here
     VITE_SANITY_DATASET=production
     SANITY_WRITE_TOKEN=your_sanity_write_token_here
     ```

3. **Run Sanity Studio Locally**:
   ```bash
   npx sanity dev
   ```
   This will launch the Sanity Studio interface at `http://localhost:3333`.

4. **Sanity Write Token (For Automated Webhook Status Updates)**:
   - Go to [sanity.io/manage](https://www.sanity.io/manage) -> Select your project -> **API** -> **Tokens**.
   - Click **Add API Token**, choose **Editor (Read + Write)** permissions, and paste the token as `SANITY_WRITE_TOKEN` in your environment variables.

---

## 3. Setting Up IntaSend Payments (Kenya: M-Pesa & Card)

1. **Create an IntaSend Account**:
   - Sign up at [intasend.com](https://intasend.com).

2. **Obtain API Keys**:
   - Go to **Settings** -> **API Keys**.
   - Copy your **Publishable Key** (`ISPubKey_...`) and **Secret Key** (`ISSecKey_...`).

3. **Add Environment Variables**:
   ```env
   INTASEND_PUBLISHABLE_KEY=ISPubKey_...
   INTASEND_SECRET_KEY=ISSecKey_...
   INTASEND_IS_TEST=false   # Set to true during sandbox testing
   ```

4. **Configure IntaSend Webhook URL**:
   - In your IntaSend Dashboard, go to **Settings** -> **Webhooks / API Notifications**.
   - Set the Webhook URL to: `https://your-domain.com/api/webhook`.
   - Select **Payment Completion** events.

---

## 4. Deploying to Vercel

1. **Push your code to GitHub / GitLab / Bitbucket**.
2. **Import Project to Vercel**:
   - Log in to [vercel.com](https://vercel.com) and click **Add New Project**.
   - Select your repository.
   - Framework Preset: **Vite**.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.

3. **Set Environment Variables on Vercel**:
   In Vercel Project Settings -> **Environment Variables**, add:
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET`
   - `SANITY_WRITE_TOKEN`
   - `INTASEND_PUBLISHABLE_KEY`
   - `INTASEND_SECRET_KEY`
   - `INTASEND_IS_TEST` (`false` for live payouts)

4. **Deploy**:
   Click **Deploy**. Vercel will automatically build the React Vite application and bundle the serverless functions under `/api/checkout`, `/api/webhook`, and `/api/inquiry`.

---

## 5. Connecting a Custom Domain

1. In your Vercel Dashboard, go to **Project Settings** -> **Domains**.
2. Enter your custom domain name (e.g., `aureliakane.art` or `www.aureliakane.art`).
3. Update your DNS settings at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
   - **A Record**: Point `@` to `76.76.21.21`.
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com`.
4. SSL certificates will automatically generate within a few minutes.

---

## 6. How to Add & Manage Artwork Going Forward

To publish new artworks:
1. Open your Sanity Studio (`npx sanity dev` or through your hosted Sanity Studio).
2. Click **Artwork** -> **Create New Artwork**.
3. Fill in the fields:
   - **Title**: Artwork name (slug automatically generates).
   - **Images**: Upload high-resolution artwork photos. Click **Edit Hotspot** on images to set focus points for mobile cropping.
   - **Medium & Dimensions**: e.g., *Acrylic and charcoal on linen*, *48 x 60 in (122 x 152 cm)*.
   - **Year**: e.g., *2026*.
   - **Pricing**: Enter prices in **KES** and **USD**.
   - **Artwork Type**: Select `Original Painting`, `Print Available`, or `Original & Prints Available`.
   - **Availability Status**:
     - `Available for Purchase`: Shows "Buy Original" / "Buy Print" buttons.
     - `Sold / Collected`: Displays "Sold Archive" badge and print order option if prints are enabled.
     - `Inquire Only`: Displays "Inquire / Reserve" button.
   - **Featured**: Check to highlight on the homepage.
4. Click **Publish**. The website will update dynamically.

---

## 7. Replacing Placeholder Content

Search the codebase for `TODO:` comments to quickly locate and substitute placeholder bio details, photos, and studio links:
- `src/pages/Home.tsx`: Hero artwork background image, artist tagline.
- `src/pages/About.tsx`: Artist bio statement, studio photograph, exhibition list, public collections.
- `src/pages/Contact.tsx`: Studio email address, telephone/WhatsApp number, physical studio address.
- `src/components/Footer.tsx`: Social media handles (Instagram, etc.).

---

## Verification

To verify local build validity:
```bash
npm run build
```
This runs TypeScript type checking and Vite bundle compilation cleanly.
