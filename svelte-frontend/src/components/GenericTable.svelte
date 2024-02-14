<script>
	export let headers = [];
	export let rows = [];
	export let clickableRows = false;

	function handleRowClick(rowIndex) {
		if (clickableRows) {
			// Handle the row click event
		}
	}
</script>

<table class="generic-table font-sans">
	<thead>
		<tr>
			{#each headers as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each rows as row, rowIndex}
			<tr on:click={() => handleRowClick(rowIndex)}>
				{#each row as cell}
					<td>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	/* Add your generic table styles here */
	.highlighted-row {
		background-color: #ffe58f !important; /* Use any color you prefer for highlighting. The !important is to override any other background color styles. */
	}

	tbody tr::before {
		/* content: counter(rowNumber); 
		counter-increment: rowNumber;  */
		display: table-cell; /* Make it behave like a table cell */
		padding: 8px;
		border: 1px solid #ddd;
		text-align: right; /* Align the number to the right side of its cell */
		width: 1.5em; /* Adjust width as necessary */
		font-weight: bold;
	}

	tbody tr:hover::before {
		border: 1px solid #9fb5fc;
		background-color: #e7e9fc; /* Slight background change for clarity on hover */
	}

	table {
		border-collapse: separate;
		border-spacing: 0;
	}

	th,
	td {
		border-right: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th:first-child,
	td:first-child {
		border-left: 1px solid #ddd; /* Add left border for the first cell */
	}

	tr:first-child th {
		border-top: 1px solid #ddd; /* Add top border for the first row */
	}

	thead th {
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: #f2f2f2;
		box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	/* Overlap the tbody's first row with the sticky header */
	tbody {
		margin-top: -1px;
	}

	tbody tr {
		background-color: white;
	}

	tbody tr:nth-child(2n) {
		background-color: #f2f2f2;
	}

	/* Header cells hover effect */
	thead th:hover {
		border: 1px solid #9fb5fc;
		background-color: #e7e9fc; /* Slight background change for clarity on hover */
	}

	tbody td:hover {
		border: 1px solid #9fb5fc;
		background-color: #e7e9fc; /* Slight background change for clarity on hover */
	}

	.font-sans {
		font-family: Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
			Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
	}

	.table {
		font-size: 14px;
		text-overflow: ellipsis;
		height: 10px;
		width: 5px;
	}

	table td,
	table th {
		overflow: hidden;
		text-overflow: ellipsis; /* this will display '...' if the content is too long for the cell */
		white-space: nowrap; /* this will prevent the content from wrapping onto the next line */
	}
</style>
