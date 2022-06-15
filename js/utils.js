import { leftPlayer, rightPlayer } from './main.js'

export function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

export function determineWinner({ leftPlayer, rightPlayer, timerId }) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'

  if (leftPlayer.health === rightPlayer.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (leftPlayer.health > rightPlayer.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (leftPlayer.health < rightPlayer.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
}


let timer = 60
export let timerId

export function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000)
  if (timer > 0) {
    timer--
    document.querySelector('#timer').innerHTML = timer
  } else {
    determineWinner({
      leftPlayer,
      rightPlayer,
      timerId
    })
  }
}
