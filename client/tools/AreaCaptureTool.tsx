import { BoxModel, StateNode, VecModel } from 'tldraw'
import { startCaptureSession } from '../capture/captureSession'

export class AreaCaptureTool extends StateNode {
	static override id = 'area-capture'
	static override initial = 'idle'
	static override children() {
		return [AreaCaptureIdle, AreaCapturePointing, AreaCaptureDragging]
	}

	override isLockable = false

	override onEnter() {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}

	override onExit() {
		this.editor.setCursor({ type: 'default', rotation: 0 })
	}

	override onInterrupt() {
		this.complete()
	}

	override onCancel() {
		this.complete()
	}

	private complete() {
		this.transition('idle', {})
	}
}

class AreaCaptureIdle extends StateNode {
	static override id = 'idle'

	override onPointerDown() {
		this.parent.transition('pointing')
	}
}

class AreaCapturePointing extends StateNode {
	static override id = 'pointing'

	private initialScreenPoint: VecModel | undefined = undefined
	private initialPagePoint: VecModel | undefined = undefined

	override onEnter() {
		this.initialScreenPoint = this.editor.inputs.getCurrentScreenPoint().clone()
		this.initialPagePoint = this.editor.inputs.getCurrentPagePoint().clone()
	}

	override onPointerMove() {
		if (!this.initialScreenPoint) return
		if (this.editor.inputs.getIsDragging()) {
			this.parent.transition('dragging', { initialPagePoint: this.initialPagePoint })
		}
	}

	override onPointerUp() {
		this.parent.transition('idle')
	}
}

class AreaCaptureDragging extends StateNode {
	static override id = 'dragging'

	private initialPagePoint: VecModel | undefined = undefined
	private bounds: BoxModel | undefined = undefined

	override onEnter(props: { initialPagePoint: VecModel }) {
		this.initialPagePoint = props.initialPagePoint
		this.updateBounds()
	}

	override onPointerMove() {
		this.updateBounds()
	}

	override onPointerUp() {
		this.editor.updateInstanceState({
			brush: null,
		})

		if (!this.bounds) throw new Error('Bounds not set')
		// Starting a new capture auto-stops any session still recording (queuing it)
		// and begins recording for this one.
		startCaptureSession(this.bounds)
		this.parent.transition('idle')
	}

	updateBounds() {
		if (!this.initialPagePoint) return
		const currentPagePoint = this.editor.inputs.getCurrentPagePoint()
		const x = Math.min(this.initialPagePoint.x, currentPagePoint.x)
		const y = Math.min(this.initialPagePoint.y, currentPagePoint.y)
		const w = Math.abs(currentPagePoint.x - this.initialPagePoint.x)
		const h = Math.abs(currentPagePoint.y - this.initialPagePoint.y)

		this.editor.updateInstanceState({
			brush: { x, y, w, h },
		})

		this.bounds = { x, y, w, h }
	}
}
