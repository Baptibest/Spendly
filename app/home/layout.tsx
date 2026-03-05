import PublicNavbar from '@/components/layout/PublicNavbar';

export default function HomeLayout({
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
