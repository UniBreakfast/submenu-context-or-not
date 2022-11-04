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
  const menus = this.querySelectorAll('ul')
  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight

  menus.forEach(ul => chooseDirection(ul, {width, height}))
}

function chooseDirection(ul, {width, height}) {
  const parent = ul.parentElement
  
  parent.dataset.direction = parent.dataset.prefDir

  if (isInViewport(ul, {width, height})) return

  const firstLevel = parent.classList.contains('menu-btn')
  const badDirections = [parent.dataset.direction]

  if (!firstLevel && parent.previousElementSibling) {
    badDirections.push('up')
  }

  if (!firstLevel && parent.nextElementSibling) {
    badDirections.push('down')
  }

  rotateTillFit(ul, badDirections, {width, height})
}

function rotateTillFit(ul, badDirections, viewport) {
  const parent = ul.parentElement
  const directions = ['right', 'down', 'left', 'up', 'center']
    .filter(dir => !badDirections.includes(dir))

  for (const direction of directions) {
    parent.dataset.direction = direction

    if (isInViewport(ul, viewport)) return
  }

  parent.dataset.direction = parent.dataset.prefDir
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

function isInViewport(el, {width, height}) {
  const rect = el.getBoundingClientRect()

  return rect.top >= 0 && rect.left >= 0 &&
    rect.bottom <= height && rect.right <= width
}
