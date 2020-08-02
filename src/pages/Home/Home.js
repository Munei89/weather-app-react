import React from 'react';
import Header from '../../components/Header';
import PropTypes from 'prop-types';
import Weather from "../../components/Weather";


const Home = ({}) => {
	return (
		<>
		<Header />
		<Weather />
		</>
	);
};
// Home.defaultPropTypes = {
//     theme: 'light',
//     toggleTheme: () => {}
// }
// Home.propTypes = {
//     theme: PropTypes.string,
//     toggleTheme: PropTypes.func,
// }
export default Home;
