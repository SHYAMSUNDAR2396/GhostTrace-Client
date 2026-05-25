/**
 * GhostTrace API client module.
 * Provides functions for communicating with the FastAPI backend.
 */

export const BASE_URL = 'http://localhost:8000';

/**
 * Upload an evidence JSON file to the backend.
 * @param {File} file - The JSON evidence file to upload.
 * @returns {Promise<{case_id: string, artifact_types: string[], total_artifacts: number}>}
 *   Parsed response containing case metadata.
 * @throws {Error} If the upload fails or the server returns an error.
 */
export async function uploadEvidence(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.detail || `Upload failed with status ${response.status}`;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to reach the GhostTrace backend. Is the server running?');
    }
    throw error;
  }
}

/**
 * Fetch the list of uploaded cases from the backend.
 * @returns {Promise<Array<{case_id: string, incident_type: string, artifact_count: number}>>}
 *   Array of case metadata objects.
 * @throws {Error} If the request fails or the server returns an error.
 */
export async function getCases() {
  try {
    const response = await fetch(`${BASE_URL}/cases`);

    if (!response.ok) {
      throw new Error(`Failed to fetch cases: server returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to reach the GhostTrace backend. Is the server running?');
    }
    throw error;
  }
}
