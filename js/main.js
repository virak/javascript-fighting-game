import { rectangularCollision, determineWinner, decreaseTimer, timerId } from './utils.js'
import { Sprite, Fighter } from './classes.js'
import { initKeybaordEventListener } from './keyboard.js'
import { playBackgroundMusic } from './sound.js'

export const canvas = document.querySelector('canvas')
export const contextCanvas = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
contextCanvas.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  contextCanvas,
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  frameMax: 6
})

export const leftPlayer = new Fighter({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  imageSrc: './img/samuraiMack/Idle.png',
  frameMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      frameMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      frameMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      frameMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      frameMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      frameMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      frameMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      frameMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 145,
    height: 50
  }
})

export const rightPlayer = new Fighter({
  position: {
    x: 860,
    y: 100
  },
  velocity: {
    x: 0,
    y: 10
  },
  color: 'blue',
  imageSrc: './img/kenji/Idle.png',
  frameMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      frameMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      frameMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      frameMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      frameMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      frameMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      frameMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      frameMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

export const keys = {
  d: {
    pressed: false
  },
  q: {
    pressed: false
  },
  a: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

function animate() {
  window.requestAnimationFrame(animate)
  contextCanvas.fillStyle = 'black'
  contextCanvas.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  contextCanvas.fillStyle = 'rgba(255, 255, 255, 0.25)'
  contextCanvas.fillRect(0, 0, canvas.width, canvas.height)
  leftPlayer.update()
  rightPlayer.update()

  leftPlayer.velocity.x = 0
  rightPlayer.velocity.x = 0

  // -- leftPlayer movement
  if ((keys.q.pressed && leftPlayer.lastKey === 'q') || ( keys.a.pressed && leftPlayer.lastKey === 'a')) {
    leftPlayer.velocity.x = -5
    leftPlayer.switchSprite('run')
  } else if (keys.d.pressed && leftPlayer.lastKey === 'd') {
    leftPlayer.velocity.x = 5
    leftPlayer.switchSprite('run')
  } else {
    leftPlayer.switchSprite('idle')
  }
  if (leftPlayer.velocity.y < 0) { // -- jumping up
    leftPlayer.switchSprite('jump')
  } else if (leftPlayer.velocity.y > 0) { // falling down
    leftPlayer.switchSprite('fall')
  }

  // -- rightPlayer movement
  if (keys.ArrowLeft.pressed && rightPlayer.lastKey === 'ArrowLeft') {
    rightPlayer.velocity.x = -5
    rightPlayer.switchSprite('run')
  } else if (keys.ArrowRight.pressed && rightPlayer.lastKey === 'ArrowRight') {
    rightPlayer.velocity.x = 5
    rightPlayer.switchSprite('run')
  } else {
    rightPlayer.switchSprite('idle')
  }
  if (rightPlayer.velocity.y < 0) { // -- jumping up
    rightPlayer.switchSprite('jump')
  } else if (rightPlayer.velocity.y > 0) { // falling down
    rightPlayer.switchSprite('fall')
  }

  // -- leftPlayer detect collision
  if (rectangularCollision({
      rectangle1: leftPlayer,
      rectangle2: rightPlayer
    }) &&
    leftPlayer.isAttacking &&
    leftPlayer.frameCurrent === 4
  ) {
    rightPlayer.takeHit()
    leftPlayer.isAttacking = false
    // eslint-disable-next-line no-undef
    gsap.to('#rightPlayerHealth', {
      width: rightPlayer.health + '%'
    })
  }
  // if leftPlayer is missing
  if (leftPlayer.isAttacking && leftPlayer.frameCurrent === 4) {
    leftPlayer.isAttacking = false
  }

  // -- rightPlayer collisioon detection
  if (rectangularCollision({
      rectangle1: rightPlayer,
      rectangle2: leftPlayer
    }) &&
    rightPlayer.isAttacking &&
    rightPlayer.frameCurrent === 1
  ) {
    rightPlayer.isAttacking = false
    leftPlayer.takeHit()
    // eslint-disable-next-line no-undef
    gsap.to('#leftPlayerHealth', {
      width: leftPlayer.health + '%'
    })
  }
  // if rightPlayer is missing
  if (rightPlayer.isAttacking && rightPlayer.frameCurrent === 2) {
    rightPlayer.isAttacking = false
  }

  // end game on health
  if (leftPlayer.health <= 0 || rightPlayer.health <= 0) {
    determineWinner({
      leftPlayer,
      rightPlayer,
      timerId
    })
  }
}


const buttonStartFight = document.querySelector(".startFightButtonStyle")
buttonStartFight.addEventListener('click', () => {
  // -- hide start fight button
  document.querySelector('#displayButtonStartFight').style.display = 'none'

  playBackgroundMusic()

  decreaseTimer()
  animate()
  initKeybaordEventListener()
})