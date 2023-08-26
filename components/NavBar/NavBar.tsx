'use client'

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

export default function NavBar() {
  return (
    <NavigationMenu.Root
      className='w-screen sticky top-0 z-10
                 flex flex-row justify-between
               bg-gray-900'
      orientation='horizontal'>
      <NavigationMenu.List className='w-screen 
                                      p-3 flex flex-row justify-between'>
        <NavigationMenu.Item>
          <NavigationMenu.Link href='/'>
            globle
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <div className='flex flex-row space-x-3'>
          <NavigationMenu.Item>
            <Link href='/build'>Build</Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <Link href='/learn'>Learn</Link>
          </NavigationMenu.Item>
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
