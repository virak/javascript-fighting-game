const canvas = document.querySelector('canvas')
const contextCanvas = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

contextCanvas.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  frameMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 10
  },
  offset: {
    x: 0,
    y: 0
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

const ennemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 10
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
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

const keys = {
  d: {
    pressed: false
  },
  q: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

let lastKey


decreaseTimer()

// ---------------------------------
function animate () {
  window.requestAnimationFrame(animate)
  contextCanvas.fillStyle = 'black'
  contextCanvas.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  contextCanvas.fillStyle = 'rgba(255, 255, 255, 0.25)'
  contextCanvas.fillRect(0,0, canvas.width, canvas.height)
  player.update()
  ennemy.update()

  player.velocity.x = 0
  ennemy.velocity.x = 0

  // -- Player movement
  if (keys.q.pressed && player.lastKey === 'q') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }
  if (player.velocity.y < 0) { // -- jumping up
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) { // falling down
    player.switchSprite('fall')
  }

  // -- Ennemy movement
  if (keys.ArrowLeft.pressed && ennemy.lastKey === 'ArrowLeft') {
    ennemy.velocity.x = -5
    ennemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && ennemy.lastKey === 'ArrowRight') {
    ennemy.velocity.x = 5
    ennemy.switchSprite('run')
  } else {
    ennemy.switchSprite('idle')
  }
  if (ennemy.velocity.y < 0) { // -- jumping up
    ennemy.switchSprite('jump')
  } else if (ennemy.velocity.y > 0) { // falling down
    ennemy.switchSprite('fall')
  }

  // -- player detect collision
  if (rectangularCollision({ rectangle1: player, rectangle2: ennemy }) &&
      player.isAttacking &&
      player.frameCurrent === 4
  ) {
    ennemy.takeHit()
    player.isAttacking = false
    gsap.to('#ennemyHealth', {
      width: ennemy.health + '%'
    })
  }
  // if player is missing
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false
  }

  // -- Ennemy collisioon detection
  if (rectangularCollision({ rectangle1: ennemy, rectangle2: player }) &&
      ennemy.isAttacking &&
      ennemy.frameCurrent === 1
  ) {
    ennemy.isAttacking = false
    player.takeHit()
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }
  // if ennemy is missing
  if (ennemy.isAttacking && ennemy.frameCurrent === 2) {
    ennemy.isAttacking = false
  }

  // end game on health
  if (player.health <= 0 || ennemy.health <= 0) {
    determineWinner({ player, ennemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'q':
        keys.q.pressed = true
        player.lastKey = 'q'
        break
      case 'z':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!ennemy.dead) {
    switch (event.key) {
      // -- Ennemy
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        ennemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        ennemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        ennemy.velocity.y = -20
        break
      case 'ArrowDown':
        ennemy.attack()
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
    // -- ennemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})
