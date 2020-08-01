import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import Home from './pages/Home/Home';
import { GlobalStyles } from './components/globalStyles';
import { lightTheme, darkTheme } from './components/Themes'
import { useDarkMode } from './components/customHooks'
import Toggle from './components/Toggle'
import './styles.scss';

const App = () => {
	const [theme, themeToggler, mountedComponent] = useDarkMode();
	const themeMode = theme === 'light' ? lightTheme : darkTheme;
	if (!mountedComponent) return <div/>
	return (
		<ThemeProvider theme={themeMode}>
			<div className="grid-wrapper">
				<GlobalStyles/>
				<div className="grid-container">
					<Toggle theme={theme} toggleTheme={themeToggler} />
					<Home />
					<p>weather</p>
					<div className="grid-row">
						<div className="col" />
						<div className="col" />
						<div className="col" />
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
