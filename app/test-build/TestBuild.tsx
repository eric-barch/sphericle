'use client'

import * as Accordion from '@radix-ui/react-accordion';
import { FaCaretDown } from 'react-icons/fa6';

export default function TestBuild() {
  return (
    <Accordion.Root type='multiple'>
      <Accordion.Item value='item-1'>
        <Accordion.Header>
          Trigger
          <Accordion.Trigger>
            <FaCaretDown />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Accordion.Root type='multiple'>
            <Accordion.Item className='ml-8' value='sub-item-1'>
              <Accordion.Header>
                Trigger
                <Accordion.Trigger>
                  <FaCaretDown />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className='ml-8'>
                Foo
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}