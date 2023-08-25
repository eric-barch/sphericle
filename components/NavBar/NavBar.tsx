'use client'

import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export default function NavBar() {
  return (
    <NavigationMenu.Root
      className='w-screen sticky top-0 
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
            <NavigationMenu.Link href='/build-quiz'>
              Build Quiz
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href='/sign-in'>
              Sign In
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
