import { Box } from '@mui/material';
import { ResizableBox } from 'react-resizable';
import Panel from './components/Panel';
import Label from './components/Label';
import 'react-resizable/css/styles.css';

function App() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      p: 2 
    }}>
      <Panel />
      <ResizableBox
        width={200}
        height={400}
        minConstraints={[100, 200]}
        maxConstraints={[1500, 1800]}
        resizeHandles={['se']}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            border: '1px dashed grey',
            padding: 2,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Label text="This is a short text" />
          <Label 
            text="This is a very long text that will be truncated with ellipsis at the end"
            ellipsisPosition="end"
          />
          <Label
            text="This is a very long text that will be truncated with ellipsis in the middle"
            ellipsisPosition="middle"
          />
          <Label
            text="React and TypeScript are great tools for building modern web applications"
            ellipsisPosition="end"
          />
          <Label
            text="Material-UI provides beautiful and customizable React components out of the box"
            ellipsisPosition="middle"
          />
          <Label text="Custom width" maxWidth={100} />
        </Box>
      </ResizableBox>
    </Box>
  );
}

export default App;
