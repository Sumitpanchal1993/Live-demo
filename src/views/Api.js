

export const startRecording = async (req) => {
    const response = await (
        await fetch('http://10.99.32.166:7071/api/startRecording', {
            method: 'POST',
            body: JSON.stringify({ serverCallId: req.serverCallId }),
        })
    ).json();
    console.log(`Started recording for ${req.serverCallId}: ${response['recordingId']}`);
    return { recordingId: response['recordingId'] };
}



export const stopRecording = async (req) => {
    await fetch('http://10.99.32.166:7071/api/stopRecording', {
        method: 'POST',
        body: JSON.stringify({ serverCallId: req.serverCallId, recordingId: req.recordingId }),
    })
    console.log(`Stopped recording for ${req.serverCallId}: ${req.recordingId}`);
}


export const listRecordings = async (req) => {
    return await(
        await fetch(
            `http://10.99.32.166:7071/api/listRecordings?serverCallId=${encodeURIComponent(req.serverCallId)}`,
            { method: "GET" }
        )
    ).json();
}