'use client'

import Location, { State as LocationState } from '../Location';
import { useState } from 'react';

export default function Root() {
  const [rootLocationState, setRootLocationState] = useState<LocationState>({
    parent: null,
    children: [],
    value: 'root',
    isChecked: true,
    isOpen: false,
  });

  function handleToggleOpen(locationState: LocationState) {
    locationState.isOpen = !locationState.isOpen;
    setRootLocationState({ ...rootLocationState });
  };

  function handleToggleActive(locationState: LocationState) {
    locationState.isChecked = !locationState.isChecked;
    setRootLocationState({ ...rootLocationState });
  }

  function handleAddChild(locationState: LocationState) {
    const childLocationState = {
      parent: locationState,
      children: [],
      value: `Child ${locationState.children.length + 1}`,
      isChecked: true,
      isOpen: false,
    };
    locationState.children.push(childLocationState);
    setRootLocationState({ ...rootLocationState });
  };

  function handleDelete(locationState: LocationState) {
    if (locationState === rootLocationState) return;
    const parentLocation = locationState.parent!;
    const targetIndex = parentLocation.children.indexOf(locationState);
    parentLocation.children.splice(targetIndex, 1);
    setRootLocationState({ ...rootLocationState });
  };

  return (
    <Location
      state={rootLocationState}
      onToggleActive={handleToggleActive}
      onToggleOpen={handleToggleOpen}
      onAddChild={handleAddChild}
      onDelete={handleDelete} />
  );
}