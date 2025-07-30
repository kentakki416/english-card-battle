import * as logos from "../../public/logos"

export const getOverviewData = async () => {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    views: {
      value: 3456,
      growthRate: 0.43,
    },
    profit: {
      value: 4220,
      growthRate: 4.35,
    },
    products: {
      value: 3456,
      growthRate: 2.59,
    },
    users: {
      value: 3456,
      growthRate: -0.95,
    },
  }
}

export const getChatsData = async () => {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ]
}

export const getPaymentsOverviewData = async (
  timeFrame?: "monthly" | "yearly" | (string & {}),
) => {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (timeFrame === "yearly") {
    return {
      received: [
        { x: 2020, y: 450 },
        { x: 2021, y: 620 },
        { x: 2022, y: 780 },
        { x: 2023, y: 920 },
        { x: 2024, y: 1080 },
      ],
      due: [
        { x: 2020, y: 1480 },
        { x: 2021, y: 1720 },
        { x: 2022, y: 1950 },
        { x: 2023, y: 2300 },
        { x: 2024, y: 1200 },
      ],
    }
  }

  return {
    received: [
      { x: "Jan", y: 0 },
      { x: "Feb", y: 20 },
      { x: "Mar", y: 35 },
      { x: "Apr", y: 45 },
      { x: "May", y: 35 },
      { x: "Jun", y: 55 },
      { x: "Jul", y: 65 },
      { x: "Aug", y: 50 },
      { x: "Sep", y: 65 },
      { x: "Oct", y: 75 },
      { x: "Nov", y: 60 },
      { x: "Dec", y: 75 },
    ],
    due: [
      { x: "Jan", y: 15 },
      { x: "Feb", y: 9 },
      { x: "Mar", y: 17 },
      { x: "Apr", y: 32 },
      { x: "May", y: 25 },
      { x: "Jun", y: 68 },
      { x: "Jul", y: 80 },
      { x: "Aug", y: 68 },
      { x: "Sep", y: 84 },
      { x: "Oct", y: 94 },
      { x: "Nov", y: 74 },
      { x: "Dec", y: 62 },
    ],
  }
}

export const getWeeksProfitData = async (timeFrame?: string) => {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (timeFrame === "last week") {
    return {
      sales: [
        { x: "Sat", y: 33 },
        { x: "Sun", y: 44 },
        { x: "Mon", y: 31 },
        { x: "Tue", y: 57 },
        { x: "Wed", y: 12 },
        { x: "Thu", y: 33 },
        { x: "Fri", y: 55 },
      ],
      revenue: [
        { x: "Sat", y: 10 },
        { x: "Sun", y: 20 },
        { x: "Mon", y: 17 },
        { x: "Tue", y: 7 },
        { x: "Wed", y: 10 },
        { x: "Thu", y: 23 },
        { x: "Fri", y: 13 },
      ],
    }
  }

  return {
    sales: [
      { x: "Sat", y: 44 },
      { x: "Sun", y: 55 },
      { x: "Mon", y: 41 },
      { x: "Tue", y: 67 },
      { x: "Wed", y: 22 },
      { x: "Thu", y: 43 },
      { x: "Fri", y: 65 },
    ],
    revenue: [
      { x: "Sat", y: 13 },
      { x: "Sun", y: 23 },
      { x: "Mon", y: 20 },
      { x: "Tue", y: 8 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 27 },
      { x: "Fri", y: 15 },
    ],
  }
}


export async function getDevicesUsedData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const data = [
    {
      name: "Desktop",
      percentage: 0.65,
      amount: 1625,
    },
    {
      name: "Tablet",
      percentage: 0.1,
      amount: 250,
    },
    {
      name: "Mobile",
      percentage: 0.2,
      amount: 500,
    },
    {
      name: "Unknown",
      percentage: 0.05,
      amount: 125,
    },
  ]

  if (timeFrame === "yearly") {
    data[0].amount = 19500
    data[1].amount = 3000
    data[2].amount = 6000
    data[3].amount = 1500
  }

  return data
}

export const getTopChannels = async () => {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.google,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.x,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.github,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.vimeo,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.facebook,
    },
  ]
}
