import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

// connect enzyme so we can render a standalone component.  shallow renders all component
// but not deeply.
configure({adapter: new Adapter()});

describe('<NavigationItems />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
  });

  it('should render two NavigationItem elements if not authenticated', () => {
    // check if navigation item is in NavigationItems
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it('should render three NavigationItem elements if authenticated', () => {
    // wrapper = shallow(<NavigationItems isAuthenticated />);
    // setProps allows to set property of a component, similar to doing it above
    wrapper.setProps({ isAuthenticated: true});
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });

  it('should render a Navigation elements with link of "/logout" if authenticated', () => {
    wrapper.setProps({ isAuthenticated: true});
    const NavigationComponent = (
      <NavigationItem
          link="/logout"
          >Logout
      </NavigationItem>
    );

    expect(wrapper.contains(NavigationComponent)).toEqual(true);
  });

});
