import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {
  // modern way.  Old way was constructor super(props) this.state...
    state = {
      purchasing: false,
    }

    componentDidMount() {
      console.log(this.props);
      this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients) {
      const sum = Object.keys(ingredients).map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => sum + el,0);

      return sum > 0;
    }

    purchaseHandler() {
      this.setState({purchasing: true});
    }

    purchaseCancelHandler() {
      this.setState({purchasing: false});
    }

    purchaseContinueHandler() {
      this.props.onInitPurchase();
      this.props.history.push('/checkout');
    }

    render() {
      const disabledInfo = {
          ...this.props.ings
      };
      for(let key in disabledInfo) {
        // if item has 0 it returns false and disable the button
        disabledInfo[key] = disabledInfo[key] <= 0;
      }

      let orderSummary = null;
      let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />

      if(this.props.ings) {
        orderSummary = (<OrderSummary
            ingredients={this.props.ings}
            purchaseCanceled={() => this.purchaseCancelHandler()}
            purchaseContinue={() => this.purchaseContinueHandler()}
            price={this.props.price}
          />
        );

        burger = (
          <Aux>
            <Burger ingredients={this.props.ings} />
            <BuildControls
              ingredientAdded={this.props.onIngredientAdded}
              ingredientRemove={this.props.onIngredientRemove}
              disabled={disabledInfo}
              purchasable={this.updatePurchaseState(this.props.ings)}
              price={this.props.price}
              ordered={() => this.purchaseHandler()}
            />
          </Aux>
        );
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

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
