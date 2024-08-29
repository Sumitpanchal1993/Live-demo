// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CallAdapterLocator, CallComposite, CallCompositeOptions, CommonCallAdapter, createAzureCommunicationCallAdapterFromClient, createStatefulCallClient, fromFlatCommunicationIdentifier } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { useIsMobile } from '../utils/useInMobile';
import { isIOS } from '../utils/utils';
import { CallScreenProps } from './CallScreen';
import { recordingButtonPropsCallback } from './RecordingButton';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {v1} from 'uuid'

export const CallCompositeContainer = (props) => {
  const { adapter } = props;
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const isMobileSession = useIsMobile();
  const shouldHideScreenShare = isMobileSession || isIOS();

  const [serverCallId, setServerCallId] = useState('');
  const [recordingId, setRecordingId] = useState('');
  const [callAdapter, setCallAdapter] = useState();

  const userId='8:acs:943cc36e-35ac-4e4a-a8c6-904c7917365a_00000022-37e1-b3e6-0d8b-084822005c19'
  const token='eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNUVCMzFEMzBBMjBEQkRBNTMxODU2MkM4QTM2RDFCMzIyMkE2MTkiLCJ4NXQiOiJZRjZ6SFRDaURiMmxNWVZpeUtOdEd6SWlwaGsiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOjk0M2NjMzZlLTM1YWMtNGU0YS1hOGM2LTkwNGM3OTE3MzY1YV8wMDAwMDAyMi0zN2UxLWIzZTYtMGQ4Yi0wODQ4MjIwMDVjMTkiLCJzY3AiOjE3OTIsImNzaSI6IjE3MjQ4MzIwMjYiLCJleHAiOjE3MjQ5MTg0MjYsInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6ImNoYXQsdm9pcCIsInJlc291cmNlSWQiOiI5NDNjYzM2ZS0zNWFjLTRlNGEtYThjNi05MDRjNzkxNzM2NWEiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNzI0ODMyMDI2fQ.LWG8P8NyPNNzhx5TDQuZ6fovE2K1eaKrCUbOpnT3AjhkKCU4jXrzRVzp_IhceWoH3Rv7iFNQoc4qxWOo-ddakzH-U1ence9sMT37Zpol-jc79bMH2Fjbspg8ne9NG3b1yBfSTcAf2LpXwIgZZ8TmV4WVa8LVbYjojR5r7FSBWIx8J3grz6f9HEfYSr4Ac80ntUeheQC-tLpK3q64c9P9bp1sLEWhVJp-6Fln9pGjJOnHb215F3xrqsUjLd-TKuqgb0bnc7iv15ehdC1AKCQdEcZaECFIRz_Ysf7CUpEQFNe-4u4fjvFKdJpsIkTmjEtXl1YEYHv5HecTImDAuTDcGw'
  const groupId = v1()
  const displayName="Manoj"

  useEffect(() => {
    /**
     * We want to make sure that the page is up to date. If for example a browser is dismissed
     * on mobile, the page will be stale when opened again. This event listener will reload the page
     */

    //Call reacording  Start 

    // const createAdapter = async ()=> {
    //   const callClient = createStatefulCallClient({
    //     userId: fromFlatCommunicationIdentifier(userId) ,
    //   })
    //   const callAgent = await callClient.createCallAgent(new AzureCommunicationTokenCredential(token), { displayName: displayName });
    //   const newAdapter = await createAzureCommunicationCallAdapterFromClient(callClient, callAgent, { groupId });
    //   setCallAdapter(newAdapter);
    //   newAdapter.onStateChange(async (state) => {
    //     if (state.call?.state === 'Connected') {
    //       const call = callAgent.calls.find((call) => call.id === state.call?.id);
    //       if (call) {
    //         setServerCallId(await call.info.getServerCallId());
    //       }
    //     }
    //   })
    // };
    // createAdapter();
    // End
    

    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    });
    return () => {
      window.removeEventListener('pageshow', () => {
        window.location.reload();
      });
    };



  }, []);

  const options = useMemo(
    () => ({
      callControls: {
        screenShareButton: shouldHideScreenShare ? false : undefined,
        endCallButton: {
          hangUpForEveryone: 'endCallOptions'
        },
        onFetchCustomButtonProps: [
          recordingButtonPropsCallback(serverCallId, recordingId, setRecordingId)
        ]
      },
      autoShowDtmfDialer: true
    }),
    [shouldHideScreenShare]
  );

  // Dispose of the adapter in the window's before unload event.
  // This ensures the service knows the user intentionally left the call if the user
  // closed the browser tab during an active call.
  useEffect(() => {
    const disposeAdapter = () => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  let callInvitationUrl = window.location.href;
  // Only show the call invitation url if the call is a group call or Teams call, do not show for Rooms, 1:1 or 1:N calls
  if (props.callLocator && !isGroupCallLocator(props.callLocator) && !isTeamsMeetingLinkLocator(props.callLocator)) {
    callInvitationUrl = undefined;
  }

  return (
    <CallComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      callInvitationUrl={callInvitationUrl}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
      options={options}
    />
  );
};

const isTeamsMeetingLinkLocator = (locator ) => {
  return 'meetingLink' in locator;
};

const isGroupCallLocator = (locator) => {
  return 'groupId' in locator;
};
