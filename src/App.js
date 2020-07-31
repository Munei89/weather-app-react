import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/globalStyles';
import { lightTheme, darkTheme } from './components/Themes'
import { useDarkMode } from './components/customHooks'
import Toggle from './components/Toggle'
import './App.css';

const App = () => {
	const [theme, themeToggler, mountedComponent] = useDarkMode();
	const themeMode = theme === 'light' ? lightTheme : darkTheme;
	if (!mountedComponent) return <div/>
	return (
		<ThemeProvider theme={themeMode}>
			<>
				<GlobalStyles/>
				<div className="App">
					<Toggle theme={theme} toggleTheme={themeToggler} />
				</div>
			</>
		</ThemeProvider>
	);
}

export default App;
