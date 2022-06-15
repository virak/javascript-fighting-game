import { leftPlayer, rightPlayer, keys } from './main.js'

export function initKeybaordEventListener () {
  window.addEventListener('keydown', (event) => {
    if (!leftPlayer.dead) {
      switch (event.key) {
      case 'd':
          keys.d.pressed = true
          leftPlayer.lastKey = 'd'
          break
        case 'q':
          keys.q.pressed = true
          leftPlayer.lastKey = 'q'
          break
        case 'z':
          leftPlayer.velocity.y = -20
          break
        case ' ':
          leftPlayer.attack()
          break
      }
    }
  
    if (!rightPlayer.dead) {
      switch (event.key) {
        // -- rightPlayer
        case 'ArrowRight':
          keys.ArrowRight.pressed = true
          rightPlayer.lastKey = 'ArrowRight'
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true
          rightPlayer.lastKey = 'ArrowLeft'
          break
        case 'ArrowUp':
          rightPlayer.velocity.y = -20
          break
        case 'ArrowDown':
          rightPlayer.attack()
          break
      }
    }
  })
  
  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'd':
        keys.d.pressed = false
        break
      case 'q':
        keys.q.pressed = false
        break
        // -- rightPlayer keys
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
    }
  })
}