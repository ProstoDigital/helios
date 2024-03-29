import PropTypes from 'prop-types'

function CreateTypeItem({
  title,
  subTitle = '',
  Icon,
  Tag,
  onClick,
  typeClass = '',
  ...props
}) {
  return (
    <div
      className={`flex bg-white cursor-pointer box-border p-3 mb-3 rounded ${typeClass}`}
      aria-hidden="true"
      {...props}
      onClick={() => {
        onClick && onClick()
      }}
    >
      {Icon}
      <div className="ml-2 text-sm">
        <div className="flex items-center">
          <span className="text-gray-80 font-medium">{title}</span>
          {Tag && <Tag />}
        </div>
        <div className="text-xs text-gray-40 mt-0.5">{subTitle}</div>
      </div>
    </div>
  )
}
CreateTypeItem.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  Icon: PropTypes.element,
  Tag: PropTypes.elementType,
  typeClass: PropTypes.string,
}
export default CreateTypeItem
