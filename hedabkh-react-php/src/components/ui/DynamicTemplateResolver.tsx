"use client";

import React from 'react';
import { EditableResource, EditorElementNode } from '../../types';

interface DynamicTemplateResolverProps {
  template: EditableResource;
  data: Record<string, any>;
  locale?: 'ar' | 'en';
}

export default function DynamicTemplateResolver({
  template,
  data,
  locale = 'ar',
}: DynamicTemplateResolverProps) {
  const isAr = locale === 'ar';

  if (!template || !template.content?.nodes) return null;

  // Resolve dynamic binding value e.g. "service.title" -> data.title
  const resolveBindingValue = (node: EditorElementNode): string => {
    const bindingPath = node.bindings?.field;
    if (bindingPath) {
      const parts = bindingPath.split('.');
      const key = parts[parts.length - 1];
      if (data && data[key]) {
        return String(data[key]);
      }
    }
    return isAr
      ? node.props.textAr || node.props.headlineAr || node.props.fallbackText || ''
      : node.props.textEn || node.props.headlineEn || node.props.fallbackText || '';
  };

  return (
    <div className="space-y-6 text-start">
      {template.content.nodes.map((node) => {
        const value = resolveBindingValue(node);

        if (node.type === 'heading' || node.type === 'dynamic-field') {
          return (
            <h2
              key={node.id}
              style={{ color: node.styles?.textColor || 'inherit' }}
              className={`text-xl sm:text-2xl font-black text-slate-900 dark:text-white ${node.styles?.customClasses || ''}`}
            >
              {value}
            </h2>
          );
        }

        if (node.type === 'paragraph') {
          return (
            <p
              key={node.id}
              style={{ color: node.styles?.textColor || 'inherit' }}
              className={`text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${node.styles?.customClasses || ''}`}
            >
              {value}
            </p>
          );
        }

        return (
          <div key={node.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">{value}</span>
          </div>
        );
      })}
    </div>
  );
}
