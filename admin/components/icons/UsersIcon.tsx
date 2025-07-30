const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg fill="none" height={58} viewBox="0 0 58 58" width={58} {...props}>
      <circle cx={29} cy={29} fill="#18BFFF" r={29} />
      <ellipse
        cx={25.7511}
        cy={22.4998}
        fill="#fff"
        rx={4.33333}
        ry={4.33333}
      />
      <ellipse
        cx={25.7511}
        cy={34.4178}
        fill="#fff"
        rx={7.58333}
        ry={4.33333}
      />
      <path
        d="M38.75 34.417c0 1.795-2.206 3.25-4.898 3.25.793-.867 1.339-1.955 1.339-3.248 0-1.295-.547-2.384-1.342-3.252 2.693 0 4.9 1.455 4.9 3.25zM35.5 22.501a3.25 3.25 0 01-4.364 3.054 6.163 6.163 0 00.805-3.055c0-1.11-.293-2.152-.804-3.053A3.25 3.25 0 0135.5 22.5z"
        fill="#fff"
      />
    </svg>
  )
}

export default UsersIcon
