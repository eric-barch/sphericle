'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { FaAngleRight } from 'react-icons/fa';
import LocationActiveButton from '@/components/LocationActiveButton';

export interface Props {
  state: State;
  onToggleActive: (state: State) => void;
  onToggleOpen: (state: State) => void;
  onAddChild: (state: State) => void;
  onDelete: (state: State) => void;
}

export interface State {
  parent: State | null;
  children: State[];
  value: string;
  isOpen: boolean;
  isChecked: boolean;
}

export default function QuizBuilderLocation({
  state,
  onToggleActive,
  onToggleOpen,
  onAddChild,
  onDelete,
}: Props) {
  function handleToggleActive() {
    onToggleActive(state);
  };

  function handleToggleOpen() {
    onToggleOpen(state);
  };

  function handleAddChild() {
    onAddChild(state);
  };

  function handleDelete() {
    onDelete(state);
  };

  return (
    <Accordion.Root
      type="multiple"
      value={state.isOpen ? [state.value] : ['closed']}
      onValueChange={handleToggleOpen}>
      <Accordion.Item value={state.value} className='space-y-1'>
        <Accordion.Header className='quiz-builder-location'>
          <div className='align-middle flex flex-row'>
            <Accordion.Trigger>
              <FaAngleRight
                aria-hidden
                className={`transform ${state.isOpen ? 'rotate-90' : ''} mr-1`} />
            </Accordion.Trigger>
            {state.value}
          </div>
          <LocationActiveButton
            className='text-2xl'
            isChecked={state.isChecked}
            onClick={handleToggleActive} />
        </Accordion.Header>
        <Accordion.Content className='pl-8 space-y-1'>
          {state.children.map((child, index) => (
            <QuizBuilderLocation
              key={index}
              state={child}
              onToggleActive={onToggleActive}
              onToggleOpen={onToggleOpen}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
          <button onClick={handleAddChild}>+</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
