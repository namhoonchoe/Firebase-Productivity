import React from 'react'

export default function SeeArchiveIcon({
    width = 24,
    height = 24,
    fill = "#fff",
  }: IconProps) {
  return (
    <svg
    width={width}
    height={height}
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0 flex-grow-0"
    preserveAspectRatio="none"
  >
    <path
      d="M13.4089 0.274725C12.5053 -0.091575 11.4947 -0.091575 10.5911 0.274725L3.09252 3.3147C2.43211 3.58243 2 4.22388 2 4.9365V9.3624C2.46553 9.1244 2.96945 8.9508 3.5 8.8534V5.51151L11.2503 8.5255L11.25 18.5378L11.4874 18.7753C11.7038 18.9916 11.8517 19.2505 11.931 19.5251C12.4325 19.5343 12.9354 19.4429 13.4089 19.251L20.9075 16.211C21.5679 15.9433 22 15.3018 22 14.5892V4.9365C22 4.22388 21.5679 3.58243 20.9075 3.3147L13.4089 0.274725ZM11.1547 1.66483C11.6968 1.44506 12.3032 1.44506 12.8453 1.66483L19.437 4.33714L16.7678 5.36776L9.24097 2.44065L11.1547 1.66483ZM7.21472 3.26211L14.6911 6.16959L12.0013 7.20815L4.59029 4.32608L7.21472 3.26211ZM20.3439 14.8209L12.8453 17.8609C12.8139 17.8736 12.7822 17.8856 12.7503 17.8969V8.5269L20.5 5.53464V14.5892C20.5 14.691 20.4383 14.7826 20.3439 14.8209ZM4.5 18.7627C5.47187 18.7627 6.37179 18.4546 7.1074 17.9308L9.71967 20.543C10.0126 20.8359 10.4874 20.8359 10.7803 20.543C11.0732 20.2501 11.0732 19.7753 10.7803 19.4824L8.16806 16.8701C8.69191 16.1345 9 15.2346 9 14.2627C9 11.7774 6.98528 9.7627 4.5 9.7627C2.01472 9.7627 0 11.7774 0 14.2627C0 16.748 2.01472 18.7627 4.5 18.7627ZM4.5 17.2627C2.84315 17.2627 1.5 15.9196 1.5 14.2627C1.5 12.6058 2.84315 11.2627 4.5 11.2627C6.15685 11.2627 7.5 12.6058 7.5 14.2627C7.5 15.9196 6.15685 17.2627 4.5 17.2627Z"
      fill={fill}
    />
  </svg>
  )
}
