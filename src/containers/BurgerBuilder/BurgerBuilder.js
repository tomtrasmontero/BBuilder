import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
}

class BurgerBuilder extends Component {
  // modern way.  Old way was constructor super(props) this.state...
    state = {
      ingredients: {
          salad: 0,
          bacon: 0,
          cheese: 0,
          meat: 0,
      },
      totalPrice: 0,
      purchaseable: false,
      purchasing: false,
    }

    updatePurchaseState(ingredients) {
      const sum = Object.keys(ingredients).map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => sum + el,0);

      this.setState({purchasable: sum > 0})
    }

    purchaseHandler() {
      this.setState({purchasing: true});
    }

    purchaseCancelHandler() {
      this.setState({purchasing: false});
    }

    purchaseContinueHandler() {
      alert('You continue!');
    }

    addIngredientHandler = (type) => {
      const updatedCount = this.state.ingredients[type] + 1;
      const updatedIngredients = { ...this.state.ingredients };
      updatedIngredients[type] = updatedCount;
      const updatedPrice = INGREDIENT_PRICES[type] + this.state.totalPrice;

      this.setState({totalPrice: updatedPrice, ingredients: updatedIngredients});
      this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
      if(this.state.ingredients[type] <= 0){
        return;
      }
      const updatedCount = this.state.ingredients[type] - 1;
      const updatedIngredients = { ...this.state.ingredients };
      updatedIngredients[type] = updatedCount;
      const updatedPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

      this.setState({totalPrice: updatedPrice, ingredients: updatedIngredients});
      this.updatePurchaseState(updatedIngredients);
    }

    render() {
      const disabledInfo = {
          ...this.state.ingredients
      };
      for(let key in disabledInfo) {
        // if item has 0 it returns false and disable the button
        disabledInfo[key] = disabledInfo[key] <= 0;
      }

      return (
        <Aux>
          <Modal
            show={this.state.purchasing}
            modalClosed={() => this.purchaseCancelHandler()}
            >
            <OrderSummary
              ingredients={this.state.ingredients}
              purchaseCanceled={() => this.purchaseCancelHandler()}
              purchaseContinue={() => this.purchaseContinueHandler()}
              price={this.state.totalPrice}
            />
          </Modal>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemove={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            ordered={() => this.purchaseHandler()}
          />
        </Aux>
      );
    }
}

export default BurgerBuilder;