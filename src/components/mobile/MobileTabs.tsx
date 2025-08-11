import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/store/hooks/use-mobile'

interface MobileTabsProps {
  tabs: {
    id: string
    label: string
    content: ReactNode
    icon?: ReactNode
  }[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function MobileTabs({ tabs, activeTab, onTabChange, className }: MobileTabsProps) {
  const isMobile = useIsMobile()

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Tab Headers */}
      <div className={cn(
        "flex bg-glass border-b border-white/10",
        isMobile ? "sticky top-0 z-40" : ""
      )}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 p-4 text-center font-medium transition-colors flex items-center justify-center gap-2",
              activeTab === tab.id
                ? "text-neon-blue border-b-2 border-neon-blue"
                : "text-white/60 hover:text-white/80"
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span className={cn(isMobile ? "text-sm" : "text-base")}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "h-full",
              activeTab === tab.id ? "block animate-fade-in" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}