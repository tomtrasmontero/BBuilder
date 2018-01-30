import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './NavigationItem.css';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
      <NavLink
        // use activeClassName because webpack will rename the classes to be a unique
        // class for this component.  using classes.active grabs the unique class created
        // by webpack and append it to this link
        activeClassName={classes.active}
        to={props.link}
        exact={props.exact}
        >{props.children}
      </NavLink>
    </li>
)

export default navigationItem;
