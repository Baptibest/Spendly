import PublicNavbar from '@/components/layout/PublicNavbar';

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-blue-100">
      <PublicNavbar />
      {children}
    </div>
  );
}
