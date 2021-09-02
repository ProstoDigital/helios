import PropTypes from 'prop-types'

function CompWithLabel({label, children}) {
  return (
    <div className="w-full">
      <span className="text-gray-80 my-3 inline-block">{label}</span>
      {children}
    </div>
  )
}

CompWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default CompWithLabel