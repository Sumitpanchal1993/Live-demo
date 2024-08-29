import { Record20Regular, RecordStop20Filled } from "@fluentui/react-icons";
// import { CallAutomationClient } from '@azure/communication-call-automation';
// import { DefaultAzureCredential } from "@azure/identity"; 
import { startRecording, stopRecording } from "./Api";
import { registerIcons } from "@fluentui/react";

registerIcons({
    icons: {
        StartRecording: <Record20Regular />,
        StopRecording: <RecordStop20Filled />
    }
});

export const recordingButtonPropsCallback = (serverCallId, recordingId, setRecordingId,) => {
    // const credential = new DefaultAzureCredential(); 
const endpointUrl = 'https://cs-dev-us-livestream.unitedstates.communication.azure.com/' 
// const callAutomationClient = new CallAutomationClient(endpointUrl, credential); 
// const callAutomationClient = new CallAutomationClient.CallAutomationClient("<ACSConnectionString>");
    
    const isRecording = !!recordingId;
    return (args) => ({
        placement: 'primary',
        key: 'recordingButton',
        showLabel: true,
        text: isRecording ? 'Stop Recording' : 'Start Recording',
        iconName: isRecording ? 'StopRecording' : 'StartRecording',
        onItemClick: async () => {
            console.log(serverCallId,"<------server call id")
            if (!serverCallId) {
                console.warn('Recording buton: No serverCallId yet!');
                return;
            }

            if (isRecording) {
                // stop the recording
                // await stopRecording({ serverCallId, recordingId });
                console.log('STOP RECORDNG')
                setRecordingId('');
                return
            }

            // start the recording
            const { recordingId: newRecordingId } = await startRecording({ serverCallId });
            console.log(newRecordingId,'<---------newRecording id')
            setRecordingId(newRecordingId);
        }
    });
}
