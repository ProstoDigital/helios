function Folder(props) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24L16.914 11.1479H19.308L24.222 24H21.972L20.802 20.778H15.42L14.25 24H12ZM18.084 13.416L16.05 19.05H20.172L18.156 13.416H18.084ZM14 25H12V26H14V25ZM17 25H19V26H17V25ZM24 25H22V26H24V25Z"
        fill="#C1B6F5"
      />
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="36"
        height="36"
      >
        <rect width="36" height="36" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0)">
        <g filter="url(#filter0_f)">
          <ellipse
            cx="18"
            cy="25.5"
            rx="10"
            ry="2.5"
            fill="#E88784"
            fillOpacity="0.9"
          />
        </g>
        <rect
          x="5"
          y="1"
          width="26"
          height="26"
          rx="4"
          fill="url(#paint0_linear)"
        />
        <rect
          x="11"
          width="14"
          height="3"
          rx="1.5"
          fill="url(#paint1_linear)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.8799 9.26832C18.4399 8.68165 17.5599 8.68165 17.1199 9.26832L16.3169 10.339C16.1741 10.5294 16.0969 10.761 16.0969 10.999V12.7025H19.9029V10.999C19.9029 10.761 19.8258 10.5294 19.6829 10.339L18.8799 9.26832ZM16.0969 16.4056V14.5025H19.9029V16.4056C19.9029 16.9026 20.3059 17.3056 20.8029 17.3056C21.3 17.3056 21.7029 16.9026 21.7029 16.4056V10.999C21.7029 10.3715 21.4994 9.761 21.1229 9.25902L20.3199 8.18832C19.1599 6.64165 16.8399 6.64165 15.6799 8.18832L14.8769 9.25902C14.5004 9.761 14.2969 10.3715 14.2969 10.999V16.4056C14.2969 16.9026 14.6998 17.3056 15.1969 17.3056C15.694 17.3056 16.0969 16.9026 16.0969 16.4056ZM15.1969 18.659C14.6998 18.659 14.2969 19.0619 14.2969 19.559C14.2969 20.056 14.6998 20.459 15.1969 20.459L20.8029 20.459C21.3 20.459 21.7029 20.056 21.7029 19.559C21.7029 19.0619 21.3 18.659 20.8029 18.659H15.1969Z"
          fill="url(#paint2_linear)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f"
          x="0"
          y="15"
          width="36"
          height="21"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="4" result="effect1_foregroundBlur" />
        </filter>
        <linearGradient
          id="paint0_linear"
          x1="21.7917"
          y1="27"
          x2="7.70833"
          y2="-0.625002"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.183001" stopColor="#E27F7C" />
          <stop offset="1" stopColor="#FFA5A3" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="9"
          y1="-0.5"
          x2="8.55146"
          y2="4.46592"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF4F4" />
          <stop offset="1" stopColor="#FFB4B3" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="15.1514"
          y1="7.91016"
          x2="22.5569"
          y2="33.2508"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4D1D1" />
          <stop offset="1" stopColor="#F4D1D1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Folder
