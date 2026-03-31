import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import { useProgressContext } from '@/context/ProgressContext'

function groupQuestionsByTopic(questions) {
  return questions.reduce((groupMap, question) => {
    if (!groupMap[question.group]) {
      groupMap[question.group] = []
    }
    groupMap[question.group].push(question)
    return groupMap
  }, {})
}

export default function QuestionList({ questions, selectedQuestionId, onQuestionSelect, testItem, onTestItemClick }) {
  const { isQuestionComplete } = useProgressContext()

  const questionsByGroup = groupQuestionsByTopic(questions)
  const globalIndexMap = questions.reduce((map, question, index) => {
    map[question.id] = index + 1
    return map
  }, {})

  return (
    <Box sx={{ overflowY: 'auto', height: '100%' }}>
      {import.meta.env.DEV && testItem && (
        <ListItemButton
          selected={selectedQuestionId === testItem.id}
          onClick={onTestItemClick}
          sx={{ borderRadius: 1, mx: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Checkbox edge="start" checked={false} disableRipple size="small" tabIndex={-1} />
          </ListItemIcon>
          <ListItemText
            primary={testItem.title}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </ListItemButton>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block', mb: 0.5 }}>
        {questions.length} questions total
      </Typography>
      {Object.entries(questionsByGroup).map(([groupName, groupQuestions]) => (
        <Box key={groupName} sx={{ mb: 1 }}>
          <Box sx={{ px: 2, display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Tooltip
              title={groupName}
              placement="top"
              enterDelay={300}
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 1.5,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    px: 1.5,
                    py: 0.75,
                  },
                },
                arrow: { sx: { color: 'primary.main' } },
              }}
              arrow
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {groupName}
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
              {groupQuestions.length} {groupQuestions.length === 1 ? 'question' : 'questions'}
            </Typography>
          </Box>
          <List dense disablePadding>
            {groupQuestions.map(question => {
              const isComplete = isQuestionComplete(question.id)
              const isSelected = question.id === selectedQuestionId
              const globalIndex = globalIndexMap[question.id]

              return (
                <ListItemButton
                  key={question.id}
                  selected={isSelected}
                  onClick={() => onQuestionSelect(question)}
                  sx={{ borderRadius: 1, mx: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={isComplete}
                      disableRipple
                      size="small"
                      tabIndex={-1}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${globalIndex}. ${question.title}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Box>
      ))}
    </Box>
  )
}
