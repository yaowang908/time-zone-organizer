import Homepage from '@/pages/Homepage.component';

export default function Home() {
  const args = {
    users: [
      {
        id: 0,
        name: 'You',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    ],
    elementWidth: 75,
  };
  return (
    <main>
      <Homepage {...args} />
    </main>
  );
} 