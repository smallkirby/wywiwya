import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const processor = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: false,
});

export const compile2md = (md: string): string => {
  const dirtyHtml = processor.render(md);
  return DOMPurify.sanitize(dirtyHtml);
};

export const extractTitle = (md: string): string | null => {
  for (const line of md.split('\n')) {
    const trimmedLine = line.trimStart();
    if (trimmedLine.startsWith('# ')) {
      return trimmedLine.substring(2).trimStart();
    }
  }
  return null;
};

export const extractContentHtml = (md: string): string => {
  const lines = md.split('\n');
  let startIx = 0;
  for (const line of lines) {
    if (line.trimStart().startsWith('# ') || line.trimStart().length === 0) {
      ++startIx;
    } else {
      break;
    }
  }

  if (startIx < lines.length) {
    const dirtyHtml = processor.render(lines.slice(startIx).join('\n'));
    return DOMPurify.sanitize(dirtyHtml);
  } else {
    return '';
  }
};
