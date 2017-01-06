/**
 * @flow weak
 * @module Cart
 *
 * @author Oleg Nosov <olegnosov1@gmail.com>
 * @license MIT
 *
 * @description
 * React stateless component which represents shopping cart
 */
import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Transition from 'react-overlays/lib/Transition';

import CartProduct from './CartProduct/CartProduct';
import { animate } from '../../helpers';
import { ProductType } from '../../types';

console.log(ProductType);

const
  /**
   * @static propTypes
   * @memberof Cart
   *
   * @prop {Array<string>} productPropsToShow - Array of product's
   * props which need to be shown in cart.
   * Default is ['colour', 'size']
   *
   * @prop {boolean} showHeader - Show or hide header 'Shopping cart'.
   * Default is true
   * @prop {string} iconTrashClassName - ClassName for
   * trash icon on remove button.
   * Default is 'icon-trash'
   */
  propTypes = {
    productPropsToShow: PropTypes.arrayOf(PropTypes.string),
    showHeader: PropTypes.bool,
    iconTrashClassName: PropTypes.string,
  },
  /**
   * @static containerPropTypes
   * @memberof Cart
   *
   * @prop {Object.<string, ProductType>} products - Products map. Required
   * @prop {Function<string, Object>} onUpdateProduct - Callback
   * function which will be called when product should be updated.
   * First arg is product's key in products, second - props to update.
   * For instance, it may be called like:
   * onUpdateProduct('/shop/macbook-case/_red', { quantity : 50});
   * Required.
   *
   * @prop {Function<string>} onRemoveProduct - Callback to call
   * when need to remove product from products. Accept product's key in products.
   * For example: onRemoveProduct('/shop/macbook-case/_red');
   * Required.
   *
   * @prop {ReactElement} CheckoutButton - Button in the bottom of cart.
   * Required.
   */
  containerPropTypes = {
    products: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      properties: PropTypes.object,
      productInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        prices: PropTypes.objectOf(
          PropTypes.number,
        ).isRequired,
        imagePath: PropTypes.string.isRequired,
      }).isRequired,
    })).isRequired,
    currency: PropTypes.string.isRequired,
    isCartEmpty: PropTypes.bool.isRequired,
    onUpdateProduct: PropTypes.func.isRequired,
    onRemoveProduct: PropTypes.func.isRequired,
    getLocalization: PropTypes.func.isRequired,
    CheckoutButton: PropTypes.element.isRequired,
  },
  defaultProps = {
    productPropsToShow: ['colour', 'size'],
    showHeader: true,
    iconTrashClassName: 'icon-trash',
  };


export default function Cart (
  /*
   * Look at the propTypes
   */
  {
    productPropsToShow,
    showHeader,
    products,
    isCartEmpty,
    iconTrashClassName,
    currency,
    onUpdateProduct,
    onRemoveProduct,
    getLocalization,
    CheckoutButton,
  } : Object) : React$Element<any> {
  return (
    <div className="row m-t-1">
      <Transition
        style={animate(500)}
        in={!isCartEmpty}
        enteringClassName="fadeInUp"
        exitingClassName="fadeOut"
        timeout={500}
        unmountOnExit
      >
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          { showHeader ? getLocalization('shoppingCartTitle') : void 0 }
          <div className="list-group">
            <ReactCSSTransitionGroup
              transitionName={{
                enter: 'bounceInLeft',
                leave: 'bounceOutRight',
              }}
              transitionEnterTimeout={500} transitionLeaveTimeout={500}
            >
              {
                Object
                  .entries(products)
                  .map(([productKey, { productInfo, ...product }]) => (
                    <CartProduct
                      key={productKey}
                      productKey={productKey}
                      quantity={product.quantity}
                      price={productInfo.prices[currency]}
                      currency={currency}
                      path={productInfo.path}
                      name={productInfo.name}
                      imagePath={productInfo.imagePath}
                      productPropsToShow={productPropsToShow}
                      iconTrashClassName={iconTrashClassName}
                      onUpdateProduct={onUpdateProduct}
                      onRemoveProduct={onRemoveProduct}
                      getLocalization={getLocalization}
                    />
                  ),
                )
              }
            </ReactCSSTransitionGroup>
          </div>
          <div className="row m-t-1">
            <div className="col-xs-0 col-sm-2 col-md-2 col-lg-3 col-xl-3" />
            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-6 col-xl-6">
              { CheckoutButton }
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}

Cart.propTypes = { ...propTypes, ...containerPropTypes };
Cart.defaultProps = defaultProps;