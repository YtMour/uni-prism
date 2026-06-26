export const templateCatalog = [
	{
		id: 'solo-bushcraft',
		name: 'Solo Bushcraft',
		icon: 'shelter',
		tags: ['Solo', 'Bushcraft'],
		items: [
			{ name: 'Tarp shelter', category: 'Shelter', icon: 'shelter', qty: 1, weightGrams: 820, critical: true, notes: 'Use with ridgeline kit.' },
			{ name: 'Bivy sack', category: 'Shelter', icon: 'shelter', qty: 1, weightGrams: 510, critical: true, notes: 'Check waterproof seam.' },
			{ name: 'Wool blanket', category: 'Clothing', icon: 'shirt', qty: 1, weightGrams: 1300, critical: true, notes: 'Cold night backup.' },
			{ name: 'Fire steel', category: 'Fire Tools', icon: 'fire', qty: 1, weightGrams: 55, critical: true, notes: 'Keep dry.' },
			{ name: 'Fixed blade knife', category: 'Gear', icon: 'tool', qty: 1, weightGrams: 230, critical: true, notes: 'Local regulations apply.' },
			{ name: 'Water filter', category: 'Hydration', icon: 'water', qty: 1, weightGrams: 90, critical: true, notes: 'Backflush before trip.' },
			{ name: 'Titanium pot', category: 'Cooking', icon: 'cooking', qty: 1, weightGrams: 160, critical: false, notes: 'Nested with stove.' },
			{ name: 'Headlamp', category: 'Safety', icon: 'alert', qty: 1, weightGrams: 92, critical: true, notes: 'Fresh batteries.' }
		]
	},
	{
		id: 'family-glamping',
		name: 'Family Glamping',
		icon: 'camp',
		tags: ['Family', 'Comfort'],
		items: [
			{ name: 'Cabin tent', category: 'Shelter', icon: 'shelter', qty: 1, weightGrams: 8200, critical: true, notes: 'Include poles and stakes.' },
			{ name: 'Ground tarp', category: 'Shelter', icon: 'shelter', qty: 1, weightGrams: 1400, critical: true, notes: 'Sized for tent footprint.' },
			{ name: 'Double air mattress', category: 'Shelter', icon: 'shelter', qty: 2, weightGrams: 3600, critical: false, notes: 'Pump charged.' },
			{ name: 'Camp kitchen bin', category: 'Cooking', icon: 'cooking', qty: 1, weightGrams: 4200, critical: true, notes: 'Utensils, soap, towel.' },
			{ name: 'Cooler', category: 'Cooking', icon: 'cooking', qty: 1, weightGrams: 5200, critical: true, notes: 'Ice packs frozen.' },
			{ name: 'Lantern', category: 'Gear', icon: 'lantern', qty: 2, weightGrams: 640, critical: true, notes: 'USB charged.' },
			{ name: 'First aid kit', category: 'Safety', icon: 'alert', qty: 1, weightGrams: 520, critical: true, notes: 'Medication checked.' },
			{ name: 'Water jug', category: 'Hydration', icon: 'water', qty: 2, weightGrams: 5000, critical: true, notes: 'Fill before arrival.' }
		]
	},
	{
		id: 'ultralight-backpacking',
		name: 'Ultralight Backpacking',
		icon: 'pack',
		tags: ['Solo', 'Ultralight'],
		items: [
			{ name: 'Dyneema tent', category: 'Shelter', icon: 'shelter', qty: 1, weightGrams: 595, critical: true, notes: 'Stakes counted.' },
			{ name: 'Quilt', category: 'Shelter', icon: 'shelter', qty: 1, weightGrams: 640, critical: true, notes: 'Rated for forecast.' },
			{ name: 'Inflatable pad', category: 'Shelter', icon: 'shelter', qty: 1, weightGrams: 340, critical: true, notes: 'Patch kit packed.' },
			{ name: 'Canister stove', category: 'Cooking', icon: 'cooking', qty: 1, weightGrams: 73, critical: true, notes: 'Fuel separate.' },
			{ name: 'Filter bottle', category: 'Hydration', icon: 'water', qty: 1, weightGrams: 120, critical: true, notes: 'Flow tested.' },
			{ name: 'Rain shell', category: 'Clothing', icon: 'shirt', qty: 1, weightGrams: 185, critical: true, notes: 'Accessible pocket.' },
			{ name: 'Battery bank', category: 'Gear', icon: 'phone', qty: 1, weightGrams: 152, critical: false, notes: 'Fully charged.' },
			{ name: 'Mini first aid', category: 'Safety', icon: 'alert', qty: 1, weightGrams: 96, critical: true, notes: 'Blister kit included.' }
		]
	}
]

