import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ListView,
  Dimensions,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';

const style = StyleSheet.create({

});

export default class SwipeOut extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      _animatedValue: new Animated.Value(0),
    };
  }

  _panResponder = {
    panHandlers: {}
  };

  componentWillMount() {
    this._value = {x: 0};
    this.beginWidth = Dimensions.get('window').width;
    this.opacity = 1;
    this.xForRigth = 0;

    this.state._animatedValue.addListener((value) => {
      return this._value = value});

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging

      onPanResponderGrant: (e, gestureState) => {
        this.xForRigth = gestureState.moveX;
        this.yForSwipe = gestureState.moveY;
        this.beginWidth = this.beginWidth - (this.beginWidth - gestureState.moveX);
        this.widthScr = Dimensions.get('window').width;
      },

      onPanResponderMove: (evt, gestureState) => {

        if (this.state._animatedValue < -20) {
          this.props.onDisableScroll();
        }
        else {
          this.props.onEnableScroll();
        }

        if (this.xForRigth < gestureState.moveX) {
          this.props.onEnableScroll();
          this.setState({_animatedValue: 0});
          this.opacity = 1;
        }
        else{
          this.setState({_animatedValue: (gestureState.moveX - this.beginWidth) });
          this.opacity -= 0.007;

          if (this.state._animatedValue < -this.widthScr/2 ) {
            this.props.onDelete(this.props.itemId);
          }
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        this.resetElementAfterRelease();
        this.props.onEnableScroll();
      },

      onPanResponderTerminate: () => {
        this.resetElementAfterRelease();
        this.props.onEnableScroll();
      }
    });
  }

  resetElementAfterRelease() {
    this.setState({_animatedValue: 0});
    this.opacity = 1;
  }

  static propTypes = {
    onDisableScroll: React.PropTypes.func.isRequired,
    onEnableScroll: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    itemId: React.PropTypes.number.isRequired,
  };

  render() {
    return (
      <Animated.View
        style={[
         {
          transform: [
            {translateX: this.state._animatedValue},
          ],
          opacity: this.opacity,
         }
        ]}
        {...this._panResponder.panHandlers}>
        {this.props.children}
      </Animated.View>
    );
  }
}
