/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types'
import RcDropdown from 'rc-dropdown'
import 'rc-dropdown/assets/index.css'
import {DownOutlined} from '@fluent-wallet/component-icons'
function Dropdown({overlay, trigger, disabled, placement, children, ...props}) {
  const renderOverlay = () => {
    // rc-dropdown already can process the function of overlay, but we have check logic here.
    // So we need render the element to check and pass back to rc-dropdown.

    let overlayNode
    if (typeof overlay === 'function') {
      overlayNode = overlay()
    } else {
      overlayNode = overlay
    }
    overlayNode = React.Children.only(
      typeof overlayNode === 'string' ? (
        <span>{overlayNode}</span>
      ) : (
        overlayNode
      ),
    )

    const overlayProps = overlayNode.props

    // menu can be selectable and focusable in dropdown by default
    const {selectable = true, focusable = true, expandIcon} = overlayProps
    const overlayNodeExpandIcon =
      typeof expandIcon !== 'undefined' && React.isValidElement(expandIcon) ? (
        expandIcon
      ) : (
        <DownOutlined className="w-4 h-4 text-gray-40" />
      )

    const fixedModeOverlay =
      typeof overlayNode.type === 'string'
        ? overlayNode
        : React.cloneElement(overlayNode, {
            mode: 'vertical',
            className: 'shadow-2 py-2 my-0.5 bg-gray-0 relative',
            selectable,
            focusable,
            expandIcon: overlayNodeExpandIcon,
          })

    return fixedModeOverlay
  }

  const child = React.Children.only(children)

  const dropdownTrigger = React.cloneElement(child, {
    className: `trigger ${child.props.className || ''}`,
    disabled,
  })

  const triggerActions = disabled ? [] : trigger
  let alignPoint
  if (triggerActions && triggerActions.indexOf('contextMenu') !== -1) {
    alignPoint = true
  }

  return (
    <div data-testid="dropdown-wrapper">
      <RcDropdown
        alignPoint={alignPoint}
        animation="slide-up"
        trigger={triggerActions}
        overlay={() => renderOverlay()}
        placement={placement}
        {...props}
      >
        {dropdownTrigger}
      </RcDropdown>
    </div>
  )
}

Dropdown.propTypes = {
  trigger: PropTypes.array,
  overlay: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabled: PropTypes.bool,
  placement: PropTypes.oneOf([
    'topLeft',
    'topCenter',
    'topRight',
    'bottomLeft',
    'bottomCenter',
    'bottomRight',
  ]),
}
Dropdown.defaultProps = {
  placement: 'bottomLeft',
}
export default Dropdown
