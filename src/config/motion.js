export const springSnappy = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export const springGentle = {
  type: 'spring',
  stiffness: 150,
  damping: 20,
}

export const springBouncy = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}
