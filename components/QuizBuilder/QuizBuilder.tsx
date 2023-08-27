'use client'

import QuizBuilderLocation, { State as Location } from '@/components/QuizBuilderLocation';
import { useState } from 'react';

export default function QuizBuilder() {
  const [rootLocation, setLocationTree] = useState<Location>({
    parent: null,
    children: [],
    value: 'root',
    isOpen: false,
  });

  function handleToggleOpen(location: Location) {
    location.isOpen = !location.isOpen;
    setLocationTree({ ...rootLocation });
  };

  function handleAddChild(parentLocation: Location) {
    const childLocation = {
      parent: parentLocation,
      children: [],
      value: `Child ${parentLocation.children.length + 1}`,
      isOpen: false,
    };
    parentLocation.children.push(childLocation);
    setLocationTree({ ...rootLocation });
  };

  function handleDelete(targetLocation: Location) {
    if (targetLocation === rootLocation) return;
    const parentLocation = targetLocation.parent!;
    const targetIndex = parentLocation.children.indexOf(targetLocation);
    parentLocation.children.splice(targetIndex, 1);
    setLocationTree({ ...rootLocation });
  };

  return <QuizBuilderLocation
    state={rootLocation}
    onAddChild={handleAddChild}
    onToggleOpen={handleToggleOpen}
    onDelete={handleDelete} />;
}