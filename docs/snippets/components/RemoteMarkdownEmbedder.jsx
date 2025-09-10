
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface RemoteMarkdownEmbedderProps {
  url= ({
  url,
  textToRemove,
}: RemoteMarkdownEmbedderProps) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then(setContent);
  }, [url]);

  if (!content) {
    return (
      
        Loading ...
      
    );
  }

  const finalContent = textToRemove
    ? content.replace(textToRemove, "")
    : content;

  return {finalContent};
};

export default RemoteMarkdownEmbedder;
