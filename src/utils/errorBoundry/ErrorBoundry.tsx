import React, { Component } from 'react';
import { ErrorBoundaryState, ErrorBoundaryProps } from '../../dbProps';
import Loader from '../../components/Loader';
import styles from './styles.module.scss';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });
    if (error.message.includes('dynamically imported')) {
      window.location.reload();
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles['c-errorboundary']}>
          <Loader />
        </section>
        // <div>
        //   <h1>Something went wrong.</h1>
        //   <details style={{ whiteSpace: 'pre-wrap' }} open>
        //     {this.state.error && this.state.error.toString()}
        //     <br />
        //     {this.state.errorInfo?.componentStack}
        //   </details>
        // </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
