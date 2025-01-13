<script lang="ts">
	export let keys: string;
	export let label: string | undefined = undefined;
</script>

<div class="flex items-center gap-2 text-xs text-gray-500">
	<kbd
		class="py-0.3 inline-flex items-center rounded border border-gray-200 bg-gray-100 px-1 text-[0.65rem] font-medium text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
	>
		{keys}
	</kbd>
	{#if label}
		<span>{label}</span>
	{/if}
</div>
