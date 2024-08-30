// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions } from '@azure/communication-common';
import { AbortSignalLike } from '@azure/abort-controller';

const postRefreshTokenParameters = {
  method: 'POST'
};

/**
 * Create credentials that auto-refresh asynchronously.
 */
export const createAutoRefreshingCredential = (userId, token) => {
  const options = {
    token: token,
    tokenRefresher: refreshTokenAsync(userId),
    refreshProactively: true
  };
  return new AzureCommunicationTokenCredential(options);
};

const refreshTokenAsync = (userIdentity) => {
  return async () => {
    const response = await  fetch(`http://localhost:8080/refreshToken/${userIdentity}`, postRefreshTokenParameters);
    if (response.ok) {
      return (await response.json()).token;
    } else {
      throw new Error('could not refresh token');
    }
  };
};
