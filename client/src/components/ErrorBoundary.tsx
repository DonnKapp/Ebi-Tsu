import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV)
      console.error("Ebi Tsū application error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-page__inner page-width">
            <AlertTriangle size={24} />
            <span className="section-label">
              <span>—</span> Temporary interruption
            </span>
            <h1>
              The water
              <br />
              <em>went still.</em>
            </h1>
            <p>
              Something unexpected interrupted this page. Your account and
              submitted records have not been changed by this screen.
            </p>
            <div className="error-page__actions">
              <button
                className="button button--dark"
                type="button"
                onClick={() => window.location.reload()}
              >
                <RotateCcw size={15} /> Reload page
              </button>
              <a className="text-link" href="/">
                <ArrowLeft size={15} /> Return home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
