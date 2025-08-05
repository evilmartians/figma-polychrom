<script lang="ts">
	import { ThemeVariablesKeys } from '~ui/types';

	interface Props {
		bgColor: string;
		color: string;
		opacity?: number;
		size: 'large' | 'small';
	}

	const exampleText = 'Aa';

	const { bgColor, color, opacity, size }: Props = $props();
</script>

<p
	class={[
		size === 'small' ? 'size-9 text-xxs' : 'h-13 w-13 text-base',
		'flex items-center justify-center rounded-lg border-0.5 text-base'
	]}
	style="background-color: {bgColor}; border-color: var({ThemeVariablesKeys.borderOriginal}); color: {color};"
>
	<span style="opacity: {opacity}">
		{exampleText}
	</span>
</p>
