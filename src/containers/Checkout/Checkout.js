import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class Checkout extends Component {
  checkoutCancelledHandler = () => {
    // simply go back to the last page
    console.log('cancelled');
    this.props.history.goBack();
  }

  checkoutContinueHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render(){
    let summary = <Redirect to="/" />
    if(this.props.ings) {
      const purchasedRedirect = this.props.purchased? <Redirect to ='/' /> : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinue={this.checkoutContinueHandler}
          />
          <Route
            path={this.props.match.path + '/contact-data'}
            component={ContactData}
            // way of passing object through Route
          />
        </div>
      );
    }
    return summary;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
  }
}


export default connect(mapStateToProps)(Checkout);
