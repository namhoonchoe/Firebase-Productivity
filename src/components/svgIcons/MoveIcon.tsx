import React from "react";

export default function MoveIcon({
  width = 24,
  height = 24,
  fill = "#fff",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 flex-grow-0"
      preserveAspectRatio="none"
    >
      <path
        d="M0.5 1C0.5 0.861932 0.611932 0.75 0.75 0.75H16.25C16.3881 0.75 16.5 0.861937 16.5 1C16.5 1.13806 16.3881 1.25 16.25 1.25H0.75C0.611932 1.25 0.5 1.13807 0.5 1ZM0.5 13C0.5 12.8619 0.611937 12.75 0.75 12.75H13.25C13.3881 12.75 13.5 12.8619 13.5 13C13.5 13.1381 13.3881 13.25 13.25 13.25H0.75C0.611937 13.25 0.5 13.1381 0.5 13ZM0.5 7C0.5 6.86194 0.611937 6.75 0.75 6.75H19.25C19.3881 6.75 19.5 6.86194 19.5 7C19.5 7.13806 19.3881 7.25 19.25 7.25H0.75C0.611937 7.25 0.5 7.13806 0.5 7Z"
        fill={fill}
        stroke="white"
      />
    </svg>
  );
}
