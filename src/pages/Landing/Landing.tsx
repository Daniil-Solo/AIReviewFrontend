import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Hero } from './components/Hero'
import { ProblemSolution } from './components/ProblemSolution'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { TargetAudience } from './components/TargetAudience'
import { DemoReport } from './components/DemoReport'
import { SocialProof } from './components/SocialProof'
import { Pricing } from './components/Pricing'
import { Footer } from './components/Footer'
import { Header } from '../../components/Header/Header'

export function LandingPage() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Header opened={opened} onToggle={toggle} />
      </AppShell.Header>
      <AppShell.Main p={0}>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <TargetAudience />
        <DemoReport />
        <SocialProof />
        <Pricing />
        <Footer />
      </AppShell.Main>
    </AppShell>
  )
}