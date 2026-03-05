import PublicNavbar from '@/components/layout/PublicNavbar';

export default function AboutLayout({
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
