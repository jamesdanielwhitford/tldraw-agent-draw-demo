import {
	DefaultHelperButtons,
	DefaultHelperButtonsContent,
	TldrawUiMenuContextProvider,
} from 'tldraw'
import { GoToAgentButtons } from './GoToAgentButton'
import { SpeechToCanvasHook } from './SpeechToCanvasHook'

export function CustomHelperButtons() {
	return (
		<DefaultHelperButtons>
			<TldrawUiMenuContextProvider type="helper-buttons" sourceId="helper-buttons">
				<DefaultHelperButtonsContent />
				<GoToAgentButtons />
				<SpeechToCanvasHook />
			</TldrawUiMenuContextProvider>
		</DefaultHelperButtons>
	)
}
