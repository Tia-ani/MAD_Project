export const stationsData = [
    {
      id: "pune_jn",
      name: "Pune Junction Railway Station",
      coords: { latitude: 18.5286, longitude: 73.8745 },
      description: "Main railway station with multiple platforms and accessibility features",
      accessibility: {
        wheelchair: true,
        elevators: true,
        tactilePaving: true,
        audioAnnouncements: true,
        brailleSignage: true,
      },
      issues: []
    },
    {
      id: "shivajinagar",
      name: "Shivajinagar Railway Station",
      coords: { latitude: 18.5331, longitude: 73.854 },
      description: "Suburban railway station with basic accessibility features",
      accessibility: {
        wheelchair: true,
        elevators: false,
        tactilePaving: false,
        audioAnnouncements: true,
        brailleSignage: false,
      },
      issues: ["Elevator under maintenance", "Poor lighting on platform 2"]
    },
    {
      id: "swargate_bus",
      name: "Swargate Bus Terminal",
      coords: { latitude: 18.5057, longitude: 73.8562 },
      description: "Main bus terminal with wheelchair accessibility",
      accessibility: {
        wheelchair: true,
        elevators: false,
        tactilePaving: true,
        audioAnnouncements: false,
        brailleSignage: true,
      },
      issues: []
    },
    {
      id: "pune_metro_civilcourt",
      name: "Civil Court Metro Station",
      coords: { latitude: 18.5312, longitude: 73.8585 },
      description: "Modern metro station with full accessibility features",
      accessibility: {
        wheelchair: true,
        elevators: true,
        tactilePaving: true,
        audioAnnouncements: true,
        brailleSignage: true,
      },
      issues: []
    },
    {
      id: "vanaz_metro",
      name: "Vanaz Metro Station",
      coords: { latitude: 18.5072, longitude: 73.8073 },
      description: "Metro station with elevators and tactile features",
      accessibility: {
        wheelchair: true,
        elevators: true,
        tactilePaving: true,
        audioAnnouncements: true,
        brailleSignage: false,
      },
      issues: []
    },
    {
      id: "pcmc_metro",
      name: "PCMC Metro Station",
      coords: { latitude: 18.6281, longitude: 73.7997 },
      description: "Metro station with accessible toilets and elevators",
      accessibility: {
        wheelchair: true,
        elevators: true,
        tactilePaving: true,
        audioAnnouncements: true,
        brailleSignage: true,
      },
      issues: []
    },
    {
      id: "katraj_bus",
      name: "Katraj Bus Depot",
      coords: { latitude: 18.4575, longitude: 73.8652 },
      description: "Bus depot with wheelchair ramps",
      accessibility: {
        wheelchair: true,
        elevators: false,
        tactilePaving: false,
        audioAnnouncements: false,
        brailleSignage: false,
      },
      issues: ["Ramp surface damaged"]
    },
    {
      id: "airport",
      name: "Pune International Airport (Lohegaon)",
      coords: { latitude: 18.5814, longitude: 73.9207 },
      description: "International airport with comprehensive accessibility features",
      accessibility: {
        wheelchair: true,
        elevators: true,
        tactilePaving: true,
        audioAnnouncements: true,
        brailleSignage: true,
      },
      issues: []
    },
    {
      id: "hadapsar_bus",
      name: "Hadapsar Gadital Bus Stand",
      coords: { latitude: 18.4974, longitude: 73.926 },
      description: "Bus stand with limited accessibility features",
      accessibility: {
        wheelchair: false,
        elevators: false,
        tactilePaving: false,
        audioAnnouncements: false,
        brailleSignage: false,
      },
      issues: ["No wheelchair access", "Poor lighting", "No audio announcements"]
    },
    {
      id: "kothrud_bus",
      name: "Kothrud Depot",
      coords: { latitude: 18.5077, longitude: 73.8072 },
      description: "Bus depot with accessible entry ramps",
      accessibility: {
        wheelchair: true,
        elevators: false,
        tactilePaving: false,
        audioAnnouncements: false,
        brailleSignage: false,
      },
      issues: []
    }
  ];
  