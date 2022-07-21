import React from 'react';

import ShadowContent from '@/ShadowContent';
import Home from '@/components/Home';

import './App.less';

const App: React.FC = () => {
    return (
        <ShadowContent>
            <div className="app">
                <Home />
            </div>
        </ShadowContent>
    );
};

export default App;
