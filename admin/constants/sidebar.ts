import AlphabetIcon from "../components/icons/sidebar/AlphabetIcon"
import AuthenticationIcon from "../components/icons/sidebar/AuthenticationIcon"
import CalendarIcon from "../components/icons/sidebar/CalendarIcon"
import FourCircleIcon from "../components/icons/sidebar/FourCircleIcon"
import HomeIcon from "../components/icons/sidebar/HomeIcon"
import PieChartIcon from "../components/icons/sidebar/PieChartIcon"
import TableIcon from "../components/icons/sidebar/TableIcon"
import UserIcon from "../components/icons/sidebar/UserIcon"

export const SIDEBAR_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: CalendarIcon,
        items: [],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: UserIcon,
        items: [],
      },
      {
        title: "Forms",
        icon: AlphabetIcon,
        items: [
          {
            title: "Form Elements",
            url: "/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Tables",
        url: "/tables",
        icon: TableIcon,
        items: [
          {
            title: "Tables",
            url: "/tables",
          },
        ],
      },
      {
        title: "Pages",
        icon: AlphabetIcon,
        items: [
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: PieChartIcon,
        items: [
          {
            title: "Basic Chart",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: FourCircleIcon,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: AuthenticationIcon,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
]
