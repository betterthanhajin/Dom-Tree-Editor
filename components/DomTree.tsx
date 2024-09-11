"use client";
import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

interface DomTreeProps {
  initialHtml: string;
}

type Action = "edit" | "add" | "delete";

const DomTree: React.FC<DomTreeProps> = ({ initialHtml }) => {
  const [html, setHtml] = useState(initialHtml);
  const [mermaidDiagram, setMermaidDiagram] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const mermaidCode = generateMermaidFromDOM(doc.body);
    setMermaidDiagram(mermaidCode);

    mermaid.initialize({ startOnLoad: true });
    mermaid.render("mermaid-diagram", mermaidCode).then((result) => {
      const mermaidOutput = document.getElementById("mermaid-output");
      if (mermaidOutput) {
        mermaidOutput.innerHTML = result.svg;
      }
    });
  }, [html]);

  const generateMermaidFromDOM = (
    node: Element | Node,
    parentId: string = "root"
  ): string => {
    let code = "graph TD\n";
    let nodeCounter = 0;

    const traverse = (n: Element | Node, pId: string) => {
      const nodeId = `node${nodeCounter++}`;
      const nodeContent =
        n.nodeType === Node.TEXT_NODE
          ? n.textContent?.trim() || ""
          : (n as Element).tagName;

      if (pId !== "root") {
        code += `  ${pId}["${
          (n as Element).tagName || "TEXT"
        }"] --> ${nodeId}["${nodeContent}"]\n`;
      } else {
        code += `  ${nodeId}["${nodeContent}"]\n`;
      }

      if (n.childNodes.length > 0) {
        Array.from(n.childNodes).forEach((child) => {
          if (
            child.nodeType === Node.ELEMENT_NODE ||
            (child.nodeType === Node.TEXT_NODE &&
              child.textContent?.trim() !== "")
          ) {
            traverse(child, nodeId);
          }
        });
      }
    };

    traverse(node, parentId);
    return code;
  };

  const handleDiagramClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickedElement = (event.target as HTMLElement).closest(".node");
    if (clickedElement) {
      const nodeText = clickedElement.textContent || "";
      const action = prompt(
        `Choose action for "${nodeText}":\n1. Edit\n2. Add Child\n3. Delete`
      );

      switch (action) {
        case "1":
          const newTag = prompt(
            `Edit the tag or text for "${nodeText}":`,
            nodeText
          );
          if (newTag !== null) {
            const updatedHtml = updateHtmlBasedOnDiagram(
              html,
              nodeText,
              newTag,
              "edit"
            );
            setHtml(updatedHtml);
          }
          break;
        case "2":
          const newChild = prompt(
            `Enter new child element for "${nodeText}" (e.g., div, p, span, or text):"`
          );
          if (newChild !== null) {
            const updatedHtml = updateHtmlBasedOnDiagram(
              html,
              nodeText,
              newChild,
              "add"
            );
            setHtml(updatedHtml);
          }
          break;
        case "3":
          if (confirm(`Are you sure you want to delete "${nodeText}"?`)) {
            const updatedHtml = updateHtmlBasedOnDiagram(
              html,
              nodeText,
              "",
              "delete"
            );
            setHtml(updatedHtml);
          }
          break;
        default:
          alert("Invalid action selected");
      }
    }
  };

  const updateHtmlBasedOnDiagram = (
    currentHtml: string,
    targetText: string,
    newContent: string,
    action: Action
  ): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(currentHtml, "text/html");

    const updateNode = (node: Node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).tagName.toLowerCase() === targetText.toLowerCase()
      ) {
        switch (action) {
          case "edit":
            const newElement = doc.createElement(newContent);
            while (node.firstChild) {
              newElement.appendChild(node.firstChild);
            }
            node.parentNode?.replaceChild(newElement, node);
            break;
          case "add":
            if (newContent.match(/^[a-z]+$/i)) {
              node.appendChild(doc.createElement(newContent));
            } else {
              node.appendChild(doc.createTextNode(newContent));
            }
            break;
          case "delete":
            node.parentNode?.removeChild(node);
            break;
        }
      } else if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent?.trim() === targetText
      ) {
        switch (action) {
          case "edit":
            node.textContent = newContent;
            break;
          case "add":
            const newNode = newContent.match(/^[a-z]+$/i)
              ? doc.createElement(newContent)
              : doc.createTextNode(newContent);
            node.parentNode?.insertBefore(newNode, node.nextSibling);
            break;
          case "delete":
            node.parentNode?.removeChild(node);
            break;
        }
      }

      node.childNodes.forEach(updateNode);
    };

    updateNode(doc.body);
    return doc.body.innerHTML;
  };

  return (
    <div>
      <div
        id="mermaid-output"
        onClick={handleDiagramClick}
        ref={outputRef}
      ></div>
      <textarea
        value={html}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setHtml(e.target.value)
        }
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default DomTree;
