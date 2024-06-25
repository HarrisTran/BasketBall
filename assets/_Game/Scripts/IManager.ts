export interface IManager
{
	/**
	 * Initializes the manager
	 */
	initialize();

	/**
	 * Returns the progress of the initialization.
	 * 
	 * Returned value is in range [0, 1]
	 */
	progress(): number;

	/**
	 * Returns whether the manager is initialized.
	 */
	initializationCompleted(): boolean;
}

