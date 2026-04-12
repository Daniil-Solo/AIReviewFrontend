import { Group, ThemeIcon, Text } from '@mantine/core'
import { IconBrain } from '@tabler/icons-react'
import styles from './Logo.module.css'
import { useNavigate } from 'react-router-dom'


export function Logo() {
  const navigate = useNavigate()

  return (
    <Group gap="xs" style={{"cursor": "pointer"}} onClick={() => navigate("/")}>
      <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 45 }}>
        <IconBrain size={18} />
      </ThemeIcon>
      <Text className={styles.text}>AI Review</Text>
    </Group>
  )
}