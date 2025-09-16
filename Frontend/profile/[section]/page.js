import Profile from '../components/Profile';
// Export generateStaticParams for static site generation
export async function generateStaticParams() {
  return [
    { section: 'name' },
    { section: 'email' },
    { section: 'other' },
  ];
}

// Server Component to render the Profile Client Component
export default function ProfilePage({ params }) {
  const { section } = params;

  return <Profile section={section} />;
}