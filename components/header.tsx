"use client"
import React from "react"
import Link from "next/link"
import { Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import UserProfile from "./user-profile"

const menuItems = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Verify News", href: "/verify" },
  { name: "AI Analysis", href: "/ai-analysis" },
]

export function Header() {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { user, loading } = useAuth()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && "active"} className="fixed z-20 w-full px-2 group">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled && "bg-white/80 dark:bg-slate-900/80 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-serif font-bold text-slate-800 dark:text-white">fakeverifier</span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                  {!loading && !user && (
                    <>
                      <li>
                        <Link
                          href="/Login"
                          className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 block duration-150"
                        >
                          <span>Sign In</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/Signup"
                          className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 block duration-150"
                        >
                          <span>Sign Up</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {!loading && (
                  <>
                    {user ? (
                      <div className="flex items-center gap-3">
                        <UserProfile />
                        <Button
                          asChild
                          size="sm"
                          className={cn("bg-blue-600 hover:bg-blue-700 text-white", isScrolled ? "lg:inline-flex" : "hidden")}
                        >
                          <Link href="/verify">
                            <span>Verify News</span>
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400",
                            isScrolled && "lg:hidden",
                          )}
                        >
                          <Link href="/Login">
                            <span>Sign In</span>
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className={cn("bg-blue-600 hover:bg-blue-700 text-white", isScrolled && "lg:hidden")}
                        >
                          <Link href="/Signup">
                            <span>Sign Up</span>
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className={cn("bg-blue-600 hover:bg-blue-700 text-white", isScrolled ? "lg:inline-flex" : "hidden")}
                        >
                          <Link href="/verify">
                            <span>Verify News</span>
                          </Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
