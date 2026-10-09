# 🏏 WicketWise

Welcome to WicketWise! Have you ever stared at a fantasy cricket lineup and wondered, _"Should I pick Devon Conway on a spin-friendly Chepauk deck, or take a gamble on Rohit Sharma?"_

That is exactly why I built this.

WicketWise is a fully autonomous AI Fantasy Assistant built from scratch using Next.js, LangGraph, and Groq. It doesn't just hallucinate text—it uses an agentic state machine to actively execute local tools, pull pitch reports, review team form, and analyze squad dynamics to give you the ultimate fantasy edge.

## ✨ What makes it tick?

- **The Brain**: Powered by the blazing fast `llama-3.3-70b-versatile` open-source model via the Groq API.
- **LangGraph Architecture**: We ditched boring, rigid `while` loops in favor of a smart LangChain `StateGraph`. The agent sequentially decides which tools to run, remembers the context, and knows exactly when it has enough data to stop checking and start answering.
- **Model Context Protocol (MCP)**: The analytical tools aren't just locked to the web UI! They are mirrored on a decoupled MCP server, meaning you can plug WicketWise's data directly into Claude Desktop or other modern agent workflows.
- **Sleek Next.js UI**: A beautiful, fully responsive chat interface built with Tailwind CSS.

## 🚀 Getting Started

If you want to spin this up locally and ask it about your own fantasy squads:

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Supply the Magic**
   Create a `.env` file in the root directory and drop your Groq key inside:

   ```env
   GROQ_API_KEY=your_api_key_here
   ```

3. **Run the Web App**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) and start chatting with the Oracle!

## 🛠️ The MCP Server

If you're an AI nerd and just want to run the underlying data tools decoupled from the web UI, you can spin up the MCP server directly over standard IO to test dynamic discovery:

```bash
npx tsx lib/agent/mcp-server.ts
```

## 📜 License

This project is open-sourced under the **MIT License**. Feel free to fork it, break it, build your own tools, and craft the ultimate sports analytics scout!
