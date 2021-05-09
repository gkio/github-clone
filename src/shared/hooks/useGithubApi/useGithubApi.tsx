import { useState, useEffect, useCallback } from 'react';
import { Octokit } from '@octokit/rest';
import { OctokitResponse, RequestParameters } from '@octokit/types';
import { API_URL } from '../../constants';
import { usePrevious } from '../usePrevious';
import deepEqual from 'deep-equal';

export const octokit = new Octokit({
  auth: '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',
  baseUrl: API_URL,
});

export type GithubResponse = OctokitResponse<any>['data'];

export interface IGithubApiResponse {
  data: GithubResponse | null;
  error: string | null;
}

export function useGithubApi(type: string, payload?: RequestParameters) {
  const prevPayload = usePrevious(payload);
  const [response, setResponse] = useState<IGithubApiResponse>({
    data: null,
    error: null,
  });
  const makeRequest = useCallback(
    async (requestPayload) => {
      try {
        const response: GithubResponse = await octokit.request(
          type,
          requestPayload
        );
        setResponse({ data: response.data, error: null });
      } catch (error) {
        console.error(error.message);
        setResponse({ data: null, error: error.message });
      }
    },
    [type]
  );

  useEffect(() => {
    if (payload && !deepEqual(payload, prevPayload)) {
      makeRequest(payload);
    }
  }, [payload, prevPayload, makeRequest]);

  return [response as GithubResponse, makeRequest as Function];
}
