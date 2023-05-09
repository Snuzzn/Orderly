import React from 'react';

import './SideDrawer.css';

const SideDrawer = props => (
    <nav className='side-drawer'>
        <ul>
            <li><b><a href='/'>Account</a></b></li>
            <li><b><a href='/'>Your Restaurants</a></b></li>
            <li><b><a href='/'>Log out</a></b></li>
        </ul>
    </nav>
);

export default SideDrawer;