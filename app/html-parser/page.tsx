"use client";
import React, { useState } from "react";

interface HTMLNode {
  tag?: string;
  text?: string;
  children: HTMLNode[];
}

const parseHTML = (html: string): HTMLNode => {
  const root: HTMLNode = { children: [] };
  const stack: HTMLNode[] = [root];
  const tagPattern = /<\/?(\w+)>/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = tagPattern.exec(html)) !== null) {
    const text = html.slice(lastIndex, match.index).trim();
    if (text) {
      stack[stack.length - 1].children.push({ text, children: [] });
    }

    const [fullTag, tagName] = match;
    if (fullTag.startsWith("</")) {
      if (stack[stack.length - 1].tag === tagName) {
        stack.pop();
      }
    } else {
      const newNode: HTMLNode = { tag: tagName, children: [] };
      stack[stack.length - 1].children.push(newNode);
      stack.push(newNode);
    }

    lastIndex = tagPattern.lastIndex;
  }

  const remainingText = html.slice(lastIndex).trim();
  if (remainingText) {
    stack[stack.length - 1].children.push({
      text: remainingText,
      children: [],
    });
  }

  return root;
};

const HTMLTree: React.FC<{ node: HTMLNode; depth?: number }> = ({
  node,
  depth = 0,
}) => {
  const indent = "  ".repeat(depth);

  if (node.text) {
    return (
      <div>
        {indent}
        {node.text}
      </div>
    );
  }

  return (
    <div>
      {node.tag && (
        <div>
          {indent}&lt;{node.tag}&gt;
        </div>
      )}
      {node.children.map((child, index) => (
        <HTMLTree key={index} node={child} depth={depth + 1} />
      ))}
      {node.tag && (
        <div>
          {indent}&lt;/{node.tag}&gt;
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const [html, setHtml] = useState<string>(
    "<html><body><h1>Hello, World!</h1><p>This is a <strong>simple</strong> HTML parser.</p></body></html>"
  );
  const [parsedHtml, setParsedHtml] = useState<HTMLNode | null>(null);

  const handleParse = () => {
    const parsed = parseHTML(html);
    setParsedHtml(parsed);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>HTML Parser Prototype</h1>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        style={{ width: "100%", height: "150px" }}
      />
      <button onClick={handleParse}>Parse HTML</button>
      {parsedHtml && (
        <div style={{ marginTop: "20px", fontFamily: "monospace" }}>
          <h2>Parsed Result:</h2>
          <HTMLTree node={parsedHtml} />
        </div>
      )}
    </div>
  );
};

export default Home;
