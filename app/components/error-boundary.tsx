"use client";

import { Component, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error.message || "Unknown error" };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[auto-cut] ErrorBoundary caught:", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <h2 className="text-charcoal mb-3 font-serif text-2xl font-medium">Something went wrong</h2>
                    <p className="text-stone mb-4 max-w-md text-sm leading-relaxed font-light">
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    {this.state.errorMessage && (
                        <p className="text-stone/60 mb-8 max-w-md font-mono text-xs wrap-break-word">
                            {this.state.errorMessage}
                        </p>
                    )}
                    <button
                        onClick={() => this.setState({ hasError: false, errorMessage: null })}
                        className="btn-elegant bg-charcoal text-surface rounded-full px-8 py-3 font-light tracking-wide"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
