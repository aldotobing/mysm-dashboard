/**
 * Formats a number as a price string with IDR currency format
 * @param value - The number to format
 * @returns Formatted price string (e.g., "Rp 1.000.000")
 */
export const strPrice = (value: number | string): string => {
  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if the value is a valid number
  if (isNaN(numValue)) return 'Rp 0';
  
  // Format the number with thousand separators
  return `Rp ${numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};
