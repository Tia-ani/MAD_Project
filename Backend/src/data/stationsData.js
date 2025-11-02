export const stationsData = [
    {
      id: "st1",
      name: "Central Station",
      coords: { latitude: 28.6139, longitude: 77.209 },
      description: "Main hub of the metro system, busiest during rush hours.",
      accessibility: {
        wheelchair: true,
        elevators: true,
        tactilePaving: true,
        audioAnnouncements: true,
        brailleSignage: true,
      },
      issues: ["Escalator under maintenance"],
    },
    {
      id: "st2",
      name: "Tech Park",
      coords: { latitude: 28.544, longitude: 77.192 },
      description: "Near major IT offices, high traffic during work hours.",
      accessibility: {
        wheelchair: true,
        elevators: true,
        tactilePaving: false,
        audioAnnouncements: true,
        brailleSignage: false,
      },
      issues: [],
    },
    {
      id: "st3",
      name: "City Mall",
      coords: { latitude: 28.608, longitude: 77.215 },
      description: "Close to a shopping district and food court.",
      accessibility: {
        wheelchair: true,
        elevators: false,
        tactilePaving: true,
        audioAnnouncements: false,
        brailleSignage: true,
      },
      issues: ["Elevator temporarily closed"],
    },
  ];
  