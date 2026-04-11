import { Box } from '@mantine/core'
import { Hero } from './components/Hero'
import { ProblemSolution } from './components/ProblemSolution'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { TargetAudience } from './components/TargetAudience'
import { DemoReport } from './components/DemoReport'
import { SocialProof } from './components/SocialProof'
import { Pricing } from './components/Pricing'
import { Footer } from './components/Footer'

export function Landing() {
  return (
    <Box>
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Features />
      <TargetAudience />
      <DemoReport />
      <SocialProof />
      <Pricing />
      <Footer />
    </Box>
  )
}