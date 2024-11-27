import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const Task = ({ taskText, dateTime, priority, onClick }) => {
  const priorityColors = {
    1: { color: 'green', label: 'Low' },
    2: { color: 'orange', label: 'Medium' },
    3: { color: 'red', label: 'High' },
  };

  return (
    <Card className="todo__list" style={{ borderLeft: `5px solid ${priorityColors[priority].color}` }}>
      <CardContent>
        <Typography variant="h6">{taskText}</Typography>
        <Typography variant="body2" color="textSecondary">
          {new Date(dateTime).toLocaleString()}
        </Typography>
        <Typography variant="body2" style={{ color: priorityColors[priority].color }}>
          {priorityColors[priority].label}
        </Typography>
      </CardContent>
      <IconButton onClick={onClick}>
        <DeleteTwoToneIcon color="error" />
      </IconButton>
    </Card>
  );
};

export default Task;
