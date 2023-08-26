'use client'

import QuizBuilderLocation, { Node } from '@/components/QuizBuilderLocation';
import { useState } from 'react';

export default function QuizBuilder() {
  const [tree, setTree] = useState<Node>({
    label: 'Root',
    isOpen: false,
    children: []
  });

  const handleAddChild = (parentNode: Node) => {
    const newNode = { label: `Child ${parentNode.children.length + 1}`, isOpen: false, children: [] };
    parentNode.children.push(newNode);
    setTree({ ...tree });
  };

  const handleToggleOpen = (targetNode: Node) => {
    targetNode.isOpen = !targetNode.isOpen;
    setTree({ ...tree });
  };

  return <QuizBuilderLocation node={tree} onAddChild={handleAddChild} onToggleOpen={handleToggleOpen} />;
}