'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';


// components
import NestedObject from './NestedObject';

const JsonFetcher = () => {
	const [endpoint, setEndpoint] = useState<string>(''); // Holds the API endpoint
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [storedJson, setStoredJson] = useState<any>(null); // Holds the fetched JSON

	// Fetch JSON from the entered API endpoint
	const fetchJson = async () => {
		if (!endpoint) {
			console.error('Please enter a valid API endpoint.');
			return;
		}

		try {
			const response = await fetch(endpoint);
			const data = await response.json();

			// Store JSON and API endpoint in localStorage
			localStorage.setItem('storedJson', JSON.stringify(data));
			localStorage.setItem('storedEndpoint', endpoint); // Save endpoint too

			// Update the state
			setStoredJson(data);
			console.log('Fetched JSON:', data);
		} catch (error) {
			console.error('Failed to fetch the JSON:', error);
		}
	};

	// Check if there's already stored JSON and API endpoint in localStorage on initial load
	useEffect(() => {
		const storedData = localStorage.getItem('storedJson');
		const savedEndpoint = localStorage.getItem('storedEndpoint');

		if (storedData) {
			console.log('Stored JSON in localStorage:', JSON.parse(storedData));
			setStoredJson(JSON.parse(storedData));
		}

		if (savedEndpoint) {
			setEndpoint(savedEndpoint); // Pre-fill input with stored API endpoint
		}
	}, []); // Empty dependency array to run on mount

	return (
		<div className="p-4">
			{/* Input field to enter the API endpoint */}
			<div className="flex space-x-10">
				<Input
					type="text"
					placeholder="Enter API endpoint"
					value={endpoint}
					onChange={(e) => setEndpoint(e.target.value)}
					className="p-2 border rounded-lg mb-4 w-full bg-white"
					required
				/>

				{/* Button to fetch and store JSON */}
				<Button onClick={fetchJson} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
					Query
				</Button>
			</div>

			{/* Display stored JSON if available */}
			<div className="flex justify-between space-x-20">
				<div className="overflow-scroll h-[80vh] w-[50%] mt-4 p-4 bg-gray-100 rounded-lg">
					<h3 className="font-bold">URL Response:</h3>
					{storedJson && <pre className="text-sm">{JSON.stringify(storedJson, null, 2)}</pre>}
				</div>

				<div className="overflow-scroll h-[80vh] w-[50%] mt-4 p-4 bg-gray-100 rounded-lg">
					<h3 className="font-bold">URL Response:</h3>
					{storedJson && <NestedObject obj={storedJson} />}
				</div>
			</div>
		</div>
	);
};

export default JsonFetcher;
