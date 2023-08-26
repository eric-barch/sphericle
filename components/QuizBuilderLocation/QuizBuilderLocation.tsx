'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { FaCaretDown } from 'react-icons/fa';

export interface QuizBuilderLocationProps {
  node: QuizBuilderLocationState;
  onAddChild: (node: QuizBuilderLocationState) => void;
  onToggleOpen: (node: QuizBuilderLocationState) => void;
  onDeleteNode: (node: QuizBuilderLocationState) => void;
}

export interface QuizBuilderLocationState {
  label: string;
  isOpen: boolean;
  children: QuizBuilderLocationState[];
}

export default function QuizBuilderLocation({
  node,
  onAddChild,
  onToggleOpen,
  onDeleteNode,
}: QuizBuilderLocationProps) {
  const handleToggleOpen = (newValue: string[]) => {
    onToggleOpen(node);
  };

  const handleAddChild = () => {
    onAddChild(node);
  };

  const handleDelete = () => {
    onDeleteNode(node);
  };

  const renderCaret = () => {
    return node.isOpen ? (
      <FaCaretDown aria-hidden className="transform rotate-180" />
    ) : (
      <FaCaretDown aria-hidden />
    );
  };

  return (
    <Accordion.Root
      type="multiple"
      value={node.isOpen ? ['open'] : ['closed']}
      onValueChange={handleToggleOpen}
    >
      <Accordion.Item value='open'>
        <Accordion.Header>
          {node.label}
          <button className='mx-2' onClick={handleDelete}>-</button>
          <Accordion.Trigger>
            {renderCaret()}
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className='ml-8'>
          {node.children.map((childNode, index) => (
            <QuizBuilderLocation
              key={index}
              node={childNode}
              onAddChild={onAddChild}
              onToggleOpen={onToggleOpen}
              onDeleteNode={onDeleteNode}
            />
          ))}
          <button onClick={handleAddChild}>+</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
