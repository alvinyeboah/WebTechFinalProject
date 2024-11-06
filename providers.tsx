import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from "@/context/SessionContext"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}