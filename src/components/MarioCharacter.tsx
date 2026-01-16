import { motion } from 'framer-motion'
import { X } from '@phosphor-icons/react'

interface MarioCharacterProps {
  isVisible: boolean
  recommendation?: {
    stockSymbol: string
    stockName: string
    reasoning: string
    confidence: number
  }
  onClose: () => void
}

export function MarioCharacter({ isVisible, recommendation, onClose }: MarioCharacterProps) {
  if (!isVisible || !recommendation) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className="bg-card border-4 border-primary rounded-lg max-w-lg w-full shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} weight="bold" />
        </button>

        <div className="p-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-6xl"
              >
                🍄
              </motion.div>
            </div>

            <div className="flex-1">
              <h2 className="font-game text-xl text-primary mb-2">MARIO SAYS</h2>
              <h3 className="font-game text-lg mb-4">STOP!</h3>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="font-game text-sm mb-2">{recommendation.stockSymbol}</div>
                <div className="text-sm text-muted-foreground mb-1">{recommendation.stockName}</div>
              </div>

              <p className="text-sm leading-relaxed mb-4">
                {recommendation.reasoning}
              </p>

              <div className="flex items-center gap-2">
                <div className="text-xs font-medium text-muted-foreground">Confidence:</div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${recommendation.confidence}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="h-full bg-primary"
                  />
                </div>
                <div className="text-xs font-bold">{recommendation.confidence}%</div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full mt-6 bg-primary text-primary-foreground font-game text-sm py-4 rounded-lg hover:brightness-110 transition-all shadow-lg"
          >
            GOT IT!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
