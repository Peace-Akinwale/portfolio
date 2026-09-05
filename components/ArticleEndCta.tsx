import { Button, Pill } from '@/components/ui';
import { AVAILABILITY } from '@/lib/content/clients';

interface ArticleEndCtaProps {
  title?: string;
}

/** The ask at the end of an article. Hairline, not a box. */
export function ArticleEndCta({
  title = 'Need product-led content that helps readers choose your product?',
}: ArticleEndCtaProps) {
  return (
    <aside className="mt-12 border-t border-border pt-10">
      <Pill className="mb-6">{AVAILABILITY}</Pill>
      <h2 className="t-h2 max-w-[24ch] text-foreground">{title}</h2>
      <p className="mt-4 max-w-[58ch] text-muted-foreground">
        I write and refresh B2B SaaS articles that explain your product clearly, meet search intent, and give readers a
        real reason to convert.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/services">See services</Button>
        <Button href="/contact" variant="outline">
          Book a call
        </Button>
      </div>
    </aside>
  );
}
