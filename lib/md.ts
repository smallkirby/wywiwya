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

export const compile2mdStyled = (md: string): string => {
  const sanitizedHtml = compile2md(md);
  const styledHtml = `
          <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous">
        <link rel="stylesheet" href="/css/preview-sandbox.css">
        `;
  return styledHtml + sanitizedHtml;
};

const extractContentRawMd = (md: string): string => {
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
    return lines.slice(startIx).join('\n');
  } else {
    return '';
  }
};

export const extractContentHtmlStyled = (md: string): string => {
  return compile2mdStyled(extractContentRawMd(md));
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
