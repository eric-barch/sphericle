'use client'

import QuizBuilderLocation, { State as Location } from '@/components/QuizBuilderLocation';
import { useState } from 'react';

export default function QuizBuilder({
  className
}: {
  className?: string
}) {
  const [rootLocation, setLocationTree] = useState<Location>({
    parent: null,
    children: [],
    value: 'root',
    isChecked: true,
    isOpen: false,
  });

  function handleToggleOpen(location: Location) {
    location.isOpen = !location.isOpen;
    setLocationTree({ ...rootLocation });
  };

  function handleToggleActive(location: Location) {
    location.isChecked = !location.isChecked;
    setLocationTree({ ...rootLocation });
  }

  function handleAddChild(parentLocation: Location) {
    const childLocation = {
      parent: parentLocation,
      children: [],
      value: `Child ${parentLocation.children.length + 1}`,
      isChecked: true,
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

  return (<div className={className}>
    <QuizBuilderLocation
      state={rootLocation}
      onToggleActive={handleToggleActive}
      onToggleOpen={handleToggleOpen}
      onAddChild={handleAddChild}
      onDelete={handleDelete} />
  </div>);
}