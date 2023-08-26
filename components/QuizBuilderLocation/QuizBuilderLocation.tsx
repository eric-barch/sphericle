'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { FaFire } from 'react-icons/fa';

export interface QuizBuilderLocationProps {
  node: Node;
  onAddChild: (node: Node) => void;
  onToggleOpen: (node: Node) => void;
}

export interface Node {
  label: string;
  isOpen: boolean;
  children: Node[];
}

export default function QuizBuilderLocation({
  node,
  onAddChild,
  onToggleOpen
}: QuizBuilderLocationProps) {
  const handleToggleOpen = (newValue: string[]) => {
    onToggleOpen(node);
  };

  const handleAddChild = () => {
    onAddChild(node);
  };

  return (
    <Accordion.Root
      type="multiple"
      value={node.isOpen ? ['foo'] : []}
      onValueChange={handleToggleOpen}
    >
      <Accordion.Item value='foo'>
        <Accordion.Header>
          {node.label}
          <Accordion.Trigger>
            <FaFire aria-hidden />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className='ml-8'>
          {node.children.map((childNode, index) => (
            <QuizBuilderLocation
              key={index}
              node={childNode}
              onAddChild={onAddChild}
              onToggleOpen={onToggleOpen}
            />
          ))}
          <button onClick={handleAddChild}>+</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
