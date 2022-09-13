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
        case 'a':
          keys.a.pressed = true
          leftPlayer.lastKey = 'a'
          break
        case 'z':
          if (leftPlayer.velocity.y === 0) {
            leftPlayer.velocity.y = -20
          }
          break
        case 'w':
          leftPlayer.velocity.y = -20
          break
        case ' ':
          leftPlayer.attack()
          break
      }
    }
  
    if (!rightPlayer.dead) {
      switch (event.key) { // -- rightPlayer
        case 'ArrowRight':
          keys.ArrowRight.pressed = true
          rightPlayer.lastKey = 'ArrowRight'
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true
          rightPlayer.lastKey = 'ArrowLeft'
          break
        case 'ArrowUp':
          if (rightPlayer.velocity.y === 0) {
            rightPlayer.velocity.y = -20
          }
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
      case 'a':
        keys.a.pressed = false
        break
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
    }
  })
}