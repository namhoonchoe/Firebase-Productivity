import React from 'react'

export default function EsIcon({
    width = 24,
    height = 24,
    fill = "#fff",
  }: IconProps) {
  return (
    <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="relative h-6 w-6 flex-shrink-0 flex-grow-0"
    preserveAspectRatio="none"
  >
    <path
      d="M20.9519 3.04712C19.5543 1.6496 17.2885 1.64967 15.8911 3.04727L3.94103 14.9987C3.5347 15.4051 3.2491 15.9162 3.116 16.4753L2.02041 21.0767C1.96009 21.3301 2.03552 21.5966 2.21968 21.7808C2.40385 21.9649 2.67037 22.0404 2.92373 21.98L7.52498 20.8845C8.08418 20.7514 8.59546 20.4656 9.00191 20.0591L18.9995 10.0604C19.6777 10.7442 19.676 11.8484 18.9943 12.5301L17.2109 14.3135C16.918 14.6064 16.918 15.0812 17.2109 15.3741C17.5038 15.667 17.9786 15.667 18.2715 15.3741L20.055 13.5907C21.3224 12.3233 21.3242 10.2693 20.0601 8.99967L20.952 8.10763C22.3493 6.71015 22.3493 4.44453 20.9519 3.04712ZM16.9518 4.10787C17.7634 3.29611 19.0795 3.29607 19.8912 4.10778C20.7028 4.91942 20.7029 6.23534 19.8913 7.04704L7.94119 18.9985C7.73104 19.2087 7.46668 19.3564 7.17755 19.4253L3.76191 20.2385L4.57521 16.8227C4.64402 16.5337 4.79168 16.2694 5.00175 16.0593L16.9518 4.10787Z"
      fill={fill}
    />
    <path
      d="M20.9519 3.04712C19.5543 1.6496 17.2885 1.64967 15.8911 3.04727L3.94103 14.9987C3.5347 15.4051 3.2491 15.9162 3.116 16.4753L2.02041 21.0767C1.96009 21.3301 2.03552 21.5966 2.21968 21.7808C2.40385 21.9649 2.67037 22.0404 2.92373 21.98L7.52498 20.8845C8.08418 20.7514 8.59546 20.4656 9.00191 20.0591L18.9995 10.0604C19.6777 10.7442 19.676 11.8484 18.9943 12.5301L17.2109 14.3135C16.918 14.6064 16.918 15.0812 17.2109 15.3741C17.5038 15.667 17.9786 15.667 18.2715 15.3741L20.055 13.5907C21.3224 12.3233 21.3242 10.2693 20.0601 8.99967L20.952 8.10763C22.3493 6.71015 22.3493 4.44453 20.9519 3.04712ZM16.9518 4.10787C17.7634 3.29611 19.0795 3.29607 19.8912 4.10778C20.7028 4.91942 20.7029 6.23534 19.8913 7.04704L7.94119 18.9985C7.73104 19.2087 7.46668 19.3564 7.17755 19.4253L3.76191 20.2385L4.57521 16.8227C4.64402 16.5337 4.79168 16.2694 5.00175 16.0593L16.9518 4.10787Z"
      fill={fill}
    />
  </svg>
  )
}
