'use client'

import QuizBuilderLocation, { QuizBuilderLocationState } from '@/components/QuizBuilderLocation';
import { useState } from 'react';

export default function QuizBuilder() {
  const [tree, setTree] = useState<QuizBuilderLocationState>({
    label: 'Root',
    isOpen: false,
    children: []
  });

  const handleAddChild = (parentNode: QuizBuilderLocationState) => {
    const newNode = { label: `Child ${parentNode.children.length + 1}`, isOpen: false, children: [] };
    parentNode.children.push(newNode);
    setTree({ ...tree });
  };

  const handleToggleOpen = (targetNode: QuizBuilderLocationState) => {
    targetNode.isOpen = !targetNode.isOpen;
    setTree({ ...tree });
  };

  const deleteNodeFromTree = (target: QuizBuilderLocationState, current = tree) => {
    if (!current.children) return;

    const index = current.children.indexOf(target);

    if (index >= 0) {
      current.children.splice(index, 1);
      return true;
    }

    for (const child of current.children) {
      if (deleteNodeFromTree(target, child)) return true;
    }

    return false;
  };

  const handleDeleteNode = (node: QuizBuilderLocationState) => {
    if (node === tree) return; // Avoid deleting the root node
    deleteNodeFromTree(node);
    setTree({ ...tree });
  };

  return <QuizBuilderLocation
    node={tree}
    onAddChild={handleAddChild}
    onToggleOpen={handleToggleOpen}
    onDeleteNode={handleDeleteNode} />;
}