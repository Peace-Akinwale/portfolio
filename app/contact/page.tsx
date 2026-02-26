import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Peace Akinwale',
  description: 'Get in touch with Peace Akinwale for writing projects and collaborations.',
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="mb-16 text-center">
        <h1 className="font-sans text-5xl md:text-6xl font-bold mb-6">
          Let's Connect
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Fill out the form below or schedule a call.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Google Form */}
        <div className="border border-border p-8">
          <h2 className="font-sans text-2xl font-bold mb-4">
            Send a Message
          </h2>
          <p className="text-muted-foreground mb-6">
            Fill out this quick form and I'll get back to you within 24 hours.
          </p>
          <div className="aspect-[3/4] overflow-hidden bg-muted rounded-lg">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfUAsvlNAM-DVF8wzfH18vL8PBki8U2AuLk29NPkusQW8Y2aw/viewform?embedded=true"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="w-full h-full"
            >
              Loading…
            </iframe>
          </div>
        </div>

        {/* Calendly */}
        <div className="border border-border p-8">
          <h2 className="font-sans text-2xl font-bold mb-4">
            Schedule a Call
          </h2>
          <p className="text-muted-foreground mb-6">
            Prefer to talk? Book a 30-minute call and let's discuss your project.
          </p>
          <div className="aspect-[3/4] overflow-hidden bg-muted">
            <iframe
              src="https://calendly.com/akindayopeaceakinwale/30min?embed_domain=peaceakinwale.com&embed_type=Inline"
              width="100%"
              height="100%"
              frameBorder="0"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Additional Contact Info */}
      <div className="mt-16 pt-12 border-t border-border text-center">
        <h3 className="font-sans text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Or reach out directly
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg">
          <p className="text-muted-foreground">
            Send me an{' '}
            <a
              href="mailto:akindayopeaceakinwale@gmail.com"
              className="text-foreground underline hover:text-accent transition-colors font-semibold"
            >
              email
            </a>
          </p>
          <span className="hidden md:inline text-muted-foreground">•</span>
          <div className="flex gap-4">
            <a
              href="https://x.com/PeaceAkinwaleA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors"
            >
              X (Twitter)
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="https://linkedin.com/in/peaceakinwale"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="https://github.com/Peace-Akinwale"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
