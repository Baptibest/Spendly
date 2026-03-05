import PublicNavbar from '@/components/layout/PublicNavbar';

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
}
