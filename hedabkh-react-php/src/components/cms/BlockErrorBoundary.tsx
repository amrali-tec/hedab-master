'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  blockId: string;
  blockType: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class BlockErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[BlockErrorBoundary] Caught rendering error in block "${this.props.blockId}" (${this.props.blockType}):`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full my-4 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col items-center justify-center text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
          <h4 className="text-sm font-bold">عفو، حدث حماية تعذر عرض كتلة المحتوى ({this.props.blockType})</h4>
          <p className="text-xs text-amber-400/80 font-mono">Block ID: {this.props.blockId}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة التحميل</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
