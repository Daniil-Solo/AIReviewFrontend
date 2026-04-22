import { useEffect, useState } from 'react';
import { Box, Loader, Table, Text } from '@mantine/core';
import mermaid from 'mermaid';
import styles from './MermaidGantt.module.css';
import type { PipelineTaskDTO } from '../../types';
import { stepProcessLabels } from '../../features/solutions/constants';

interface MermaidGanttProps {
  tasks: PipelineTaskDTO[];
}


export function MermaidGantt({ tasks }: MermaidGanttProps) {
  const [svg, setSvg] = useState('');
  const [loading, setLoading] = useState(true);

  console.log("MermaidGantt")

  useEffect(() => {
    const finishedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'failed');

    if (finishedTasks.length === 0) {
      setLoading(false);
      return;
    }

    const taskLines = finishedTasks.map((task) => {
      const status = 'done';
      return `    ${task.step} :${status}, t${task.id}, ${task.ran_at}, ${task.duration?.toFixed(1)}s`;
    }).join('\n');

    const mermaidCode = `gantt
    dateFormat YYYY-MM-DDTHH:mm:ss.SSSZ
    axisFormat %d-%m %H:%M

${taskLines}`;

    console.log(mermaidCode)

    const renderDiagram = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });
        
        if (await mermaid.parse(mermaidCode)) {
          const id = `gantt-${Math.random().toString(36).substring(2, 9)}`;
          const { svg: rendered } = await mermaid.render(id, mermaidCode);
          setSvg(rendered);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
      } finally {
        setLoading(false);
      }
    };

    renderDiagram();
  }, [tasks]);

  return (
    <Box className={styles.container}>
      {loading ? (
        <Box className={styles.loading}>
          <Loader size="sm" />
        </Box>
      ) : svg ? (
        <Box className={styles.diagram} dangerouslySetInnerHTML={{ __html: svg }} />
      ) : null}
      {
        tasks.length > 0
        ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Шаг</Table.Th>
                <Table.Th>Описание</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Время</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {
                tasks.map(task => (
                  <Table.Tr key={task.id}>
                    <Table.Td>{task.step}</Table.Td>
                    <Table.Td>{stepProcessLabels[task.step]}</Table.Td>
                    <Table.Td>{task.status}</Table.Td>
                    <Table.Td>{task.duration?.toFixed(1)}</Table.Td>
                  </Table.Tr>
                ))
              }
            
            </Table.Tbody>
          </Table>
        ):(
        <Text c="dimmed">Нет информации о прогрессе</Text>
      )
      }
      
      
    </Box>
  );
}