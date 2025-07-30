const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height={20}
      viewBox="0 0 20 20"
      width={20}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M9.18 2.334a7.71 7.71 0 108.485 8.485A6.042 6.042 0 119.18 2.335zM1.042 10a8.958 8.958 0 018.958-8.958c.598 0 .896.476.948.855.049.364-.086.828-.505 1.082a4.792 4.792 0 106.579 6.579c.253-.42.717-.555 1.081-.506.38.052.856.35.856.948A8.958 8.958 0 011.04 10z"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default MoonIcon
