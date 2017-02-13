'use strict';

var React = require('react');
var ReactTransitionChildMapping = require('./ReactTransitionChildMapping');
var CSSTransitionGroupChild = require('./CSSTransitionGroupChild');

var CSSTransitionGroup = React.createClass({
  displayName: 'CSSTransitionGroup',

  protoTypes: {
    component: React.PropTypes.any,
    transitionName: React.PropTypes.string.isRequired,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      component: 'span',
      transitionEnter: true,
      transitionLeave: true
    };
  },

  getInitialState: function getInitialState() {
    var ret = [];
    React.Children.forEach(this.props.children, function (c) {
      ret.push(c);
    });
    return {
      children: ret
    };
  },

  componentWillMount: function componentWillMount() {
    this.currentlyTransitioningKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this = this;

    var nextChildMapping = [];
    var showProp = this.props.showProp;
    var exclusive = this.props.exclusive;

    React.Children.forEach(nextProps.children, function (c) {
      nextChildMapping.push(c);
    });

    // // last props children if exclusive
    var prevChildMapping = exclusive ? this.props.children : this.state.children;

    var newChildren = ReactTransitionChildMapping.mergeChildMappings(prevChildMapping, nextChildMapping);

    if (showProp) {
      newChildren = newChildren.map(function (c) {
        if (!c.props[showProp] && ReactTransitionChildMapping.isShownInChildren(prevChildMapping, c, showProp)) {
          var newProps = {};
          newProps[showProp] = true;
          c = React.cloneElement(c, newProps);
        }
        return c;
      });
    }

    if (exclusive) {
      // make middle state children invalid
      // restore to last props children
      newChildren.forEach(function (c) {
        _this.stop(c.key);
      });
    }

    this.setState({
      children: newChildren
    });

    nextChildMapping.forEach(function (c) {
      var key = c.key;
      var hasPrev = prevChildMapping && ReactTransitionChildMapping.inChildren(prevChildMapping, c);
      if (showProp) {
        if (hasPrev) {
          var showInPrev = ReactTransitionChildMapping.isShownInChildren(prevChildMapping, c, showProp);
          var showInNow = c.props[showProp];
          if (!showInPrev && showInNow && !_this.currentlyTransitioningKeys[key]) {
            _this.keysToEnter.push(key);
          }
        }
      } else if (!hasPrev && !_this.currentlyTransitioningKeys[key]) {
        _this.keysToEnter.push(key);
      }
    });

    prevChildMapping.forEach(function (c) {
      var key = c.key;
      var hasNext = nextChildMapping && ReactTransitionChildMapping.inChildren(nextChildMapping, c);
      if (showProp) {
        if (hasNext) {
          var showInNext = ReactTransitionChildMapping.isShownInChildren(nextChildMapping, c, showProp);
          var showInNow = c.props[showProp];
          if (!showInNext && showInNow && !_this.currentlyTransitioningKeys[key]) {
            _this.keysToLeave.push(key);
          }
        }
      } else if (!hasNext && !_this.currentlyTransitioningKeys[key]) {
        _this.keysToLeave.push(key);
      }
    });
  },

  performEnter: function performEnter(key) {
    this.currentlyTransitioningKeys[key] = true;
    var component = this.refs[key];
    if (component.componentWillEnter) {
      component.componentWillEnter(this._handleDoneEntering.bind(this, key));
    } else {
      this._handleDoneEntering(key);
    }
  },

  _handleDoneEntering: function _handleDoneEntering(key) {
    //console.log('_handleDoneEntering, ', key);
    delete this.currentlyTransitioningKeys[key];
    var currentChildMapping = this.props.children;
    var showProp = this.props.showProp;
    if (!currentChildMapping || !showProp && !ReactTransitionChildMapping.inChildrenByKey(currentChildMapping, key) || showProp && !ReactTransitionChildMapping.isShownInChildrenByKey(currentChildMapping, key, showProp)) {
      // This was removed before it had fully entered. Remove it.
      //console.log('releave ',key);
      this.performLeave(key);
    } else {
      this.setState({ children: currentChildMapping });
    }
  },

  stop: function stop(key) {
    delete this.currentlyTransitioningKeys[key];
    var component = this.refs[key];
    if (component) {
      component.stop();
    }
  },

  performLeave: function performLeave(key) {
    this.currentlyTransitioningKeys[key] = true;

    var component = this.refs[key];
    if (component.componentWillLeave) {
      component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
    } else {
      // Note that this is somewhat dangerous b/c it calls setState()
      // again, effectively mutating the component before all the work
      // is done.
      this._handleDoneLeaving(key);
    }
  },

  _handleDoneLeaving: function _handleDoneLeaving(key) {
    //console.log('_handleDoneLeaving, ', key);
    delete this.currentlyTransitioningKeys[key];
    var showProp = this.props.showProp;
    var currentChildMapping = this.props.children;
    if (showProp && currentChildMapping && ReactTransitionChildMapping.isShownInChildrenByKey(currentChildMapping, key, showProp)) {
      this.performEnter(key);
    } else if (!showProp && currentChildMapping && ReactTransitionChildMapping.inChildrenByKey(currentChildMapping, key)) {
      // This entered again before it fully left. Add it again.
      //console.log('reenter ',key);
      this.performEnter(key);
    } else {
      this.setState({ children: currentChildMapping });
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    var keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);
    var keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  },

  render: function render() {
    var props = this.props;
    var children = this.state.children.map(function (child) {
      return React.createElement(
        CSSTransitionGroupChild,
        {
          key: child.key,
          ref: child.key,
          name: props.transitionName,
          enter: props.transitionEnter,
          leave: props.transitionLeave },
        child
      );
    });
    var Component = this.props.component;
    return React.createElement(
      Component,
      this.props,
      children
    );
  }
});
module.exports = CSSTransitionGroup;