export const config = {
  label: 'Menu',
  direction: 'down',
  items: [
    { label: 'add item', handler: (e, item) => { } },
    { label: 'remove item', handler: (e, item) => { } },
    { label: 'add submenu', handler: (e, item) => { } },
    { label: 'remove submenu', handler: (e, item) => { } },
    {
      label: 'change direction clockwise',
      handler: (e, item) => {
        const btn = item.closest('.menu-btn')
        const { direction } = btn.dataset

        btn.dataset.direction =
          directions.clockwise[direction]
      }
    },
    {
      label: 'change direction counterclockwise', handler: (e, item) => {
        const btn = item.closest('.menu-btn')
        const { direction } = btn.dataset

        btn.dataset.direction =
          directions.counterclockwise[direction]
      }
    },
    {
      label: 'submenu', direction: 'right', items: [
        { label: 'subs', direction: 'up', items: [
          { label: 'sub'},
          { label: 'sub'},
        ] },
        { label: 'add item', handler: (e, item) => { } },
        { label: 'remove item', handler: (e, item) => { } },
        { label: 'add submenu', handler: (e, item) => { } },
        { label: 'remove submenu', handler: (e, item) => { } },
        {
          label: 'change direction', handler: changeDirection
        },
        {
          label: 'submenu', direction: 'down', items: [
            { label: 'add item', handler: (e, item) => { } },
            { label: 'remove item', handler: (e, item) => { } },
            { label: 'add submenu', handler: (e, item) => { } },
            { label: 'remove submenu', handler: (e, item) => { } },
            { label: 'change direction', handler: changeDirection },
          ]
        }
      ]
    },
    {
      label: 'submenu', direction: 'right', direction: 'left', items: [
        { label: 'add item', handler: (e, item) => { } },
        { label: 'remove item', handler: (e, item) => { } },
        { label: 'add submenu', handler: (e, item) => { } },
        { label: 'remove submenu', handler: (e, item) => { } },
        {
          label: 'change direction', handler: changeDirection
        },
        {
          label: 'submenu', direction: 'left', items: [
            { label: 'add item', handler: (e, item) => { } },
            { label: 'remove item', handler: (e, item) => { } },
            { label: 'add submenu', handler: (e, item) => { } },
            { label: 'remove submenu', handler: (e, item) => { } },
            { label: 'change direction', handler: changeDirection },
          ]
        }
      ]
    },
  ]
}

const directions = {
  clockwise: {
    up: 'right',
    right: 'down',
    down: 'left',
    left: 'center',
    center: 'up'
  },
  counterclockwise: {
    up: 'center',
    right: 'up',
    down: 'right',
    left: 'down',
    center: 'left'
  },
  horizontal: {
    left: 'center',
    center: 'right',
    right: 'left',
  }
}

function changeDirection(e, item) {
  const li = item.closest('li:has(ul)')
  const { direction } = li.dataset

  li.dataset.direction = directions.horizontal[direction]
}
