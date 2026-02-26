import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-sans font-bold text-lg mb-3">Peace Akinwale</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              B2B SaaS writer and strategist.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <nav className="flex flex-col gap-2">
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/portfolio"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <div className="flex flex-col gap-2">
              <a
                href="https://x.com/PeaceAkinwaleA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                X (Twitter)
              </a>
              <a
                href="https://linkedin.com/in/peaceakinwale"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Peace-Akinwale"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
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
