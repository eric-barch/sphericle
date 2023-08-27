'use client'

import QuizBuilderLocation, { State } from '@/components/QuizBuilderLocation';
import { useState } from 'react';

export default function QuizBuilder() {
  const [locationStateTree, setLocationStateTree] = useState<State>({
    value: 'root',
    isOpen: false,
    children: []
  });

  function handleToggleOpen(targetState: State) {
    targetState.isOpen = !targetState.isOpen;
    setLocationStateTree({ ...locationStateTree });
  };

  function handleAddChild(parentState: State) {
    const newState = {
      value: `Child ${parentState.children.length + 1}`,
      isOpen: false,
      children: []
    };
    parentState.children.push(newState);
    setLocationStateTree({ ...locationStateTree });
  };

  function handleDeleteHelper(targetState: State, currentState = locationStateTree) {
    if (!currentState.children) return;

    const targetIndex = currentState.children.indexOf(targetState);
    console.log(targetIndex);

    /**If the target state is a direct descendant of the current state, delete it. */
    if (targetIndex >= 0) {
      currentState.children.splice(targetIndex, 1);
      return true;
    }

    /**Otherwise, recursively check each child to see if the target is a descendant. */
    for (const child of currentState.children) {
      if (handleDeleteHelper(targetState, child)) return true;
    }

    return false;
  };

  function handleDelete(state: State) {
    if (state === locationStateTree) return;
    handleDeleteHelper(state);
    setLocationStateTree({ ...locationStateTree });
  };

  return <QuizBuilderLocation
    state={locationStateTree}
    onAddChild={handleAddChild}
    onToggleOpen={handleToggleOpen}
    onDelete={handleDelete} />;
}