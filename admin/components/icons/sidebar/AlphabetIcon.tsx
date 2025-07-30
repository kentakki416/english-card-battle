const AlphabetIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M2.25 7A.75.75 0 013 6.25h10a.75.75 0 010 1.5H3A.75.75 0 012.25 7zm14.25-.75a.75.75 0 01.684.442l4.5 10a.75.75 0 11-1.368.616l-1.437-3.194H14.12l-1.437 3.194a.75.75 0 11-1.368-.616l4.5-10a.75.75 0 01.684-.442zm-1.704 6.364h3.408L16.5 8.828l-1.704 3.786zM2.25 12a.75.75 0 01.75-.75h7a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h5a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default AlphabetIcon
