export { makeMenuButton }

/* 
config = {
  label: 'Menu',
  items: [
    {label: 'add item', handler: (e, item) => {}},
    {label: 'remove item', handler: (e, item) => {}},
    {label: 'add submenu', handler: (e, item) => {}},
    {label: 'remove submenu', handler: (e, item) => {}},
    {label: 'change direction clockwise', handler: (e, item) => {}},
    {label: 'change direction counterclockwise', handler: (e, item) => {}},
    {label: 'submenu', items: [
      {label: 'add item', handler: (e, item) => {}},
      {label: 'remove item', handler: (e, item) => {}},
      {label: 'add submenu', handler: (e, item) => {}},
      {label: 'remove submenu', handler: (e, item) => {}},
      {label: 'change direction clockwise', handler: (e, item) => {}},
      {label: 'change direction counterclockwise', handler: (e, item) => {}},
      {label: 'submenu', items: [
        {label: 'add item', handler: (e, item) => {}},
        {label: 'remove item', handler: (e, item) => {}},
        {label: 'add submenu', handler: (e, item) => {}},
        {label: 'remove submenu', handler: (e, item) => {}},
        {label: 'change direction clockwise', handler: (e, item) => {}},
        {label: 'change direction counterclockwise', handler: (e, item) => {}},
      ]}
    ]},
  ]
}

makeMenuButton(config) // returns button with menu like this:

<button>
  <label>
    Menu<input type="checkbox" hidden id="menu-toggler">
  </label>

  <ul>
    <li>add item</li>
    <li>remove item</li>
    <li>add submenu</li>
    <li>remove submenu</li>
    <li>change direction clockwise</li>
    <li>change direction counterclockwise</li>

    <li>
      <span>submenu</span>

      <ul>
        <label for="menu-toggler"></label>

        <li>add item</li>
        <li>remove item</li>
        <li>add submenu</li>
        <li>remove submenu</li>
        <li>change direction clockwise</li>
        <li>change direction counterclockwise</li>

        <li>
          <span>submenu</span>
        
          <ul>
            <label for="menu-toggler"></label>

            <li>add item</li>
            <li>remove item</li>
            <li>add submenu</li>
            <li>remove submenu</li>
            <li>change direction clockwise</li>
            <li>change direction counterclockwise</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</button>
*/
function makeMenuButton(config) {
  const btn = document.createElement('button')
  const label = document.createElement('label')
  const input = document.createElement('input')
  const ul = document.createElement('ul')

  btn.append(label, ul)
  label.append(config.label, input)
  btn.classList.add('menu-btn')
  btn.dataset.direction = btn.dataset.prefDir =
    config.direction ?? 'right'
  Object.assign(input, { type: 'checkbox', hidden: true, id: 'menu-toggler' })

  ul.append(...config.items.map(buildMenuItem))
  btn.optimizeDirections = optimizeDirections

  return btn
}

function buildMenuItem(item) {
  const li = document.createElement('li')

  if (item.items) {
    const span = document.createElement('span')
    const ul = document.createElement('ul')
    const label = document.createElement('label')

    li.append(span, ul)
    span.append(item.label)
    ul.append(label, ...item.items.map(buildMenuItem))
    li.dataset.direction = li.dataset.prefDir =
      item.direction ?? 'center'
    label.setAttribute('for', 'menu-toggler')
  } else {
    li.append(item.label)

    if (item.handler) {
      li.addEventListener('click', e => item.handler(e, li))
    }
  }

  return li
}

function optimizeDirections() {
  const menu = this.querySelector('ul')
  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight

  if (!chooseDirection(menu, { width, height }))
    chooseDirection(menu, { width, height }, true)
}

function chooseDirection(ul, viewport, desperate = false) {
  const parent = ul.parentElement
  const firstLevel = parent.classList.contains('menu-btn')
  const badDirections = []

  if (!firstLevel) {
    if (!parent.matches(':first-of-type')) 
      badDirections.push('up')
    if (!parent.matches(':last-of-type'))
      badDirections.push('down')
  }

  return rotateTillFit(ul, badDirections, viewport, desperate)
}

function rotateTillFit(
  ul, badDirections, viewport, desperate
) {
  const parent = ul.parentElement
  const directions = ['right', 'down', 'left', 'up', 'center']
    .filter(dir => !badDirections.includes(dir))

  directions.unshift(...directions.splice(
    directions.indexOf(parent.dataset.prefDir), 1
  ))

  if (desperate) directions.push(...badDirections)

  for (const direction of directions) {
    parent.dataset.direction = direction

    if (isInViewport(ul, viewport)) {
      if (
        [...ul.children]
          .filter(li => li.children.length)
          .map(li => li.querySelector('ul'))
          .every(menu => chooseDirection(menu, viewport, desperate))
      ) return true
    }
  }
}

function getBestDirection(pRect, ulRect, { width, height }, badDirections) {
  let bestDirection = null
  let bestPortion = 1

  const top = pRect.top - 9 // reserve some space for better UX
  const left = pRect.left - 9
  const right = width - pRect.right - 9
  const bottom = height - pRect.bottom - 9

  if (!badDirections.includes('up')) {
    const portion = ulRect.height / top

    if (portion < bestPortion) {
      [bestPortion, bestDirection] = [portion, 'up']
    }
  }

  if (!badDirections.includes('down')) {
    const portion = ulRect.height / bottom

    if (portion < bestPortion) {
      [bestPortion, bestDirection] = [portion, 'down']
    }
  }

  if (!badDirections.includes('left')) {
    const portion = ulRect.width / left

    if (portion < bestPortion) {
      [bestPortion, bestDirection] = [portion, 'left']
    }
  }

  if (!badDirections.includes('right')) {
    const portion = ulRect.width / right

    if (portion < bestPortion) {
      [bestPortion, bestDirection] = [portion, 'right']
    }
  }

  return bestDirection ?? 'center'
}

function isInViewport(el, { width, height }) {
  const rect = el.getBoundingClientRect()

  return rect.top >= 0 && rect.left >= 0 &&
    rect.bottom <= height && rect.right <= width
}
