<script lang="ts">
	import { page } from '$app/stores';

	import type { TabState, WindowsState } from '$lib/types';
	import MultiTabbedWindow from '$lib/MultiTabbedWindow.svelte';

	//let tabStates: TabState<{ createdAt: Date }>[] = [
	//  { title: 'acorn', createdAt: new Date() },
	//  { title: 'esprima', createdAt: new Date() },
	//  //
	//  { title: '+', createdAt: new Date() },
	//];

	function normalizeTabState(tabState: TabState): TabState {
		return {
			...tabState,
			createdAt: tabState.createdAt ?? new Date()
		};
	}

	const sampleData = [
		[],
		//windowStates1, windowStates2, windowStates3, windowStates4, windowStates5,
		// single window w/ two tabs [ [acorn, esprima] ]
		[{ title: 'acorn' }, { title: 'esprima' }].map(normalizeTabState),
		// two horizontal windows, each single tabs [ [acorn] | [esprima] ]
		[
			'row',
			[
				[{ title: 'acorn' }].map(normalizeTabState),
				[{ title: 'esprima' }, { title: 'bcorn' }].map(normalizeTabState)
			]
		],
		// three vertical windows
		// [
		//   [acorn]  ,
		//   [espriam],
		//   [esprima],
		// ]
		[
			'column',
			[
				[{ title: 'acorn' }].map(normalizeTabState),
				[{ title: 'esprima' }].map(normalizeTabState),
				[{ title: 'esprima' }].map(normalizeTabState)
			]
		],
		// all four
		// [
		//   [acorn (2)], | [esprima (2)]
		//   [esprima]  , | [acorn (2)]
		//   [ccorn]    , |
		// ]
		[
			'row',
			[
				[
					'column',
					[
						[{ title: 'acorn' }, { title: 'bcorn' }].map(normalizeTabState),
						[{ title: 'esprima' }].map(normalizeTabState),
						[{ title: 'ccorn' }].map(normalizeTabState)
					]
				],
				[
					'column',
					[
						[{ title: 'esprima' }, { title: 'espresso' }].map(normalizeTabState),
						[{ title: 'acorn' }, { title: 'ccorn' }].map(normalizeTabState)
					]
				]
			]
		],
		[
			'row',
			[
				[
					'column',
					[
						[{ title: 'acorn' }, { title: 'bcorn' }].map(normalizeTabState),
						[{ title: 'esprima' }].map(normalizeTabState),
						[{ title: 'ccorn' }].map(normalizeTabState)
					]
				],
				[
					'column',
					[
						[{ title: 'esprima' }, { title: 'espresso' }].map(normalizeTabState),
						[{ title: 'acorn' }, { title: 'ccorn' }].map(normalizeTabState)
					]
				],
				[
					'column',
					[
						[{ title: 'esprima' }, { title: 'espresso' }].map(normalizeTabState),
						[{ title: 'acorn' }, { title: 'ccorn' }].map(normalizeTabState)
					]
				]
			]
		]
	];

	let sampleIndex = parseInt($page.url.searchParams.get('sample') ?? '1');
	$: selectedData = sampleData[sampleIndex];

	// replace url with new sample. convenient for refreshing page.
	function changeRoute(ev: Event) {
		//console.log('rags:', ev);
		const newUrl = new URL($page.url);
		newUrl.searchParams.set('sample', String(sampleIndex));
		history.replaceState(null, '', newUrl);
	}
</script>

<div class="p-px">
	<h1>Multi Tabbed Window</h1>
	<div class="py-1 px-2">
		Sample:
		<select bind:value={sampleIndex} on:change={(ev) => changeRoute(ev)}>
			<option value={1}>1: single window</option>
			<option value={2}>2: 1 x 2 (2H, Two horizontal windows)</option>
			<option value={3}>3: 3 x 1 (3V, Three vertical windows)</option>
			<option value={4}>4: 3 x 2 (2H, Five windows)</option>
			<option value={5}>5: 3 | 2 | 2(3H, Seven windows)</option>
		</select>
		<details>
			<summary>Data</summary>
			<textarea class="w-full text-xs">{JSON.stringify(selectedData, null, 2)}</textarea>
		</details>
	</div>

	<MultiTabbedWindow
		tabs={selectedData}
		onNewTab={({ title }) => ({ title: title ?? 'acorn', createdAt: new Date() })}
		--mtw-background-color="rgb(113 113 122 / 1.0)"
		--mtw-tablist-background-color="rgb(40, 40, 40)"
		--mtw-tab-border-right-color="#343434"
		--mtw-tab-background-color="rgb(64 64 64)"
		--mtw-tab-background-color-selected="rgb(30 30 30)"
		--mtw-tab-text-color="#cfcfcf"
		--mtw-tab-text-color-selected="white"
		--mtw-tabpanel-background-color="rgb(30 30 30)"
		--mtw-splitter-background-color="rgb(30 30 30)"
		--mtw-splitter-opacity="1.0"
		--mtw-splitter-opacity--hover="0.5"
		--mtw-splitter-background-color-hover="rgb(39 59 169 / 1.0)"
		--mtw-splitter-border-size="2px"
		--mtw-splitter-center-line-border-color="rgb(53 53 53 / 1.0)"
		--mtw-splitter-size="7px"
		--mtw-splitter-vertical-size="5px"
		--mtw-splitter-padding-size="3px"
		--mtw-splitter-vertical-padding-size="2px"
		let:index
		let:tabState
		let:changeTabTitle
	>
		<!--tabs={tabStates}-->
		<!--tabs={windowStates1}-->
		<!--tabs={windowStates2}-->
		<!--tabs={windowStates3}-->
		<!--tabs={windowStates4}-->
		<div class="h-full p-2 text-xs">
			<input
				type="text"
				value={tabState.title}
				on:keyup={(ev) => {
					changeTabTitle(index, ev.currentTarget.value);
				}}
			/>
			<p class="text-white">
				created {tabState.createdAt}
			</p>
		</div>
	</MultiTabbedWindow>
</div>
