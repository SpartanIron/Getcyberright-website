export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="h-16 bg-muted/30" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 bg-muted/30 rounded w-2/3 mb-6" />
        <div className="h-5 bg-muted/20 rounded w-full mb-3" />
        <div className="h-5 bg-muted/20 rounded w-5/6 mb-3" />
        <div className="h-5 bg-muted/20 rounded w-4/6 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-muted/20 rounded-lg" />
          <div className="h-48 bg-muted/20 rounded-lg" />
          <div className="h-48 bg-muted/20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
