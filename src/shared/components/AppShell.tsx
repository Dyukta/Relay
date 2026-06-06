// src/shared/components/AppShell.tsx
import { AppSidebar } from "@/shared/components/AppSidebar"
import { AppHeader } from "@/shared/components/AppHeader"

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AppSidebar />
      <AppHeader />
      <main className="ml-56 pt-14 p-6">{children}</main>
    </div>
  )
}