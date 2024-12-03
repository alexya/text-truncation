import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const Panel: React.FC = () => {
  const [view, setView] = useState<string | null>('option1');

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: string | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Updated button styles
  const buttonStyles = {
    minWidth: '100px',
    maxWidth: '200px',
    flex: 1,
    padding: '8px 16px',
    // Direct styles for the button itself
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    // Override the default styles that might cause wrapping
    '& .MuiToggleButton-root': {
      textTransform: 'none',
      lineHeight: '1.5',
    }
  };

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleChange}
      aria-label="view options"
      sx={{
        display: 'flex',
        width: 'fit-content',
      }}
    >
      <ToggleButton value="option1" aria-label="option 1" sx={buttonStyles}>
        1 WITH A VERY LONG TEXT THAT SHOULD BE TRUNCATED
      </ToggleButton>
      <ToggleButton value="option2" aria-label="option 2" sx={buttonStyles}>
        OPTION 2
      </ToggleButton>
      <ToggleButton value="option3" aria-label="option 3" sx={buttonStyles}>
        OPTION 3
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default Panel; 