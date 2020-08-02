import React from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'
const Button = styled.button`
  background: ${({ theme }) => theme.background};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  color: ${({ theme }) => theme.text};
  border-radius: 30px;
  cursor: pointer;
  font-size:0.8rem;
  padding: 0.6rem;
  }
`;
const Toggle = ({ theme, toggleTheme }) => {
	return (
		<Button onClick={toggleTheme} >
          We Love Dark Mode
		</Button>
	);
};
Toggle.defaultPropTypes = {
	theme: 'light',
	toggleTheme: () => {}
}
Toggle.propTypes = {
	theme: PropTypes.string,
	toggleTheme: PropTypes.func,
}
export default Toggle;
