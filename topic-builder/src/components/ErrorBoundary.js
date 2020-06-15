import React, { Component } from "react";
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        const { onError } = this.props;
        if (this.state.hasError) return onError || <div>Error!</div>;

        return this.props.children;
    }
}
