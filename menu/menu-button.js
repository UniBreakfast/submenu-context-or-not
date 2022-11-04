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
  btn.dataset.direction = config.direction ?? 'center'
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
    li.dataset.direction = item.direction ?? 'center'
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
  const menus = this.querySelectorAll('ul')
  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight

  menus.forEach(ul => chooseDirection(ul, {width, height}))
}

function chooseDirection(ul, {width, height}) {
  const ulRect = ul.getBoundingClientRect()

  if (isInViewport(ulRect, {width, height})) return

  const parent = ul.parentElement
  const grandparent = parent.parentElement
  const firstLevel = parent.classList.contains('menu-btn')
  const badDirections = [parent.dataset.direction]
  const pRect = firstLevel 
    ? parent.getBoundingClientRect()
    : grandparent.getBoundingClientRect()

  if (!firstLevel && parent.previousElementSibling) {
    badDirections.push('up')
  }

  if (!firstLevel && parent.nextElementSibling) {
    badDirections.push('down')
  }

  parent.dataset.direction = getBestDirection(
    pRect, ulRect, {width, height}, badDirections, 
  )
}

function getBestDirection(pRect, ulRect, {width, height}, badDirections) {
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

function isInViewport(rect, {width, height}) {
  return rect.top >= 0 && rect.left >= 0 &&
    rect.bottom <= height && rect.right <= width
}
