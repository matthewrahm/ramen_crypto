const LOADING_MESSAGES = [
  'Brewing your data...',
  'Slurping prices...',
  'Simmering the charts...',
  'Stirring the broth...',
  'Adding toppings...',
  'Boiling the noodles...',
  'Seasoning your portfolio...',
  'Preparing your bowl...',
]

const EMPTY_MESSAGES = {
  positions: 'Your bowl is empty. Place a trade to add some noodles!',
  allocation: 'No toppings yet. Buy some assets to fill your bowl.',
  error: 'Oops, the broth spilled! Something went wrong.',
  noData: 'Nothing cooking here yet.',
}

export function getRandomLoadingMessage() {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
}

export { LOADING_MESSAGES, EMPTY_MESSAGES }
