import { useEffect } from 'react';
import { projectId, dataset } from '../lib/sanity';
import { ExternalLink, Database, PlusCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-16 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4 border-b border-stone-800 pb-8">
          <div className="inline-flex items-center gap-2 border border-amber-300/40 bg-stone-900 px-3 py-1 text-xs tracking-widest text-amber-200 uppercase">
            <Database className="w-3.5 h-3.5" />
            <span>Headless CMS Control Panel</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white">Sanity Studio Portal</h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Manage your artwork catalog, upload high-resolution photos, adjust hotspot cropping, update KES/USD prices, and process customer inquiries without touching any code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Local Studio Box */}
          <div className="bg-stone-900/50 p-6 border border-stone-800 rounded space-y-4">
            <h2 className="font-serif text-2xl text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-300" />
              <span>Local Sanity Studio</span>
            </h2>
            <p className="text-stone-400 text-xs leading-relaxed">
              Run Sanity Studio locally on your computer to add, edit, or delete artwork and manage customer inquiries.
            </p>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded font-mono text-xs text-amber-200">
              npx sanity dev
            </div>
            <p className="text-[11px] text-stone-500">
              Starts studio locally at <code className="text-stone-300">http://localhost:3333</code>
            </p>
          </div>

          {/* Hosted Studio Box */}
          <div className="bg-stone-900/50 p-6 border border-stone-800 rounded space-y-4">
            <h2 className="font-serif text-2xl text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-amber-300" />
              <span>Hosted Sanity Management</span>
            </h2>
            <p className="text-stone-400 text-xs leading-relaxed">
              Access your hosted Sanity dashboard online anywhere from your phone or browser.
            </p>
            <a
              href={`https://${projectId || 'manage'}.sanity.studio`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-amber-300 bg-amber-300 px-4 py-2.5 text-xs font-bold text-stone-950 uppercase tracking-widest hover:bg-amber-200 transition"
            >
              <span>Open Sanity Manage</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[11px] text-stone-500">
              Project ID: <span className="font-mono text-stone-300">{projectId || 'Not set (using fallback data)'}</span>
            </p>
          </div>
        </div>

        {/* Schema & Status Breakdown */}
        <div className="bg-stone-900/30 p-8 border border-stone-800 rounded space-y-6">
          <h3 className="font-serif text-2xl text-white">Configured CMS Schemas</h3>

          <div className="space-y-4 text-xs text-stone-300">
            <div className="p-4 bg-stone-950 border border-stone-800 rounded space-y-2">
              <div className="flex items-center justify-between font-mono text-amber-200 font-bold">
                <span>1. Artwork Schema (`artwork`)</span>
                <span className="text-[10px] text-stone-500 font-normal uppercase">Document</span>
              </div>
              <p className="text-stone-400">
                Fields: Title, Slug, Images Array (with hotspot cropping), Medium, Dimensions, Year, Dual Price (KES & USD), Type (Original / Print / Both), Status (Available / Sold / Inquire), Description, Categories, Featured Flag.
              </p>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800 rounded space-y-2">
              <div className="flex items-center justify-between font-mono text-amber-200 font-bold">
                <span>2. Customer Inquiry Schema (`inquiry`)</span>
                <span className="text-[10px] text-stone-500 font-normal uppercase">Document</span>
              </div>
              <p className="text-stone-400">
                Fields: Full Name, Email, Subject, Artwork Slug, Message, Received At Timestamp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
