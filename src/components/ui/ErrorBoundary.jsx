import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 glass-card">
          <p className="text-accent-red text-lg font-semibold mb-2">Oops, the broth spilled!</p>
          <p className="text-text-secondary text-sm mb-4">
            {this.state.error?.message || 'Something went wrong while cooking your data'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:opacity-90 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
