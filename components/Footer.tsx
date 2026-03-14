import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-3">Peace Akinwale</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              B2B SaaS content writer and strategist.
            </p>
          </div>

          {/* Work */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Work</p>
            <nav className="flex flex-col gap-2">
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
              <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Projects</Link>
            </nav>
          </div>

          {/* Writing */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Writing</p>
            <nav className="flex flex-col gap-2">
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Connect</p>
            <div className="flex flex-col gap-2">
              <a href="https://x.com/PeaceAkinwaleA" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">X (Twitter)</a>
              <a href="https://linkedin.com/in/peaceakinwale" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
              <a href="https://github.com/Peace-Akinwale" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Peace Akinwale. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
