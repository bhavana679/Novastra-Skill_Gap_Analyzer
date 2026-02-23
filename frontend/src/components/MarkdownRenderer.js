"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
    return (
        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-inherit">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg !mt-2 !mb-2"
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...props} className={`${className} bg-primary/20 text-primary px-1 py-0.5 rounded font-mono text-xs font-bold`}>
                                {children}
                            </code>
                        );
                    },
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1 mt-2">{children}</h3>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-primary/50 pl-4 py-1 italic my-2 bg-surface/50 rounded-r-lg">{children}</blockquote>,
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                            {children}
                        </a>
                    ),
                    table: ({ children }) => <div className="overflow-x-auto my-2 rounded-lg border border-border"><table className="min-w-full divide-y divide-border">{children}</table></div>,
                    th: ({ children }) => <th className="px-3 py-2 bg-surface text-left text-xs font-bold uppercase tracking-wider">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 whitespace-nowrap text-sm border-t border-border">{children}</td>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
