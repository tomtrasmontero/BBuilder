import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { BurgerBuilder } from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

configure({adapter: new Adapter()});

describe('BurgerBuilder', () => {
  let wrapper;
  beforeEach(() => {
    // onInitIngredients is added because its componentDidMount function needs to be
    // executed but the copy is only a shallow render
    wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}}/>)
  });

  it('should render <BuildConrols /> when receiving ingredients', () => {
    wrapper.setProps({ings: {salad: 0}});
    expect(wrapper.find(BuildControls)).toHaveLength(1);
  });

});
