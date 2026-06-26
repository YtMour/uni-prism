export const tabs = [
	{ key: 'lists', label: 'Lists', icon: 'list' },
	{ key: 'templates', label: 'Templates', icon: 'book' },
	{ key: 'settings', label: 'Settings', icon: 'settings' }
]

export const checklists = [
	{ name: 'Weekend Lake', date: 'May 24 - May 25', icon: 'shelter', phases: [{ name: 'Pack', done: 8, total: 10 }, { name: 'Setup', done: 6, total: 7 }, { name: 'Leave', done: 2, total: 5 }] },
	{ name: 'Family Glamping', date: 'Jun 6 - Jun 8', icon: 'lantern', phases: [{ name: 'Pack', done: 24, total: 30 }, { name: 'Setup', done: 12, total: 14 }, { name: 'Leave', done: 3, total: 6 }] },
	{ name: 'Solo Bushcraft', date: 'Jun 14 - Jun 16', icon: 'tool', phases: [{ name: 'Pack', done: 15, total: 18 }, { name: 'Setup', done: 9, total: 10 }, { name: 'Leave', done: 1, total: 4 }] }
]

export const templates = [
	{ name: 'Solo Bushcraft', icon: 'shelter', items: 24, weight: '12.4', tags: ['Solo', 'Bushcraft'] },
	{ name: 'Family Glamping', icon: 'camp', items: 78, weight: '38.7', tags: ['Family', 'Comfort'] },
	{ name: 'Ultralight Backpacking', icon: 'pack', items: 36, weight: '7.2', tags: ['Solo', 'Ultralight'] },
	{ name: 'Weekend Camping', icon: 'tent-tree', items: 52, weight: '21.3', tags: ['Group', 'Weekend'] }
]

export const gear = [
	{ name: 'Tent', qty: 1, weight: '2.4 kg', weightValue: '2.4', done: true },
	{ name: 'Tarp', qty: 1, weight: '0.8 kg', weightValue: '0.8', done: true },
	{ name: 'Sleeping Bag', qty: 1, weight: '1.6 kg', weightValue: '1.6', done: true },
	{ name: 'Sleeping Pad', qty: 1, weight: '0.6 kg', weightValue: '0.6', done: true },
	{ name: 'Groundsheet', qty: 1, weight: '0.3 kg', weightValue: '0.3', done: false },
	{ name: 'Pillow', qty: 1, weight: '0.2 kg', weightValue: '0.2', done: false }
]

export const collapsedCategories = [
	{ name: 'Cooking', icon: 'cooking', count: '7 / 9', progress: 78 },
	{ name: 'Gear', icon: 'pack', count: '14 / 18', progress: 76 },
	{ name: 'Clothing', icon: 'shirt', count: '6 / 8', progress: 75 }
]

export const settingsSections = [
	{
		title: 'Preferences',
		items: [
			{ icon: 'ruler', label: 'Units', value: 'Metric' },
			{ icon: 'globe', label: 'Language', value: 'English' },
			{ icon: 'phone', label: 'Haptic feedback', switch: true }
		]
	},
	{
		title: 'Data',
		items: [
			{ icon: 'upload', label: 'Export data' },
			{ icon: 'download', label: 'Import data' },
			{ icon: 'trash', label: 'Reset demo content', danger: true }
		]
	},
	{
		title: 'About',
		items: [
			{ icon: 'shield', label: 'Privacy' },
			{ icon: 'i', label: 'Version', value: '0.1.0' }
		]
	}
]
