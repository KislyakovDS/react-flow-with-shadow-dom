import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const Root: React.FC = () => {
    return (
        <div id="rootMain">
            <App />
        </div>
    );
};

ReactDOM.render(<Root />, document.getElementById('root'));
