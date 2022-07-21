import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export const getShadowRoot = (): HTMLElement => {
    const parentEl = document.querySelector('#rootMain');

    if (!parentEl) return;

    let moduleEl = parentEl.querySelector('#shadow');

    if (!moduleEl) {
        moduleEl = document.createElement('div');
        moduleEl.setAttribute('id', 'shadow');

        parentEl.appendChild(moduleEl);

        moduleEl.attachShadow({ mode: 'open' });
    }

    return (moduleEl.shadowRoot as unknown) as HTMLElement;
};

const ShadowContent: React.FC = ({ children }) => {
    const [root, setRoot] = useState(null);

    useEffect(() => {
        setRoot(getShadowRoot());
    }, []);

    if (!root) return null;

    return ReactDOM.createPortal(children, (root as unknown) as Element);
};

export default ShadowContent;
