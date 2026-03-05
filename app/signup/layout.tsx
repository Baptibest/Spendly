import PublicNavbar from '@/components/layout/PublicNavbar';

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-50">
      <PublicNavbar />
      {children}
    </div>
  );
}
