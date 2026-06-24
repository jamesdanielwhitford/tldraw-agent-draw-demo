import {
	ArrowDownToolbarItem,
	ArrowLeftToolbarItem,
	ArrowRightToolbarItem,
	ArrowToolbarItem,
	ArrowUpToolbarItem,
	AssetToolbarItem,
	CheckBoxToolbarItem,
	CloudToolbarItem,
	DefaultToolbar,
	DiamondToolbarItem,
	DrawToolbarItem,
	EllipseToolbarItem,
	EraserToolbarItem,
	FrameToolbarItem,
	HandToolbarItem,
	HeartToolbarItem,
	HexagonToolbarItem,
	HighlightToolbarItem,
	LaserToolbarItem,
	LineToolbarItem,
	NoteToolbarItem,
	OvalToolbarItem,
	RectangleToolbarItem,
	RhombusToolbarItem,
	SelectToolbarItem,
	StarToolbarItem,
	TextToolbarItem,
	TldrawUiMenuItem,
	TriangleToolbarItem,
	useIsToolSelected,
	useTools,
	XBoxToolbarItem,
} from 'tldraw'

export function CustomToolbar() {
	const tools = useTools()
	const isAreaCaptureSelected = useIsToolSelected(tools['area-capture'])

	return (
		<DefaultToolbar>
			<SelectToolbarItem />
			<HandToolbarItem />
			<DrawToolbarItem />
			<EraserToolbarItem />
			<ArrowToolbarItem />
			<TextToolbarItem />
			<NoteToolbarItem />
			<AssetToolbarItem />
			<TldrawUiMenuItem {...tools['area-capture']} isSelected={isAreaCaptureSelected} />

			<RectangleToolbarItem />
			<EllipseToolbarItem />
			<TriangleToolbarItem />
			<DiamondToolbarItem />

			<HexagonToolbarItem />
			<OvalToolbarItem />
			<RhombusToolbarItem />
			<StarToolbarItem />

			<CloudToolbarItem />
			<HeartToolbarItem />
			<XBoxToolbarItem />
			<CheckBoxToolbarItem />

			<ArrowLeftToolbarItem />
			<ArrowUpToolbarItem />
			<ArrowDownToolbarItem />
			<ArrowRightToolbarItem />

			<LineToolbarItem />
			<HighlightToolbarItem />
			<LaserToolbarItem />
			<FrameToolbarItem />
		</DefaultToolbar>
	)
}
