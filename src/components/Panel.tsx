import React, { useState, useEffect, useMemo, createRef } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";

/* eslint-disable @typescript-eslint/no-unused-vars */
function getRenderedFont(fontFamily: string): string {
  const fonts = fontFamily.split(/\s*,\s*/);
  for (const font of fonts) {
    if (document.fonts.check(`1em ${font}`)) {
      return font;
    }
  }
  return 'sans-serif';
}
/* eslint-enable @typescript-eslint/no-unused-vars */

interface PanelProps {
  options: string[];
}

const Panel: React.FC<PanelProps> = ({ options }) => {
  const [view, setView] = useState<string | null>(options[0] || null);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: string | null
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const [buttonWidth, setButtonWidth] = useState(250); // Default width

  // Width calculation effect
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      const typographyElement = document.querySelector('.MuiTypography-root');
      const buttonElement = document.querySelector('.MuiToggleButton-root');
      
      const typographyStyle = typographyElement 
        ? window.getComputedStyle(typographyElement)
        : { 
            fontWeight: '400',
            fontSize: '16px',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
          };
      
      // const renderedFont = getRenderedFont(typographyStyle.fontFamily);
      context.font = `${typographyStyle.fontWeight} ${typographyStyle.fontSize} ${typographyStyle.fontFamily}`;
      // context.font = `${typographyStyle.fontWeight} ${typographyStyle.fontSize} ${renderedFont}`;
      
      const widths = options.map(text => {
        const metrics = context.measureText(text);
        return metrics.width * 1.12;
      });
      const maxTextWidth = Math.max(...widths);
      
      const buttonStyle = buttonElement
        ? window.getComputedStyle(buttonElement)
        : { paddingLeft: '11px', paddingRight: '11px' };
      
      const totalPadding = parseInt(buttonStyle.paddingLeft) + parseInt(buttonStyle.paddingRight);
      const maxTextWidthWithPadding = Math.ceil(maxTextWidth + totalPadding);
      
      const panelWidth = 800;
      const panelPadding = 32;
      const buttonGap = 2;
      const totalGaps = (options.length - 1) * buttonGap;
      const availableWidth = (panelWidth - panelPadding - totalGaps) / options.length;
      
      const minWidth = 120;
      const maxWidth = availableWidth;
      
      setButtonWidth(Math.min(Math.max(maxTextWidthWithPadding, minWidth), maxWidth));
    }
  }, [options]);

  // Create refs for each button's text
  const refs = useMemo(
    () =>
      Array(options.length)
        .fill(null)
        .map(() => createRef<HTMLSpanElement>()),
    [options.length]
  );

  // Track which texts are truncated
  const [truncatedTexts, setTruncatedTexts] = useState<{
    [key: string]: boolean;
  }>({});

  // Check for truncation after every render and width change
  useEffect(() => {
    const checkTruncation = () => {
      const newTruncatedTexts: { [key: string]: boolean } = {};
      refs.forEach((ref, index) => {
        if (ref.current) {
          const element = ref.current;
          const isTextTruncated = 
            element.offsetWidth < element.scrollWidth ||
            element.offsetWidth + 0.5 < element.getBoundingClientRect().width;
          newTruncatedTexts[options[index]] = isTextTruncated;
        }
      });
      setTruncatedTexts(newTruncatedTexts);
    };

    requestAnimationFrame(checkTruncation);
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [refs, buttonWidth, options]);

  const renderToggleButton = (value: string, label: string, index: number) => {
    const button = (
      <ToggleButton
        key={label}
        value={label}
        aria-label={label}
        sx={{
          width: buttonWidth,
          minWidth: "120px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          "&.MuiToggleButton-root": {
            padding: "12px",
          },
        }}
      >
        <Typography noWrap ref={refs[index]}>
          {label}
        </Typography>
      </ToggleButton>
    );

    return truncatedTexts[label] ? (  // Use actual text as key instead of 'option${index}'
      <Tooltip title={label} key={value}>
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  return (
    <div
      style={{
        width: "800px",
        display: "flex",
        justifyContent: "center",
        border: "1px solid #e0e0e0",
        backgroundColor: "#f5f5f5",
        padding: "16px",
      }}
    >
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleChange}
        aria-label="view options"
        sx={{
          display: "flex",
          width: "fit-content",
        }}
      >
        {options.map((option, index) =>
          renderToggleButton(`option${index}`, option, index)
        )}
      </ToggleButtonGroup>
    </div>
  );
};

export default Panel;
