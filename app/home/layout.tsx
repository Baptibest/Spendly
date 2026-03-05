import PublicNavbar from '@/components/layout/PublicNavbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-blue-50">
      <PublicNavbar />
      {children}
    </div>
  );
}
