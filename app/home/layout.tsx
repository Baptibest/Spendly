import PublicNavbar from '@/components/layout/PublicNavbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
}
