import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => (
  <section className="relative min-h-screen flex items-center">
    <div className="absolute inset-0 bg-muted" />
    <div className="container relative z-10 mx-auto px-4 py-20">
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  </section>
);

export const ServicesSkeleton = () => (
  <section className="py-20 bg-subtle-gradient">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  </section>
);

export const PortfolioGallerySkeleton = () => (
  <section id="portfolio" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12 space-y-4">
        <Skeleton className="h-12 w-48 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const AboutSkeleton = () => (
  <section className="py-20 bg-subtle-gradient">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <Skeleton className="h-12 w-48 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  </section>
);

export const ContactSkeleton = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <Skeleton className="h-12 w-48 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </section>
);
