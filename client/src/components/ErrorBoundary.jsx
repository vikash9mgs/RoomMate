import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Container className="mt-5 pt-5 text-center">
                    <Alert variant="danger">
                        <Alert.Heading>Something went wrong</Alert.Heading>
                        <p>
                            An unexpected error has occurred. Please try refreshing the page.
                        </p>
                        <hr />
                        <div className="text-start">
                            <details style={{ whiteSpace: 'pre-wrap' }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </details>
                        </div>
                    </Alert>
                    <Button variant="primary" onClick={() => window.location.reload()}>
                        Refresh Page
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={() => window.location.href = '/'}>
                        Go Home
                    </Button>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
