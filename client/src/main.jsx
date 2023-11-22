import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './context/store';

// if (process.env.NODE_ENV === 'PRODUCTION') {
// 	disableReactDevTools();
// }

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='/*' element={<App />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
