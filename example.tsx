import React, { memo } from 'react';

interface ComponentProps {
  items: { name: string; id: number }[];
}

const items = [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 2' }];

function Component({ items }: ComponentProps) {
  return (
    <>
      {items.map((i) => (
        <p>{i.name}</p>
      ))}
    </>
  );
}

const MemoComponent = memo(Component);

function Usage() {
  const mappedItems = items.map((item, index) => ({
    name: item.name,
    id: index,
  }));

  return <MemoComponent items={mappedItems} />;
}
