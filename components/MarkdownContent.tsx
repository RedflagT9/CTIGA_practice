
import React from 'react';

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Simple regex-based markdown parser for a subset of markdown (Headings, Bold, Lists, Images, Code)
  // This avoids heavy external dependencies for a single-file feel while staying functional.
  
  const renderContent = (text: string) => {
    let html = text
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mb-4 mt-6">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-xl font-semibold mb-3 mt-4">$1</h3>')
      .replace(/\*\*(.*)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/- (.*)/g, '<li class="ml-4 list-disc mb-1">$1</li>')
      .replace(/```python([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600">$1</code>')
      // Handling images from the dump
      .replace(/<img([\s\S]*?)\/>/g, (match) => {
          // Keep internal img tags but ensure they are responsive
          return match.replace('<img', '<img class="max-w-full h-auto rounded-lg shadow-md my-4 border border-slate-200"');
      });

    return { __html: html };
  };

  return (
    <div 
      className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
      dangerouslySetInnerHTML={renderContent(content)} 
    />
  );
};

export default MarkdownContent;
