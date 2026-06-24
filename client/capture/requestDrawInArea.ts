import { BoxModel } from 'tldraw'
import type { TldrawAgent } from '../agent/TldrawAgent'

/**
 * Marker phrase (kept in sync with the "Drawing inside a captured area" prompt
 * section in worker/prompt/sections/rules-section.ts) that tells the model this
 * is a captured-area request and how to treat the spoken text.
 */
function buildAreaMessage(text: string): string {
	return (
		`CAPTURED AREA REQUEST. The user selected a rectangular region on the canvas and spoke the request below. ` +
		`Fill that region with an appropriate drawing (an area context item gives the exact bounds).\n\n` +
		`First assess the request and choose the visual form that fits it best — do not assume it needs a diagram:\n` +
		`- A specific named drawing (e.g. "draw a red circle", "a flowchart for login"): draw exactly that.\n` +
		`- A single object or illustration when the request centres on one thing (e.g. "what is a neuron"): draw that one thing well, not a multi-box diagram.\n` +
		`- A diagram when the request describes structure, a process, a comparison, or several related parts (e.g. "today I'll cover what an LLM is, its pros and cons, and its uses"): labelled nodes, arrows, short keyword labels.\n` +
		`- A chart for quantitative or comparative content.\n` +
		`- Literal text ONLY if the user explicitly asks for specific words (e.g. "write 'Sale ends Friday'").\n` +
		`Match the amount you draw to the content: a simple request gets a simple clean result; do NOT dump the spoken sentence verbatim as a block of text.\n\n` +
		`Build the COMPLETE result, creating every shape it needs (all of a diagram's nodes, labels, and arrows), inside the selected region.\n\n` +
		`Spoken request: "${text}"`
	)
}

/** Switch the agent to `mode` only if it isn't already there. `setMode` throws
 * if asked to re-enter the current mode (AgentModeManager.setMode). */
function ensureMode(agent: TldrawAgent, mode: 'working' | 'idling'): void {
	if (agent.mode.getCurrentModeType() !== mode) {
		agent.mode.setMode(mode)
	}
}

/**
 * Ask the agent to draw `text` inside `bounds`, driving it to a complete result.
 *
 * Uses the full agentic `agent.prompt` loop, NOT the single-turn `agent.request`.
 * `prompt` keeps taking turns on its own until the model has nothing more to add
 * (see TldrawAgent.prompt), so the model finishes the whole drawing in one call.
 * This was confirmed empirically with google/gemini-2.5-flash: a single prompt
 * produces a complete, in-bounds result, so the previous hand-rolled
 * continue-loop + linter passes (which compensated for a weaker model on the
 * single-turn path) are no longer needed.
 *
 * `agent.prompt` drives its own mode (working while running, back to idling when
 * done), so we only nudge the mode when it isn't already where we want it. Always
 * calling setMode would throw "Agent is already in mode: ..." (it rejects
 * re-entering the current mode).
 */
export async function requestDrawInArea(
	agent: TldrawAgent,
	text: string,
	bounds: BoxModel
): Promise<void> {
	const area = { type: 'area' as const, bounds, source: 'user' as const }
	ensureMode(agent, 'working')
	try {
		await agent.prompt({ message: buildAreaMessage(text), contextItems: [area] })
		console.log('[capture] draw complete')
	} finally {
		ensureMode(agent, 'idling')
	}
}
