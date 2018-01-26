import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
}

class BurgerBuilder extends Component {
  // modern way.  Old way was constructor super(props) this.state...
    state = {
      ingredients: null,
      totalPrice: 4,
      purchaseable: false,
      purchasing: false,
      loading: false,
      error: false,
    }

    componentDidMount() {
      axios.get('https://react-my-burger-d6992.firebaseio.com/ingredients.json')
        .then(response => {
          this.setState({ingredients: response.data})
        })
        .catch(error => {
          this.setState({error: true})
        });
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
      // alert('You continue!');
      this.setState({loading: true});
      const order = {
        ingredients: this.state.ingredients,
        price: this.state.totalPrice.toFixed(2),
        cutomer: {
          name:'Tom',
          address: {
            street: 'Teststreet 1',
            zipCode: '41351',
            country: 'USA',
          },
          email: 'test@test.com'
        },
        deliveryMethod: 'fastest'
      }
      // .json is added for firebase to read it
      axios.post('/orders.json', order)
        .then(response => {
          this.setState({loading: false, purchasing: false});
        })
        .catch(error => {
          this.setState({loading: false, purchasing: false});
        });
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

      let orderSummary = null;
      let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />

      if(this.state.ingredients) {
        orderSummary = (<OrderSummary
            ingredients={this.state.ingredients}
            purchaseCanceled={() => this.purchaseCancelHandler()}
            purchaseContinue={() => this.purchaseContinueHandler()}
            price={this.state.totalPrice}
          />
        );

        burger = (
          <Aux>
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

      if(this.state.loading) {
        orderSummary = <Spinner />;
      }

      return (
        <Aux>
          <Modal
            show={this.state.purchasing}
            modalClosed={() => this.purchaseCancelHandler()}
            > {orderSummary}
          </Modal>
          {burger}
        </Aux>
      );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
