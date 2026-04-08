"use client";

import { Component, ReactNode } from 'react';
import { Shield, Home, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReturnHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-background px-4"
          data-testid="error-boundary-fallback"
        >
          <div className="max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-destructive" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Something Went Wrong
            </h1>
            
            <p className="text-muted-foreground mb-2">
              We're sorry, but something unexpected happened.
            </p>
            
            {this.state.error && (
              <p className="text-sm text-muted-foreground mb-6 p-3 bg-muted rounded-md break-words">
                {this.state.error.message}
              </p>
            )}
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={this.handleReturnHome}
                size="default"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
              
              <Button
                onClick={this.handleTryAgain}
                variant="outline"
                size="default"
                className="w-full"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
