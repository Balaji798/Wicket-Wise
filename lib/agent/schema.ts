// lib/agent/schema.ts

export const tools = [
  {
    type: "function",
    function: {
      name: "get_match_squads",
      description:
        "Return the available squads and venue for a fixture. Call this FIRST.",
      parameters: {
        type: "object",
        properties: {
          match: {
            type: "string",
            description: "The name of the match, e.g. 'CSK vs MI'",
          },
        },
        required: ["match"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_player_stats",
      description:
        "Return recent form and fantasy stats for ONE player. Accepts a full name or a last name.",
      parameters: {
        type: "object",
        properties: {
          player: {
            type: "string",
            description:
              "The name or last name of the player, e.g. 'Gaikwad' or 'MS Dhoni'",
          },
        },
        required: ["player"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_form",
      description:
        "Return a short scouting note on a team's current form, injuries and in-form players.",
      parameters: {
        type: "object",
        properties: {
          team: {
            type: "string",
            description: "Short code for the team, e.g. 'CSK' or 'MI'",
          },
        },
        required: ["team"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_pitch_report",
      description: "Return the pitch and weather report for a venue.",
      parameters: {
        type: "object",
        properties: {
          venue: {
            type: "string",
            description: "The full venue name or a keyword like 'Chepauk'",
          },
        },
        required: ["venue"],
      },
    },
  },
];
