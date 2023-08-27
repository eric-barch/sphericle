'use client'

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

export default function TopNavigation() {
  return (
    <NavigationMenu.Root className='top-navigation-root' orientation='horizontal'>
      <NavigationMenu.List className='top-navigation-list'>
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
