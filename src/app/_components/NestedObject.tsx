/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ChevronDown, ChevronRight } from 'lucide-react'; // Import the dropdown icon
import { FC, useState } from 'react';

// Function to count properties in an object and return the formatted object
const countProperties = (obj: Record<string, any> | null | undefined): Record<string, any> => {
	// Handle null or undefined input
	if (obj === null || obj === undefined || typeof obj !== 'object') {
		return { objectItemCount: 0 }; // Return 0 count for non-objects
	}

	const result: Record<string, any> = { objectItemCount: Object.keys(obj).length }; // Initialize with property count

	for (const key in obj) {
		result[key] =
			typeof obj[key] === 'object' && obj[key] !== null ? countProperties(obj[key]) : obj[key];
	}

	return result;
};

const sortDescending = (name: string | number | boolean): string | undefined => {
	// Check if name is a string
	if (typeof name !== 'string') {
			return; // Do nothing if it's not a string
	}

	// Remove all double quotes from the string
	const cleanedName = name.replace(/"/g, '');

	// Handle specific key for display
	if (cleanedName === 'objectItemCount') {
			return 'objectItemCount';
	}

	// Separate characters into categories
	const lowercase = cleanedName
			.split('')
			.filter((char) => char >= 'a' && char <= 'z')
			.sort((a, b) => b.localeCompare(a));
	const uppercase = cleanedName
			.split('')
			.filter((char) => char >= 'A' && char <= 'Z')
			.sort((a, b) => b.localeCompare(a));
	const numbers = cleanedName
			.split('')
			.filter((char) => char >= '0' && char <= '9')
			.sort((a, b) => b.localeCompare(a));
	// Include all special characters, including space
	const specialChars = cleanedName
			.split('')
			.filter((char) => !/[a-zA-Z0-9]/.test(char)) // Now includes spaces as special characters
			.sort((a, b) => b.localeCompare(a));

	// Concatenate the sorted arrays in the desired order
	return [...lowercase, ...uppercase, ...numbers, ...specialChars].join('');
};

// Component to display nested objects
const NestedObjectDisplay: FC<{ obj: Record<string, any>; title: string }> = ({ obj, title }) => {
	const [isOpen, setIsOpen] = useState(false);

	// Icon for the dropdown
	const toggleIcon = isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />;

	return (
		<div className="mb-2">
			<div
				className="flex items-center cursor-pointer font-semibold"
				onClick={() => setIsOpen((prev) => !prev)}
			>
				{toggleIcon}
				<span className="ml-2">
					{title}
					{Array.isArray(obj) ? '(Array)' : `Item (${obj.objectItemCount})`}
				</span>
			</div>
			{isOpen && (
				<div className="ml-4">
					{Object.keys(obj).map((key) => {
						const value = obj[key];
						return (
							<div key={key}>
								{typeof value === 'object' && value !== null ? (
									<NestedObjectDisplay
										obj={value}
										title={Array.isArray(value) ? `Item ${key}` : key}
									/> // Display "Item" for arrays
								) : (
									<div className="flex">
										<strong>{sortDescending(key)}:</strong>
										<p className=" px-4 text-white rounded-lg bg-blue-500">
											{sortDescending(JSON.stringify(value).replace(/"/g, ''))}
										</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

// Main Display Component for Nested Objects
const NestedObject: FC<{ obj: Record<string, any> }> = ({ obj }) => {
	const countedObject = countProperties(obj);

	return (
		<div className="">
			<NestedObjectDisplay obj={countedObject} title="Processed URL Response" />
		</div>
	);
};

export default NestedObject;
