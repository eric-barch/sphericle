'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { FaCaretRight } from 'react-icons/fa';

export interface Props {
  state: State;
  onAddChild: (state: State) => void;
  onToggleOpen: (state: State) => void;
  onDelete: (state: State) => void;
}

export interface State {
  parent: State | null;
  children: State[];
  value: string;
  isOpen: boolean;
}

export default function QuizBuilderLocation({
  state,
  onToggleOpen,
  onAddChild,
  onDelete,
}: Props) {
  function handleToggleOpen() {
    onToggleOpen(state);
  };

  function handleAddChild() {
    onAddChild(state);
  };

  function handleDelete() {
    onDelete(state);
  };

  function renderCaret() {
    return state.isOpen ? (
      <FaCaretRight aria-hidden className="transform rotate-90" />
    ) : (
      <FaCaretRight aria-hidden />
    );
  };

  return (
    <Accordion.Root
      type="multiple"
      value={state.isOpen ? [state.value] : ['closed']}
      onValueChange={handleToggleOpen}
    >
      <Accordion.Item value={state.value}>
        <Accordion.Header>
          <Accordion.Trigger>
            {renderCaret()}
          </Accordion.Trigger>
          {state.value}
          <button className='mx-2' onClick={handleDelete}>-</button>
        </Accordion.Header>
        <Accordion.Content className='ml-8'>
          {state.children.map((child, index) => (
            <QuizBuilderLocation
              key={index}
              state={child}
              onAddChild={onAddChild}
              onToggleOpen={onToggleOpen}
              onDelete={onDelete}
            />
          ))}
          <button onClick={handleAddChild}>+</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
