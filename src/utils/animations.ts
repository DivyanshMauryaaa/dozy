import { Variants } from 'framer-motion'

// Initial page load animations
export const initialPageLoad: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

// List item animations
export const listItemVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.1
    }
  }
}

// Container animations
export const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

// Modal animations
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
}

// Sidebar animations
export const sidebarVariants: Variants = {
  initial: { x: -300 },
  animate: { 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

// Menu item animations
export const menuItemVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.2
    }
  },
  exit: { 
    opacity: 0, 
    x: -10,
    transition: {
      duration: 0.1
    }
  }
}

// Page transition
export const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.2
}

// Hover animations
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: 0.2
  }
}

export const tapScale = {
  scale: 0.98,
  transition: {
    duration: 0.1
  }
} 