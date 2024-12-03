import React, { useEffect, useRef, useState } from 'react';
import { Typography, Tooltip } from '@mui/material';

interface LabelProps {
  text: string;
  maxWidth?: number | string;
  ellipsisPosition?: 'middle' | 'end';
}

const Label: React.FC<LabelProps> = ({ 
  text, 
  maxWidth = '100%',
  ellipsisPosition = 'end' 
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const { offsetWidth, scrollWidth } = textRef.current;
        setIsTextTruncated(scrollWidth > offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      checkTruncation();
    });

    if (textRef.current?.parentElement) {
      resizeObserver.observe(textRef.current.parentElement);
    }

    // Initial check
    checkTruncation();

    return () => {
      resizeObserver.disconnect();
    };
  }, [text]);

  const getDisplayText = () => {
    if (!isTextTruncated) return text;
    if (ellipsisPosition === 'end') return text;

    if (textRef.current) {
      const availableWidth = textRef.current.offsetWidth;
      const charWidth = 8; // Approximate width per character
      const charsToShow = Math.floor((availableWidth - 20) / charWidth); // Account for ellipsis
      const halfChars = Math.floor(charsToShow / 2);
      return `${text.slice(0, halfChars)}...${text.slice(-halfChars)}`;
    }
    return text;
  };

  const typographyStyles = {
    maxWidth,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: ellipsisPosition === 'end' ? 'ellipsis' : 'clip',
    display: 'block',
    textAlign: 'left',
    width: '100%',
    padding: '8px 0',
  };

  const content = (
    <Typography ref={textRef} sx={typographyStyles}>
      {ellipsisPosition === 'middle' ? getDisplayText() : text}
    </Typography>
  );

  return isTextTruncated ? (
    <Tooltip title={text} arrow>
      {content}
    </Tooltip>
  ) : content;
};

export default Label; 