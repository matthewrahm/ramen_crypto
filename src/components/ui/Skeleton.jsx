export default function Skeleton({ className = '', width, height }) {
  return (
    <div
      className={`skeleton-pulse rounded-lg bg-bg-elevated ${className}`}
      style={{ width, height }}
    />
  )
}
