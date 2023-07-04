import { LexicalAnalysis } from './lexical';
import { type RTree, syntaxAnalysis } from './syntax';

const toVue = (root: RTree): string => {
  if (root.name === 'empty') {
    // 空节点
    return `<template>
    ${root.children
      .map((i) => toVue(i))
      .reduce((x: string, y: string) => x + y, '')}
      </template>`;
  } else if (/{\/\*[^]*\*\/}/.test(root.name)) {
    // 注释节点
    return '';
  } else if (/{[^]*}/.test(root.name)) {
    // 包含节点
    return root.name;
  } else {
    return `<${root.name} ${attrToString(root.attr)}>
    ${root.children.map((i) => toVue(i)).reduce((x: string, y: string) => x + y, '')}
    </${root.name}>`;
  }
};

const attrToString = (attr: { [key: string]: string }) => {
  return Object.keys(attr)
    .map((key) => {
      const value = attr[key];
      if (key === 'className') {
        if (value[0] === '{') {
          return `:class="${value.slice(1, -1)}"`;
        } else {
          return `class="${value}"`;
        }
      } else if (/on[^]*/.test(key)) {
        return `@${key.slice(2)}="${value.slice(1, -1)}"`;
      } else {
        if (value[0] === '{') {
          return `:${key}="${value.slice(1, -1)}"`;
        } else {
          return `${key}="${value}"`;
        }
      }
    })
    .join('\n');
};

export const vtr = (temp: string) => {
  return toVue(syntaxAnalysis(LexicalAnalysis(temp)));
};
