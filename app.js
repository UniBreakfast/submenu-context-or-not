/* TASK

  Develop a function to create buttons with multi-level menu which is smart enough to open on the correct side of the screen and to fit on the screen.

  For testing purposes create one button with menu. Make it draggable. Menu should have commands to add/remove items, submenus, change directions.
*/

makeButton_makeItDraggable()

import { makeDraggable } from './js/make-draggable.js'
import { makeMenuButton } from './menu/menu-button.js'
import { config } from './menu/menu-button-config.js'

function makeButton_makeItDraggable() {
  const btn = makeMenuButton(config)

  body.append(btn)

  makeDraggable(btn, { shift: true })
}

function makeButton(text) {
  const btn = document.createElement('button')

  btn.textContent = text

  return btn
}
