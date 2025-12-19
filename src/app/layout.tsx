import './globals.css'

export const metadata = {
  title: 'Time Zone Organizer',
  description: 'Organize and compare time zones with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
