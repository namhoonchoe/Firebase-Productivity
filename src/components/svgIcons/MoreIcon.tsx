import React from "react";

export default function MoreIcon({
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
    >
      <path
        d="M7.75 12C7.75 12.9665 6.9665 13.75 6 13.75C5.0335 13.75 4.25 12.9665 4.25 12C4.25 11.0335 5.0335 10.25 6 10.25C6.9665 10.25 7.75 11.0335 7.75 12ZM13.75 12C13.75 12.9665 12.9665 13.75 12 13.75C11.0335 13.75 10.25 12.9665 10.25 12C10.25 11.0335 11.0335 10.25 12 10.25C12.9665 10.25 13.75 11.0335 13.75 12ZM18 13.75C18.9665 13.75 19.75 12.9665 19.75 12C19.75 11.0335 18.9665 10.25 18 10.25C17.0335 10.25 16.25 11.0335 16.25 12C16.25 12.9665 17.0335 13.75 18 13.75Z"
        fill={fill}
      />
    </svg>
  );
}