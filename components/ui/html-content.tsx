export const HtmlContent = ({ content }: { content: string }) => {
    return (
      <div 
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  };
  