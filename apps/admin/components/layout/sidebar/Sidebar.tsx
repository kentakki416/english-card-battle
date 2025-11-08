'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'

import { cn } from '@/lib/utils'

import MenuItem from './MenuItem'
import { useSidebarContext } from './SidebarProvider'
import { SIDEBAR_DATA } from '../../../constants/sidebar'
import ArrowLeftIcon from '../../icons/ArrowLeftIcon'
import ChevronUpIcon from '../../icons/ChevronUpIcon'
import LogoIcon from '../../icons/LogoIcon'


const Sidebar = () => {
  const pathname = usePathname()
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext()
  const [ expandedItems, setExpandedItems ] = useState<string[]>([])

  const toggleExpanded = useCallback((title: string) => {
    setExpandedItems((prev) => prev.includes(title) ? []: [title])
  }, [])

  useEffect(() => {
    SIDEBAR_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title)
            }
            
            return true
          }
          return false
        })
      })
    })
  }, [pathname, expandedItems, toggleExpanded])
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        aria-hidden={!isOpen}
        aria-label="Main navigation"
        className={cn(
          'max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-width duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark',
          isMobile ? 'fixed inset-y-0 z-50' : 'sticky top-0 h-screen',
          isOpen ? 'w-full' : 'w-0',
        )}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              className="px-0 py-2.5 min-[850px]:py-0"
              href={'/'}
              onClick={() => isMobile && toggleSidebar()}
            >
              <LogoIcon />
            </Link>

            {isMobile && (
              <button
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {SIDEBAR_DATA.map((section) => (
              <div className="mb-6" key={section.label}>
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>

                <nav aria-label={section.label} role="navigation">
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />

                              <span>{item.title}</span>

                              <ChevronUpIcon
                                aria-hidden="true"
                                className={cn(
                                  'ml-auto rotate-180 transition-transform duration-200',
                                  expandedItems.includes(item.title) &&
                                    'rotate-0',
                                )}
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          (() => {
                            const href =
                              'url' in item
                                ? item.url + ''
                                : '/' +
                                  item.title.toLowerCase().split(' ').join('-')

                            return (
                              <MenuItem
                                as="link"
                                className="flex items-center gap-3 py-3"
                                href={href}
                                isActive={pathname === href}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className="size-6 shrink-0"
                                />

                                <span>{item.title}</span>
                              </MenuItem>
                            )
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
